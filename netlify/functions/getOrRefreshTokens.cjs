const axios = require("axios")
const admin = require("firebase-admin")

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const svc = process.env.FIREBASE_SERVICE_ACCOUNT
    if (!svc) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var")
    let creds
    try {
        creds = JSON.parse(svc)
    } catch {
        throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON")
    }
    admin.initializeApp({ credential: admin.credential.cert(creds) })
}

const db = admin.firestore()

const QB_COLLECTION = process.env.QB_COLLECTION
const QB_DOC_ID = process.env.QB_DOC_ID
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
if (!QB_COLLECTION || !QB_DOC_ID) throw new Error("Missing QB_COLLECTION/QB_DOC_ID env vars")
if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("Missing CLIENT_ID/CLIENT_SECRET env vars")

const INTUIT_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
const EXPIRY_SKEW_SECONDS = 120 // refresh slightly early to avoid race conditions

async function getOrRefreshTokens() {
    const tokenRef = db.collection(QB_COLLECTION).doc(QB_DOC_ID)
    const snap = await tokenRef.get()

    if (!snap.exists) throw new Error("No token document found.")
    const data = snap.data()

    const expiresAt = Number(data.access_token_expires_at)
    if (!Number.isFinite(expiresAt)) throw new Error("Invalid expiry timestamp in Firestore")

    const nowInSeconds = Math.floor(Date.now() / 1000)

    // Refresh if expired OR within the skew window
    if (!data.access_token || nowInSeconds + EXPIRY_SKEW_SECONDS >= expiresAt) {
        const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")

        const response = await axios.post(
            INTUIT_TOKEN_URL,
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: data.refresh_token
            }),
            {
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000,
                validateStatus: s => s >= 200 && s < 500
            }
        )

        if (response.status !== 200) {
            const msg = response.data?.error_description || response.data?.error || `HTTP ${response.status}`
            throw new Error(`Failed to refresh tokens: ${msg}`)
        }

        const { access_token, refresh_token, expires_in } = response.data || {}
        if (!access_token || !expires_in) {
            throw new Error("Refresh response missing access_token or expires_in")
        }

        const newExpiry = nowInSeconds + Number(expires_in) - EXPIRY_SKEW_SECONDS

        const update = {
            access_token,
            access_token_expires_at: newExpiry
        }
        // Only persist a new refresh_token if Intuit rotated it
        if (refresh_token && refresh_token !== data.refresh_token) {
            update.refresh_token = refresh_token
        }

        await tokenRef.update(update)

        return {
            accessToken: access_token,
            expiresAt: newExpiry
        }
    }

    // Token is still valid
    return {
        accessToken: data.access_token,
        expiresAt
    }
}

exports.handler = async () => {
    try {
        const tokens = await getOrRefreshTokens()
        return {
            statusCode: 200,
            body: JSON.stringify({ tokens })
        }
    } catch (err) {
        console.error("Error in getOrRefreshTokens:", err.message)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to obtain access token." })
        }
    }
}
