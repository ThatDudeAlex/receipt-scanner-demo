import dayjs from 'dayjs'

export function formatMoney(field) {
    const v = field?.value
    if (v == null || Number.isNaN(v)) return '—'
    // Use Intl for locale-safe currency (fallback to fixed if needed)
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD'
        }).format(v)
    } catch {
        return `$${Number(v).toFixed(2)}`
    }
}

export function formatDateTime(dateField, timeField) {
    const d = dateField?.value
    const t = timeField?.value
    if (!d || !t) return '—'
    const dt = dayjs(`${d}T${t}`)
    return dt.isValid() ? dt.format('MM/DD/YYYY h:mm A') : '—'
}

export function safeText(value) {
    return value && String(value).trim() ? String(value) : '—'
}