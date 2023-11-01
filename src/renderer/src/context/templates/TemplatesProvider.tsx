import { createContext, useContext, useState } from 'react'

const templatesContext = createContext<App.TemplatesContext>({} as App.TemplatesContext)

export function TemplatesProvider({ children }: App.TemplatesProviderProps): JSX.Element {
  const [templates, setTemplates] = useState<App.Template[]>([])
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

  return {
    setTemplates,
    templates
  }
}
