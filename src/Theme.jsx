import { createTheme } from '@mui/material/styles';

const PRIMARY = '#1976d2';
const ERROR = '#d32f2f';
const BG_DEFAULT = '#f6f9fc';
const TEXT_PRIMARY = '#2c2c2c';
const SURFACE = '#fff';

const OUTLINE = '1px solid rgba(0, 0, 0, 0.25)';
const ELEVATION = '0 12px 32px rgba(0, 0, 0, 0.1)';

const heading = {
    fontWeight: 600,
    color: TEXT_PRIMARY,
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: PRIMARY },
        error: { main: ERROR },
        background: { default: BG_DEFAULT, paper: SURFACE },
        text: { primary: TEXT_PRIMARY },
    },
    typography: {
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        h5: heading,
        h6: heading,
        subtitle2: { textAlign: 'left' },
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: OUTLINE,
                    boxShadow: ELEVATION,
                    backgroundColor: SURFACE,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& input': {
                        color: TEXT_PRIMARY,
                        fontWeight: 500,
                    },
                },
            },
        },
    },
});

export default theme;
