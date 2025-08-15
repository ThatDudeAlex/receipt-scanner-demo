import {
    TextField, Typography, FormControl, InputLabel, Select, MenuItem,
    CardContent, CardActions, Button
} from '@mui/material'
import React from 'react'
import { useStartingViewState } from '../hooks/useStartingViewState'

function StartingView({
    name, setName,
    selectedReceiptType, setReceiptType,
    selectedJobSite, setSelectedJobSite,
    jobSites,
    handleForward
}) {
    const {
        errors, shake,
        handleNameChange,
        handleReceiptTypeChange,
        handleJobSiteChange,
        canContinue,
    } = useStartingViewState(
        name, setName,
        selectedReceiptType, setReceiptType,
        selectedJobSite, setSelectedJobSite,
        handleForward
    )

    return (
        <>
            <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>

            <CardContent sx={{ pb: 2, animation: shake ? 'shake 0.4s' : 'none' }}>
                <Typography variant="h5" gutterBottom>Receipt Uploader</Typography>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Name"
                        name="name"
                        value={name}
                        error={errors.name}
                        onChange={handleNameChange}
                        slotProps={{
                            inputLabel: { sx: { fontWeight: 600, color: '#333' } },
                        }}
                    />
                    <Typography
                        variant="caption"
                        sx={{ visibility: errors.name ? 'visible' : 'hidden', color: 'error.main' }}
                    >
                        Name is required
                    </Typography>
                </FormControl>

                <FormControl fullWidth margin="normal" error={errors.receiptType}>
                    <InputLabel id="receipt-type-select-label" sx={{ fontWeight: 600, color: '#333' }}>
                        Receipt Type
                    </InputLabel>
                    <Select
                        labelId="receipt-type-select-label"
                        value={selectedReceiptType}
                        label="Receipt Type"
                        name="receipt_type"
                        onChange={handleReceiptTypeChange}
                        sx={{ textAlign: 'left' }}
                    >
                        <MenuItem value="" disabled>Select receipt type</MenuItem>
                        <MenuItem value="95-Materials">Materials</MenuItem>
                        <MenuItem value="62-Equipment Rental">Tool Rentals</MenuItem>
                    </Select>
                    <Typography
                        variant="caption"
                        sx={{ visibility: errors.receiptType ? 'visible' : 'hidden', color: 'error.main' }}
                    >
                        Receipt type is required
                    </Typography>
                </FormControl>

                <FormControl fullWidth margin="normal" error={errors.jobSite}>
                    <InputLabel id="job-site-select-label" sx={{ fontWeight: 600, color: '#333' }}>
                        Job Sites
                    </InputLabel>
                    <Select
                        labelId="job-site-select-label"
                        value={selectedJobSite}
                        label="Job Sites"
                        name="job_site"
                        onChange={handleJobSiteChange}
                        sx={{ textAlign: 'left' }}
                    >
                        <MenuItem value="" disabled>Select job site</MenuItem>
                        {jobSites.map(({ id, name }) => (
                            <MenuItem key={id} value={`${id}-${name}`}>{name}</MenuItem>
                        ))}
                    </Select>
                    <Typography
                        variant="caption"
                        sx={{ visibility: errors.jobSite ? 'visible' : 'hidden', color: 'error.main' }}
                    >
                        Jobsite is required
                    </Typography>
                </FormControl>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={canContinue} variant="contained" color="primary" size="large">
                    Continue
                </Button>
            </CardActions>
        </>
    )
}

export default React.memo(StartingView)