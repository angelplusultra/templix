import { electron } from '@renderer/helpers'
import { Icon } from '@renderer/views/comps'
import React, { useEffect, useRef, useState } from 'react'
import { ChangeDescriptionModal, IconModal, Tag, TextEditorPromptModal } from './comps'

export function Home(): React.ReactNode {
  const [templates, setTemplates] = useState<App.Template[]>([])

  useEffect(() => {
    window.electron.ipcRenderer.send('get-templates')
    window.electron.ipcRenderer.once('get-templates:success', (_, d) => {
      setTemplates(d)
      console.log(d)
    })
  }, [])

  function Template({
    name,
    description,
    icon,
    title,
    setTemplates
  }: App.TemplateProps): React.ReactNode {
    const [form, setForm] = useState({
      title: title,
      description: description
    })
    const [destinationPath, setDestinationPath] = useState('')

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
    useEffect(() => {
      console.log(form)
    }, [form])

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
      console.log('Opening icon picker')
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-start gap-2">
                <h5>Tags</h5>
              </div>
              <div className="text-sm flex gap-2 flex-wrap">
                <Tag textContent="Tailwind" />
                <Tag textContent="TypeScript" />
                <Tag textContent="Rust" />
                <Tag textContent="React" />

                <button className="btn btn-circle btn-outline btn-sm">+</button>
              </div>
            </div>
            <div className="card-actions justify-center md:justify-end">
              <button
                onClick={async (): Promise<void> => {
                  const { data } = await electron.openDirectoryPickerPromise()

                  electron.copyTemplateToPath(name, data)
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
      </>
    )
  }
  return (
    <div className="space-y-8">
      <div className="mt-10 md:mx-20 space-y-8">
        <h1 className="text-center md:text-left text-6xl font-thin">Templates</h1>
        <div className="flex items-center justify-center md:justify-start">
          <input placeholder="Search" type="text" className="input input-bordered md:w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-20">
        {templates.map((t, i) => (
          <React.Fragment key={i}>
            <Template setTemplates={setTemplates} {...t} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
