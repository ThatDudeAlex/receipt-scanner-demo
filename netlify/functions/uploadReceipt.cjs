const axios = require('axios')
const FormData = require('form-data')
const { getOrRefreshTokens } = require("./getOrRefreshTokens");


exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { purchaseId, fileName = 'receipt.jpg', contentType = 'image/jpeg', imgBase64 } = JSON.parse(event.body || '{}')
    if (!purchaseId || !imgBase64) {
        return { statusCode: 400, body: JSON.stringify({ error: 'purchaseId and imgBase64 are required' }) }
    }

    try {
        const { accessToken } = await getOrRefreshTokens();

        const baseUrl = process.env.DEV_BASE_URL
        const realmId = process.env.DEV_REALM_ID
        const minorVersion = '65'

        const fileBuffer = Buffer.from(imgBase64, 'base64')

        const form = new FormData()
        form.append(
            'file_metadata_01',
            JSON.stringify({
                AttachableRef: [{ EntityRef: { type: 'Purchase', value: String(purchaseId) } }],
                FileName: fileName,
                ContentType: contentType,
                Category: 'Document',
                Tag: 'Receipt'
            }),
            { filename: 'attachment.json', contentType: 'application/json; charset=UTF-8' }
        )
        form.append('file_content_01', fileBuffer, { filename: fileName, contentType })

        const url = `${baseUrl}/${realmId}/upload?minorversion=${minorVersion}`
        const { data } = await axios.post(url, form, {
            headers: { Authorization: `Bearer ${accessToken}`, ...form.getHeaders() },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })

        return { statusCode: 200, body: JSON.stringify(data) }
    } catch (err) {
        console.error('Receipt upload failed:', err.response?.data || err.message)
        return {
            statusCode: err.response?.status || 500,
            body: JSON.stringify({ error: 'Failed to upload & attach receipt', details: err.response?.data || err.message })
        }
    }
}