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

export async function uploadReceipt(expenseId, imgBlob) {
    const tokens = await getTokens()
    const form = new FormData()
    form.append('expenseId', expenseId)
    form.append('document', imgBlob, 'receipt.jpg')

    const res = await fetch(`${basePath}uploadReceipt`, { method: 'POST', body: form })
    if (!res.ok) throw new Error(`uploadReceipt failed: ${res.status}`)
    return res.json()
}
