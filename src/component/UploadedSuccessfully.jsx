import { useState, useEffect } from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function UploadedSuccessfully({ isSubmitting, onDone, showId }) {
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (!isSubmitting) {
            // small delay so any spinner can fade out first
            const timer = setTimeout(() => setShowSuccess(true), 400);
            return () => clearTimeout(timer);
        } else {
            setShowSuccess(false);
        }
    }, [isSubmitting]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="200px"
        >
            <Fade in={showSuccess} timeout={600} unmountOnExit>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                    <Typography mt={2}>Receipt uploaded successfully!</Typography>


                    {showId != null && (
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Quickbooks Reference ID: <strong>{String(showId)}</strong>
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        sx={{ mt: 4 }}
                        onClick={onDone}
                        size="large"
                    >
                        Done
                    </Button>
                </Box>
            </Fade>
        </Box>
    );
}
