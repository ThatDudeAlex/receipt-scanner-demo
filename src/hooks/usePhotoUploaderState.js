import { useState, useCallback } from 'react'

export function usePhotoUploaderState(
    photos,
    setPhotos,
    setReceipt,
    handleReview, // called when validation passes
    maxPhotos = 1 // currently only allow 1
) {
    const [errors, setErrors] = useState({
        photos: false
    })
    const [shake, setShake] = useState(false)

    const clearPhotoErrorIfAny = useCallback(() => {
        if (photos.length > 0 && errors.photos) {
            setErrors(prev => ({
                ...prev,
                photos: false
            }))
        }
    }, [photos.length, errors.photos])

    const addFiles = useCallback((files) => {
        if (!files || !files[0]) return

        // honor maxPhotos
        if (photos.length >= maxPhotos) return

        const file = files[0]
        const reader = new FileReader()
        reader.onload = () => {
            setPhotos(prev => [...prev, {
                id: Date.now(),
                url: String(reader.result)
            }])
            clearPhotoErrorIfAny()
            // clearing any previously parsed receipt since photo changed
            setReceipt(null)
        }
        reader.readAsDataURL(file)
    }, [photos.length, maxPhotos, setPhotos, setReceipt, clearPhotoErrorIfAny])

    const deletePhoto = useCallback((id) => {
        setPhotos(prev => prev.filter(p => p.id !== id))
        setReceipt(null)
    }, [setPhotos, setReceipt])

    const validateAndProceed = useCallback(() => {
        const nextErrors = {
            photos: photos.length === 0
        }
        setErrors(nextErrors)

        if (nextErrors.photos) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return
        }
        setShake(false)
        handleReview()
    }, [photos.length, handleReview])

    return {
        errors,
        shake,
        addFiles,
        deletePhoto,
        validateAndProceed,
    }
}