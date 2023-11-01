import { useState } from 'react'

export function Tag({ textContent }: App.TagProps): JSX.Element {
  const [tagText, setTagText] = useState(textContent)

  const onMouseOver = (): void => {
    setTagText('Delete')
  }
  const onMouseOut = (): void => {
    setTagText(textContent)
  }
  return (
    <div
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className="p-2 hover:cursor-pointer bg-base-300 rounded text-center w-24 truncate"
    >
      {tagText}
    </div>
  )
}
