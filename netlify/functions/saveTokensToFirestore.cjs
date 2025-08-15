const admin = require('firebase-admin');

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

async function saveTokensToFirestore(tokens) {
    const tokenRef = db.collection(QB_COLLECTION).doc(QB_DOC_ID)
    await tokenRef.set(tokens);
    console.log('Saved Tokens');
}

exports.handler = async function (event, context) {
    const { accessToken, refreshToken, expiresIn } = event.queryStringParameters;

    try {
        await saveTokensToFirestore({
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires_at: expiresIn
        });
        return {
            statusCode: 200,
            body: JSON.stringify("Tokens Saved Successfully"),
        };
    } catch (e) {
        console.error("Error saving tokens:", e.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save tokens successfully' }),
        };
    }
};
