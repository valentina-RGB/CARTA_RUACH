import { Outlet } from 'react-router-dom'


export const RootLayout = () => {
  return (
      <main className="w-full h-full mx-auto">
        <Outlet />
      </main>
  )
}
