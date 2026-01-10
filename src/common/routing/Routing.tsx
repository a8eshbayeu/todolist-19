import { selectIsLoggedIn } from "@/app/app-slice"
import { Main } from "@/app/Main"
import { PageNotFound, ProtectedRoute } from "@/common/components"
import { useAppSelector } from "@/common/hooks"
import { Login } from "@/features/auth/ui/Login/Login"
import { Navigate, Route, Routes } from "react-router"

export const Path = {
  Root: "/",
  Login: "/login",
  Main: "/main",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route path={Path.Root} element={<Navigate to={Path.Login} />} />
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} redirectPath={Path.Login} />}>
        <Route path={Path.Main} element={<Main />} />
      </Route>
      <Route element={<ProtectedRoute isAllowed={!isLoggedIn} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
