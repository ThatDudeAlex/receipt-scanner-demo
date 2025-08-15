import { Card, Box } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'
import StartingView from './StartingView'
import PhotoUploaderView from './PhotoUploaderView'
import ReviewInfoView from './ReviewInfoView'
import UploadedSuccessfully from './UploadedSuccessfully'
import { useFormCardState } from '../hooks/useFormCardState'

export default function FormCard() {
    const {
        loading, view, direction,
        jobSites, name, selectedReceiptType, selectedJobSite, photos, receipt, expenseId,
        setName, setReceiptType, setSelectedJobSite, setPhotos, setReceipt,
        handleBack, handleForward, handleReview, handleCompletion, submitForm,
    } = useFormCardState()

    const renderView = () => {
        switch (view) {
            case 1:
                return (
                    <StartingView
                        name={name}
                        selectedReceiptType={selectedReceiptType}
                        setReceiptType={setReceiptType}
                        selectedJobSite={selectedJobSite}
                        setSelectedJobSite={setSelectedJobSite}
                        jobSites={jobSites}
                        handleForward={handleForward}
                        setName={setName}
                    />
                )
            case 2:
                return (
                    <PhotoUploaderView
                        photos={photos}
                        setPhotos={setPhotos}
                        setReceipt={setReceipt}
                        handleBack={handleBack}
                        handleReview={handleReview}
                    />
                )
            case 3:
                return <ReviewInfoView handleBack={handleBack} receipt={receipt} />
            case 4:
                return <UploadedSuccessfully isSubmitting={loading} showId={expenseId} onDone={handleCompletion} />
            default:
                return null
        }
    }

    return (
        <>
            <Card
                sx={{
                    maxWidth: 400, width: 350, margin: 'auto',
                    maxHeight: 600, height: 500,
                    mt: 4, p: 3, borderRadius: 3, mx: 'auto',
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                }}
            >
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <Box>
                        <form onSubmit={submitForm}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={view}
                                    initial={{ x: direction === 1 ? 40 : -40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction === 1 ? -40 : 40, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ width: '100%' }}
                                >
                                    {renderView()}
                                </motion.div>
                            </AnimatePresence>
                        </form>
                    </Box>
                )}
            </Card>
            <div className="background-accent"></div>
        </>
    )
}