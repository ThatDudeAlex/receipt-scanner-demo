import { useRef, useEffect, useCallback } from 'react'
import {
    Box, Typography, Grid, Card, CardMedia, CardActions, IconButton, Button, CardContent
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import DeleteIcon from '@mui/icons-material/Delete'
import { usePhotoUploaderState } from '../hooks/usePhotoUploaderState'

export default function PhotoUploaderView({
    photos = [],
    setPhotos,
    setReceipt,
    handleBack,
    handleReview,
}) {
    const inputRef = useRef(null)

    const {
        errors,
        shake,
        addFiles,
        deletePhoto,
        validateAndProceed,
    } = usePhotoUploaderState(photos, setPhotos, setReceipt, handleReview, 1)

    // open the native picker
    const openPicker = useCallback(() => {
        inputRef.current?.click()
    }, [])

    useEffect(() => { }, [photos])

    return (
        <>
            {/* hidden file input (React-owned) */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment" // mobile hint for rear camera
                style={{ display: 'none' }}
                onChange={(e) => addFiles(e.target.files)}
            />

            {/* Shake keyframes */}
            <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>

            <CardContent sx={{ pt: 2, pb: 0, animation: shake ? 'shake 0.4s' : 'none' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Receipt Photo
                </Typography>
                <Typography variant="body2" align="center">
                    Take or upload a photo
                </Typography>

                <Grid container spacing={2} justifyContent="center" mt={2} mb={1}>
                    {photos.map(photo => (
                        <Grid item key={photo.id}>
                            <Card sx={{ width: 250, boxShadow: 1, borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    image={photo.url}
                                    alt="Uploaded"
                                    sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                                />
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <IconButton onClick={() => deletePhoto(photo.id)} aria-label="Delete photo">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}

                    {photos.length < 1 && (
                        <Grid item>
                            <Card
                                onClick={openPicker}
                                sx={{
                                    width: 250,
                                    height: 256,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '2px dashed grey',
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: '#f9f9f9',
                                    },
                                }}
                                role="button"
                                aria-label="Add photo"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
                            >
                                <PhotoCameraIcon fontSize="large" />
                            </Card>
                        </Grid>
                    )}
                </Grid>

                <Typography
                    variant="caption"
                    sx={{
                        visibility: errors.photos ? 'visible' : 'hidden',
                        color: 'error.main',
                        textAlign: 'center',
                        display: 'block',
                        mt: 1
                    }}
                >
                    Photo is required
                </Typography>
            </CardContent>

            <CardActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="outlined" onClick={handleBack} size="large">
                        Back
                    </Button>
                    <Button variant="contained" onClick={validateAndProceed} size="large">
                        Review
                    </Button>
                </Box>
            </CardActions>
        </>
    )
}