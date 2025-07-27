import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error.status}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error.statusText || 'Algo salió mal'}
          </p>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Error inesperado
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Ha ocurrido un error inesperado
        </p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
