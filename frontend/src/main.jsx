import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './components/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Login />
  </StrictMode>,
)
