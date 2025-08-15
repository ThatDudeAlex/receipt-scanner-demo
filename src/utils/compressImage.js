export function compressImage(dataUrl, maxWidth = 1600) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width)
            const w = img.width * scale
            const h = img.height * scale
            const canvas = document.createElement('canvas')
            canvas.width = w
            canvas.height = h
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, w, h)
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7)
        }
        img.src = dataUrl
    })
}