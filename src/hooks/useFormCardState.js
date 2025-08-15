import { useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { getTokens, getProjects, parseReceiptImage, createExpense, uploadReceipt } from '../services/api'
import { compressImage } from '../utils/compressImage'

export function useFormCardState() {
    // UI/loading
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(1)
    const [direction, setDirection] = useState(1)

    // Form fields
    const [jobSites, setJobSites] = useState([])
    const [name, setName] = useState('')
    const [selectedReceiptType, setReceiptType] = useState('')
    const [selectedJobSite, setSelectedJobSite] = useState('')

    // Images / parsed receipt
    const [photos, setPhotos] = useState([])
    const [backgroundImg, setBackgroundImg] = useState(null)
    const [receipt, setReceipt] = useState(null)
    const [expenseId, setExpenseId] = useState(-1)

    // initial projects load
    useEffect(() => {
        (async () => {
            try {
                const { accessToken } = await getTokens()
                const projects = await getProjects(accessToken)
                setJobSites(projects)
            } catch (err) {
                console.error('Init load error:', err)
            }
        })()
    }, [])

    // navigation
    const handleBack = useCallback(() => {
        setDirection(-1)
        setView((v) => (v > 1 ? v - 1 : v))
    }, [])

    const handleForward = useCallback(() => {
        setDirection(1)
        setView((v) => (v < 4 ? v + 1 : v))
    }, [])

    const stateReset = useCallback(() => {
        setName('')
        setReceiptType('')
        setSelectedJobSite('')
        setPhotos([])
        setReceipt(null)
        setView(1)
        setDirection(1) // after setView for last slide behavior
    }, [])

    const handleCompletion = useCallback(() => {
        setDirection(-1)
        stateReset()
    }, [stateReset])

    // image -> parse
    const processImage = useCallback(async () => {
        if (!photos[0]?.url) return
        setLoading(true)
        try {
            const blob = await compressImage(photos[0].url)
            setBackgroundImg(blob)
            const parsed = await parseReceiptImage(blob)
            setReceipt(parsed.inference?.prediction ?? null)
            handleForward()
        } catch (e) {
            console.error('processImage error:', e)
        } finally {
            setLoading(false)
        }
    }, [photos, handleForward])

    const handleReview = useCallback(() => {
        if (receipt) handleForward()
        else processImage()
    }, [receipt, processImage, handleForward])

    // submit
    const submitForm = useCallback(async (e) => {
        e?.preventDefault?.()
        if (!receipt) return

        setLoading(true)
        try {
            // split selects "id-name" → [id, name]
            const [receiptId, receiptType] = (selectedReceiptType || '').split('-')
            const [projectId, project] = (selectedJobSite || '').split('-')

            const payload = {
                user: name,
                receiptId: receiptId ?? '',
                receiptType: receiptType ?? '',
                projectId: projectId ?? '',
                project: project ?? '',
            }

            if (receipt.date?.value) {
                payload.dateIsoFormat = dayjs(receipt.date.value).format('YYYY-MM-DD')
            }
            if (receipt.date?.value && receipt.time?.value) {
                payload.dateTime = dayjs(`${receipt.date.value}T${receipt.time.value}`).format('MM/DD/YYYY h:mm A')
            }
            if (receipt.supplierName?.value) payload.supplierName = receipt.supplierName.value
            if (receipt.supplierAddress?.value) payload.supplierAddress = receipt.supplierAddress.value
            if (receipt.totalAmount?.value) payload.totalAmount = String(receipt.totalAmount.value)

            const result = await createExpense(payload)
            const id = result?.Purchase?.Id
            if (id) {
                setExpenseId(id)
                if (backgroundImg) {
                    // fire & forget is okay; you can await if you need confirmation
                    try { await uploadReceipt(String(id), backgroundImg) }
                    catch (err) { console.error('uploadReceipt error:', err) }
                    finally { setBackgroundImg(null) }
                }
            }
            setView(4)
        } catch (err) {
            console.error('submitForm error:', err)
        } finally {
            setLoading(false)
        }
    }, [name, selectedReceiptType, selectedJobSite, receipt, backgroundImg])

    return {
        // UI state
        loading, view, direction,

        // form state
        jobSites, name, selectedReceiptType, selectedJobSite, photos, receipt, expenseId,

        // setters (pass to children as needed)
        setName, setReceiptType, setSelectedJobSite, setPhotos, setReceipt,

        // actions
        handleBack, handleForward, handleReview, handleCompletion, submitForm,
    }
}