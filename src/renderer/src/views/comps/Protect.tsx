import { useAuth } from '@renderer/context'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { CenterContainer } from './CenterContainer'
import { PacmanLoader } from 'react-spinners'

export function Protect(): React.ReactNode {
  const { authState } = useAuth()
  const protectedRoutes = ['/home']
  const pubRoutes = ['/']
  const location = useLocation()

  console.log(location)

  if (authState.isLoading) {
    return (
      <div>
        <CenterContainer>
          <div>
            <PacmanLoader size={50} color="rgb(166, 173, 186)" />
          </div>
        </CenterContainer>
      </div>
    )
  }

  if (!authState.isAuthenticated && protectedRoutes.includes(location.pathname)) {
    return <Navigate to="/" />
  }

  if (authState.isAuthenticated && pubRoutes.includes(location.pathname)) {
    return <Navigate to="/home" />
  }

  return <Outlet />
}
