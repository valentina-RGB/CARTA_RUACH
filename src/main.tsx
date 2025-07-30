import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import {registerSW}  from 'virtual:pwa-register'
import { router } from './routes/router'
import { setThemeColor } from './utils/themeColor'


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setThemeColor);
} else {
  setThemeColor();
}

registerSW({
  onNeedRefresh() {
    console.log('Nueva versión disponible. Recarga para actualizar.')
  },
  onOfflineReady() {
    console.log('La app ya está lista para funcionar offline.')
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
