import {lazy, Suspense } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router"

const ShopPage = lazy(()=> import("@/pages/ShopPage"))

export const AuthRoutes = () => {
    return (
        <>
        <Router>
            <Suspense fallback={
                <p>cargando...</p>
            }>
            <Routes>
                <Route path="/" element={<ShopPage></ShopPage>}/>
            </Routes>
            </Suspense>
        </Router>
    </>
    )
}