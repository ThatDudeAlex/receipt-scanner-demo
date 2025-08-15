import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50%',
            }}
        >
            <CircularProgress sx={{ mb: 3 }} />
            <div>Loading</div>
        </Box>
    );
}
