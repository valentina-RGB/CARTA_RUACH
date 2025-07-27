import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import {registerSW}  from 'virtual:pwa-register'
import { router } from './routes/router'


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
    {/* <ShopPage></ShopPage> */}
  </StrictMode>,
)
