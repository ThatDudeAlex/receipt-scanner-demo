import { useState, useCallback } from 'react'

export function useStartingViewState(
    name,
    setName,
    selectedReceiptType,
    setReceiptType,
    selectedJobSite,
    setSelectedJobSite,
    handleForward
) {
    const [errors, setErrors] = useState({ name: false, receiptType: false, jobSite: false })
    const [shake, setShake] = useState(false)

    const handleNameChange = useCallback((e) => {
        const v = e.target.value
        setName(v)
        if (v.trim() !== '') setErrors(prev => ({ ...prev, name: false }))
    }, [setName])

    const handleReceiptTypeChange = useCallback((e) => {
        const v = e.target.value
        setReceiptType(v)
        if (v !== '') setErrors(prev => ({ ...prev, receiptType: false }))
    }, [setReceiptType])

    const handleJobSiteChange = useCallback((e) => {
        const v = e.target.value
        setSelectedJobSite(v)
        if (v !== '') setErrors(prev => ({ ...prev, jobSite: false }))
    }, [setSelectedJobSite])

    const canContinue = useCallback(() => {
        const validationErrors = {
            name: name.trim() === '',
            receiptType: selectedReceiptType === '',
            jobSite: selectedJobSite === ''
        }
        setErrors(validationErrors)

        const hasError = Object.values(validationErrors).some(Boolean)
        if (hasError) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return
        }
        handleForward()
    }, [name, selectedReceiptType, selectedJobSite, handleForward])

    return {
        errors,
        shake,
        handleNameChange,
        handleReceiptTypeChange,
        handleJobSiteChange,
        canContinue,
    }
}