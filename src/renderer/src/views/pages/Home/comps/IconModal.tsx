import { electron } from '@renderer/helpers'
import { Icon, icons } from '@renderer/views/comps'

export function IconModal({ name, setTemplates }: App.IconModalProps): React.ReactNode {
  return (
    <dialog id={`my_icon_modal_${name}`} className="modal">
      <div className="modal-box">
        <div className="grid grid-cols-2 overflow-scroll shadow-inner h-[380px] bg-base-300 rounded-xl p-5 gap-5">
          {Object.keys(icons).map((icon, i) => (
            <form key={i} method="dialog">
              <button
                onClick={async (): Promise<void> => {
                  await electron.changeIcon(name, icon)
                  const templates = await electron.getTemplates()

                  setTemplates(templates)
                }}
                className="h-40 btn"
              >
                <Icon styles="h-full w-full" icon={icon as keyof App.Icons} />
              </button>
            </form>
          ))}
        </div>

        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
