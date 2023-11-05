import { electron } from '@renderer/helpers'
import { Icon, Modal } from '@renderer/views/comps'
import React, { useEffect, useRef, useState } from 'react'
import { ChangeDescriptionModal, IconModal, Tag, TextEditorPromptModal } from './comps'
import { useTemplates } from '@renderer/context'
import { FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

export function Home(): React.ReactNode {
  const { setTemplates, onTemplatesFilterChange, filteredTemplates, addTag } = useTemplates()

  function Template({
    name,
    description,
    icon,
    title,
    setTemplates,
    tags
  }: App.TemplateProps): React.ReactNode {
    const [form, setForm] = useState({
      title: title,
      description: description
    })
    const [destinationPath, setDestinationPath] = useState('')
    const [tagInput, setTagInput] = useState('')

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, [isEditingTitle])

    const onClick = (): void => {
      setIsEditingTitle(true)
    }
    const submitForm = (): void => {
      window.electron.ipcRenderer.send('change-template-display-data', {
        ...form,
        name
      })
      window.electron.ipcRenderer.once('change-template-display-data:success', () => {
        window.electron.ipcRenderer.send('get-templates')
        window.electron.ipcRenderer.once('get-templates:success', (_, d: App.Template[]) => {
          setTemplates(d)
        })
      })
    }
    const onBlur = (): void => {
      setIsEditingTitle(false)
      submitForm()
    }
    const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        setIsEditingTitle(false)
        submitForm()
      }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { name, value } = e.target
      setForm((prev) => ({
        ...prev,
        [name]: value
      }))
    }

    const openModal = (id: string): void => {
      ;(document.getElementById(id) as HTMLDialogElement).showModal()
    }

    const openIconPicker = (): void => {
      ;(document.getElementById(`my_icon_modal_${name}`) as HTMLDialogElement).showModal()
    }

    const submitTag = (): void => {
      if (!tagInput) {
        toast.error('Please enter a tag', {
          style: {
            color: 'rgb(166, 173, 186)',
            backgroundColor: 'rgb(21, 25, 30)'
          }
        })
        return
      }
      if (tags.includes(tagInput.toLowerCase())) {
        toast.error('This template already contains this tag', {
          style: {
            color: 'rgb(166, 173, 186)',
            backgroundColor: 'rgb(21, 25, 30)'
          }
        })
        return
      }
      addTag(name, tagInput)
    }

    return (
      <>
        <div className="card w-full bg-base-200 shadow-xl place-self-center">
          <figure className="hover:cursor-pointer bg-base-300" onClick={openIconPicker}>
            <Icon styles="w-32 h-32" icon={icon} />
          </figure>

          <div className="card-body">
            <h2 onClick={onClick} className="card-title">
              {isEditingTitle ? (
                <input
                  onChange={onChange}
                  value={form.title}
                  name="title"
                  ref={inputRef}
                  onBlur={onBlur}
                  onKeyDown={onKeydown}
                  className="input h-[28px]"
                  placeholder="Enter a new title"
                />
              ) : (
                <div className="hover:cursor-pointer">{title || name}</div>
              )}
            </h2>
            <p className="h-20">
              <span
                onClick={(): void => openModal(`my_modal_${name}`)}
                className="hover:text-accent hover:cursor-pointer"
              >
                {description || 'Add a description'}
              </span>
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-start gap-2">
                <h5 className="">Tags</h5>
                <button
                  onClick={(): void => {
                    ;(
                      document.getElementById(`modal_add_tag_${name}`) as HTMLDialogElement
                    ).showModal()
                  }}
                  className="btn btn-xs btn-circle btn-outline"
                >
                  <FaPlus size={10} />
                </button>
              </div>
              <div className="h-32 overflow-auto">
                <div className="text-sm flex flex-wrap items-center gap-1">
                  {tags.map((tag, i) => (
                    <Tag key={i} templateName={name} textContent={tag} />
                  ))}
                </div>
              </div>
            </div>
            <div className="card-actions justify-center md:justify-end mt-2">
              <button
                onClick={async (): Promise<void> => {
                  const { data } = await electron.openDirectoryPickerPromise()

                  const message = await electron.copyTemplateToPath(name, data)
                  toast.success(message)
                  setDestinationPath(data)

                  openModal(`my_text_editor_modal_${name}`)
                }}
                className="btn btn-md btn-primary no-animation"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
        <ChangeDescriptionModal
          name={name}
          description={form.description}
          onChange={onChange}
          submitForm={submitForm}
        />
        <IconModal setTemplates={setTemplates} name={name} />
        <TextEditorPromptModal path={destinationPath} name={name} />
        <Modal modalId={`modal_add_tag_${name}`}>
          <>
            <div className="font-bold text-lg">Add a tag for {title || name}</div>
            <div className="flex justify-center items-center gap-5 py-4">
              <input
                value={tagInput}
                onKeyDown={(e): void => {
                  if (e.key === 'Enter') {
                    submitTag()
                  }
                }}
                onChange={(e): void => {
                  setTagInput(e.target.value)
                }}
                type="text"
                className="input input-bordered w-full bg-base-300"
              />
              <form className="" method="dialog">
                <button onClick={submitTag} className="btn">
                  Add
                </button>
              </form>
            </div>
          </>
        </Modal>
      </>
    )
  }
  return (
    <div className="space-y-8">
      <div className="mt-10 md:mx-20 space-y-8">
        <h1 className="text-center md:text-left text-6xl font-thin">Templates</h1>
        <div className="flex items-center justify-center md:justify-start">
          <input
            onChange={onTemplatesFilterChange}
            placeholder="Search"
            type="text"
            className="input input-bordered md:w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-20">
        {filteredTemplates.map((t, i) => (
          <React.Fragment key={i}>
            <Template setTemplates={setTemplates} {...t} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
