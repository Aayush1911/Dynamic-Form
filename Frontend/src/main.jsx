import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FormProvider } from './context/FormContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormProvider>
      <AdminProvider>
      <App />
      </AdminProvider>
    </FormProvider>
  </StrictMode>,
)
