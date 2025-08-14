import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material';
import Theme from './Theme.jsx';


createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={Theme}>
        <CssBaseline />
        <StrictMode>
            <App />
        </StrictMode>
    </ThemeProvider >
)
