import { useAuth } from '@renderer/context'
import { PacmanLoader } from 'react-spinners'

export function LoadingGate({ children }: App.LoadingGateProps): React.ReactNode {
  const { authState } = useAuth()

  if (authState.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>
          <PacmanLoader size={30} color="rgb(166, 173, 186)" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
