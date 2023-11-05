import { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

const authContext = createContext({} as App.AuthContext)

export function AuthProvider({ children }: App.AuthProviderProps): React.ReactNode {
  const [authState, setAuthState] = useState<App.AuthState>({
    templateDir: '',
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    window.electron.ipcRenderer.send('login')
    window.electron.ipcRenderer.once('login:success', (_, d) => {
      setAuthState({
        isAuthenticated: true,
        templateDir: d,
        isLoading: false
      })
    })
    window.electron.ipcRenderer.once('login:failure', () => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false
      }))
    })
  }, [])

  return (
    <authContext.Provider
      value={{
        authState,
        setAuthState
      }}
    >
      {children}
    </authContext.Provider>
  )
}

export const useAuth = (): App.UseAuthReturnType => {
  const { authState, setAuthState } = useContext(authContext)

  return {
    authState,
    setAuthState
  }
}
