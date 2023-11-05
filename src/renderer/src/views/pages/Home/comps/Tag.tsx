import { useTemplates } from '@renderer/context'
import { electron } from '@renderer/helpers'
import { useState } from 'react'

export function Tag({ textContent, templateName }: App.TagProps): JSX.Element {
  const [tagText, setTagText] = useState(textContent)
  const { setTemplates } = useTemplates()

  const onMouseOver = (): void => {
    setTagText('Delete')
  }
  const onMouseOut = (): void => {
    setTagText(textContent)
  }
  return (
    <div
      onClick={async (): Promise<void> => {
        await electron.deleteTag(templateName, textContent)
        const templates = await electron.getTemplates()
        setTemplates(templates)
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className="transition-all duration-500 ease-in-out hover:text-error-content hover:cursor-pointer hover:bg-error bg-base-300 rounded text-center w-20 truncate p-1"
    >
      {tagText}
    </div>
  )
}
