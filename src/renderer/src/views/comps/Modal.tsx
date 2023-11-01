export function Modal({ children, modalId }: App.ModalProps): JSX.Element {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">{children}</div>
    </dialog>
  )
}
