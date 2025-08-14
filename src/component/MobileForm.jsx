import {
    Card
} from '@mui/material';


export default function FormCard() {
    return (
        <>
            <Card sx={{
                maxWidth: 400, width: 350, margin: 'auto',
                maxHeight: 600, height: 500,
                mt: 4, p: 3, borderRadius: 3, mx: 'auto',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
            }}>
            </Card >
            <div className="background-accent"></div>
        </>
    );
}
