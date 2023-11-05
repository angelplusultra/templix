import { electron } from '@renderer/helpers'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

const templatesContext = createContext<App.TemplatesContext>({} as App.TemplatesContext)

export function TemplatesProvider({ children }: App.TemplatesProviderProps): JSX.Element {
  const [templates, setTemplates] = useState<App.Template[]>([])
  const { authState } = useAuth()
  useEffect(() => {
    if (authState.templateDir) {
      window.electron.ipcRenderer.send('get-templates')
      window.electron.ipcRenderer.once('get-templates:success', (_, d) => {
        setTemplates(d)
      })
    }
  }, [authState.templateDir])
  return (
    <templatesContext.Provider
      value={{
        templates,
        setTemplates
      }}
    >
      {children}
    </templatesContext.Provider>
  )
}

export const useTemplates = (): App.UseTemplatesReturnType => {
  const { setTemplates, templates } = useContext(templatesContext)
  const [filteredTemplates, setFilteredTemplates] = useState(templates)
  const [templatesFilter, setTemplatesFilter] = useState('')

  useEffect(() => {
    setFilteredTemplates(templates)
  }, [templates])

  useEffect(() => {
    const data = templates.filter((temp) => {
      if (
        temp.name.toLowerCase().includes(templatesFilter.toLowerCase()) ||
        temp.title.toLowerCase().includes(templatesFilter.toLowerCase())
      ) {
        return true
      }
      return false
    })
    setFilteredTemplates(data)
  }, [templatesFilter])

  const onTemplatesFilterChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTemplatesFilter(e.target.value)
  }

  const addTag: App.UseTemplatesReturnType['addTag'] = async (name, tag) => {
    await electron.addTagToTemplate(name, tag)
    const templates = await electron.getTemplates()
    setTemplates(templates)
  }
  return {
    setTemplates,
    templates,
    addTag,
    filteredTemplates,
    onTemplatesFilterChange
  }
}
