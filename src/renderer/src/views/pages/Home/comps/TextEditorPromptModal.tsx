import { electron } from '@renderer/helpers'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export function TextEditorPromptModal({ name, path }: App.TextEditorModalProps): React.ReactNode {
  const [apps, setApps] = useState<{
    editors: App.TextEditor[]
    terminals: App.Terminal[]
  }>({
    editors: [],
    terminals: []
  })

  useEffect(() => {
    electron.getApps().then((apps) => {
      setApps(apps)
    })
  }, [])

  const openWithApp = (app: App.Application): void => {
    toast('Opening ' + app.appName, {
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
            {apps.editors.map((editor) => (
              <button
                className="btn btn-sm"
                key={editor.appName}
                onClick={(): void => openWithApp(editor)}
              >
                {editor.appName}
              </button>
            ))}
          </div>
          <div className="join">
            {apps.terminals.map((term) => (
              <button
                onClick={(): void => openWithApp(term)}
                className="btn btn-sm join-item"
                key={term.appName}
              >
                {term.appName}
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
