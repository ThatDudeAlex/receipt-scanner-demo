import React from 'react'
import {
    Typography, CardContent, CardActions, Button, Divider, Box
} from '@mui/material'
import { formatMoney, formatDateTime, safeText } from '../utils/formatters'

export default React.memo(function ReviewInfoView({
    handleBack,
    receipt,
}) {
    // Graceful empty state if parsing hasn’t produced a receipt
    if (!receipt) {
        return (
            <>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6" gutterBottom>Verify Receipt Details</Typography>
                    <Typography variant="body2" color="text.secondary">
                        No receipt details available yet. Go back and add a photo to continue.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box display="flex" justifyContent="flex-start" width="100%">
                        <Button variant="outlined" onClick={handleBack} size="large">Back</Button>
                    </Box>
                </CardActions>
            </>
        )
    }

    return (
        <>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom>Verify Receipt Details</Typography>

                <Divider sx={{ mb: 1 }} />

                <Row label="Supplier" value={safeText(receipt.supplierName?.value)} />

                <Row
                    label="Date & Time"
                    value={formatDateTime(receipt.date, receipt.time)}
                />

                <Row
                    label="Supplier Address"
                    value={safeText(receipt.supplierAddress?.value)}
                    multiline
                />

                <Divider sx={{ my: 2 }} />

                <Row label="Net Total" value={formatMoney(receipt.totalNet)} />
                <Row label="Tax" value={formatMoney(receipt.totalTax)} />
                <Row label="Total Amount" value={formatMoney(receipt.totalAmount)} emphasis />
            </CardContent>

            <CardActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="outlined" onClick={handleBack} size="large">Back</Button>
                    <Button variant="contained" size="large" type="submit">Submit</Button>
                </Box>
            </CardActions>
        </>
    )
})

function Row({
    label,
    value,
    emphasis = false,
    multiline = false,
}) {
    return (
        <Box
            mb={2}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                alignItems: multiline ? 'flex-start' : 'center',
            }}
        >
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 120 }}>
                {label}
            </Typography>
            <Typography
                variant={emphasis ? 'h6' : 'body1'}
                className="receipt-info"
                sx={{
                    textAlign: 'right',
                    wordBreak: multiline ? 'break-word' : 'normal',
                    whiteSpace: multiline ? 'normal' : 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 220,
                }}
            >
                {value}
            </Typography>
        </Box>
    )
}