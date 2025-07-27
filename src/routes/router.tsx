import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { createLazyComponent } from '@/utils/lazyLoader'

const ShopPage = createLazyComponent(() => import('@/pages/ShopPage'))
const NotFoundPage = createLazyComponent(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ShopPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
