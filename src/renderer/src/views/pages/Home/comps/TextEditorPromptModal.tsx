import { electron } from '@renderer/helpers'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface SystemApplication {
  isInstalled: boolean
  appName: string
  displayName: string
}
export function TextEditorPromptModal({ name, path }: App.TextEditorModalProps): React.ReactNode {
  const [apps, setApps] = useState<SystemApplication[]>([])

  useEffect(() => {
    electron.getApps().then((apps) => {
      setApps(apps)
    })
  }, [])

  const openWithApp = (app: SystemApplication): void => {
    toast('Opening ' + app.displayName, {
      icon: '👏',
      style: {
        borderRadius: '50px',
        background: '#333',
        color: '#fff'
      }
    })
    electron.openWithApp(name, path, app)
  }
  return (
    <dialog id={`my_text_editor_modal_${name}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Open With</h3>
        <form className=" modal-action flex justify-between" method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <div className="join">
            {apps.map((app, i) => (
              <button className="btn btn-sm" key={i} onClick={(): void => openWithApp(app)}>
                {app.displayName}
              </button>
            ))}
          </div>

          <div>
            <button className="btn btn-sm">Close</button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
