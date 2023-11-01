export function ChangeDescriptionModal({
  onChange,
  description,
  submitForm,
  name
}: App.ChangeDescriptionModalProps): React.ReactNode {
  return (
    <dialog id={`my_modal_${name}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Enter a description</h3>
        <div className="form-control mt-5">
          <textarea
            cols={20}
            onChange={onChange}
            rows={5}
            name="description"
            className="textarea textarea-info"
            placeholder="Enter a description"
            value={description}
          ></textarea>
        </div>
        <div className="modal-action">
          <form className="flex justify-between gap-5" method="dialog">
            <button className="btn">Close</button>
            {/* if there is a button in form, it will close the modal */}
            <button onClick={submitForm} className="btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
