import { FaGithub } from 'react-icons/fa'
import { Modal } from './Modal'
import { electron } from '@renderer/helpers'
import { useAuth, useTemplates } from '@renderer/context'

export function Navbar(): React.ReactNode {
  const { authState, setAuthState } = useAuth()
  const { setTemplates } = useTemplates()
  const openDirectoryPicker = async (): Promise<void> => {
    const { data } = await electron.openDirectoryPickerPromise()
    await electron.changeTemplateDirectory(data)
    setAuthState((prev) => ({
      ...prev,
      templateDir: data
    }))
    const templates = await electron.getTemplates()
    setTemplates(templates)
  }
  return (
    <div className="navbar bg-primary">
      <div className="flex-none">
        {/* <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button> */}
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Templix</a>
        <p className="text-sm">by Hunterbidenafterlife</p>
      </div>
      <div className="flex-none">
        <a
          target="_blank"
          href="https://github.com/angelplusultra/templix"
          className="btn btn-ghost"
          rel="noreferrer"
        >
          <FaGithub size={25} />
        </a>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-60 mt-4"
          >
            <li>
              <a
                onClick={(): void => {
                  ;(document.getElementById('modal_hello') as HTMLDialogElement).showModal()
                }}
              >
                Change Template Directory
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Modal modalId="modal_hello">
        <div>
          <div className="card-title">Current Directory</div>
          <div className="border-b border-0 py-3">{authState.templateDir}</div>
          <div className="modal-action justify-end">
            <button onClick={openDirectoryPicker} className="btn">
              Choose Directory
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  )
}
