import { lazy, Suspense, type ComponentType } from 'react'

// Componente de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
      <p className="text-gray-600 text-sm font-medium">Cargando página...</p>
    </div>
  </div>
)

// HOC para lazy loading con Suspense
export function withSuspense<T extends ComponentType<any>>(
  LazyComponent: React.LazyExoticComponent<T>
) {
  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Helper para crear lazy components con Suspense
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFunc)
  return withSuspense(LazyComponent)
}
