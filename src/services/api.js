export const basePath = '/.netlify/functions/'

export async function getTokens() {
    const res = await fetch(`${basePath}getOrRefreshTokens`)
    if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`)
    const { tokens } = await res.json()
    return tokens
}

export async function getProjects(accessToken) {
    const res = await fetch(`${basePath}getProjects?accessToken=${accessToken}`)
    if (!res.ok) throw new Error(`Projects fetch failed: ${res.status}`)
    const { activeProjects } = await res.json()
    return activeProjects
}

export async function parseReceiptImage(blob) {
    const form = new FormData()
    form.append('document', blob, 'receipt.jpg')
    const res = await fetch(`${basePath}parseReceipt`, { method: 'POST', body: form })
    if (!res.ok) throw new Error(`parseReceipt failed: ${res.status}`)
    return res.json()
}

export async function createExpense(params) {
    const tokens = await getTokens()
    const search = new URLSearchParams({ accessToken: tokens.accessToken, ...params })
    const res = await fetch(`${basePath}createExpense?${search.toString()}`)
    if (!res.ok) throw new Error(`createExpense failed: ${res.status}`)
    return res.json()
}

// == Receipt image uploading ==

async function blobToBase64(blob) {
    const buf = await blob.arrayBuffer();
    // convert ArrayBuffer -> base64
    let binary = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

export async function uploadReceipt(purchaseId, imgBlob) {
    const imgBase64 = await blobToBase64(imgBlob);

    const res = await fetch(`${basePath}uploadReceipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            purchaseId: String(purchaseId),
            fileName: 'receipt.jpg',
            contentType: 'image/jpeg',
            imgBase64
        })
    });

    if (!res.ok) throw new Error(`uploadReceipt failed: ${res.status}`);
    return res.json();
}
