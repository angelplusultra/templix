import { electron } from '@renderer/helpers'
import toast from 'react-hot-toast'

export function TextEditorPromptModal({ name, path }: App.TextEditorModalProps): React.ReactNode {
  const openWithTextEditor = (textEditor: App.TextEditor): void => {
    toast('Opening ' + textEditor[0].toUpperCase() + textEditor.slice(1), {
      icon: '👏',
      style: {
        borderRadius: '50px',
        background: '#333',
        color: '#fff'
      }
    })
    electron.openProjectInTextEditor(name, path, textEditor)
  }
  return (
    <dialog id={`my_text_editor_modal_${name}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Open With</h3>
        <form className=" modal-action flex justify-between" method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <div className="join">
            <button onClick={(): void => openWithTextEditor('vscode')} className="btn join-item">
              VsCode
            </button>
            <button onClick={(): void => openWithTextEditor('terminal')} className="btn join-item">
              Terminal
            </button>
          </div>
          <div>
            <button className="btn">Close</button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
