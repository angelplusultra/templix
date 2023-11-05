import { useAuth } from '@renderer/context'
import { useState } from 'react'

export function Welcome(): React.ReactNode {
  const { setAuthState } = useAuth()
  const [dirPath, setDirPath] = useState('')

  return (
    <>
      <div className="flex flex-col gap-20 justify-center items-center mt-32">
        <div className="">
          <h1 className="text-6xl lg:text-7xl text-center">Setup your template directory</h1>
        </div>
        <div className="flex items-center justify-center flex-col gap-5 p-10">
          <div className="font-bold p-2 w-[600px] text-3xl h-12 border-b border-neutral">
            {dirPath}
          </div>
          <div className="flex items-center justify-around gap-5">
            <button
              onClick={(): void => {
                window.electron.ipcRenderer.send('open')
                window.electron.ipcRenderer.on('open:success', (_, d) => {
                  setDirPath(d)

                  window.electron.ipcRenderer.removeAllListeners('open:success')
                })
              }}
              className="btn btn-block"
              type="button"
            >
              Choose Directory
            </button>
            {dirPath && (
              <button
                onClick={(): void => {
                  window.electron.ipcRenderer.send('confirm-dir-selection', dirPath)
                  window.electron.ipcRenderer.on('confirm-dir-selection:success', (_, d) => {
                    setAuthState({
                      isAuthenticated: true,
                      templateDir: d,
                      isLoading: false
                    })

                    window.electron.ipcRenderer.removeAllListeners('confirm-dir-selection:success')
                  })
                }}
                className="btn btn-success btn-block"
                type="button"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
