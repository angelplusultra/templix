declare namespace App {
  import { IpcRendererEvent } from 'electron'
  type EventChannel = 'ping' | 'ping:success'
  interface AuthState {
    isAuthenticated: boolean
    templateDir: string
    isLoading: boolean
  }
  interface AuthContext {
    authState: AuthState
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
  }
  interface AuthProviderProps {
    children: React.ReactNode
  }
  interface UserData {
    templateDir: string
    templates: Template[]
  }
  interface Template {
    name: string
    title: string
    description: string
    icon: keyof Icons
    tags: string[]
  }

  interface TemplateProps extends Template {
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
  }
  interface IconProps {
    styles: string
    icon: keyof Icons
  }
  interface Icons {
    react: IconType
    typescript: IconType
    node: IconType
    mongodb: IconType
    postgres: IconType
  }

  interface IconModalProps {
    name: string
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
  }

  interface ChangeDescriptionModalProps {
    name: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    description: string
    submitForm: () => void
  }

  interface TextEditorModalProps {
    name: string
    path: string
  }

  interface UseAuthReturnType {
    authState: AuthState
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
  }
  interface TagProps {
    textContent: string
    templateName: string
  }
  interface ModalProps {
    modalId: string
    children: JSX.Element
  }

  interface TemplatesContext {
    templates: Template[]
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
  }

  interface TemplatesProviderProps {
    children: JSX.Element
  }

  interface LoadingGateProps {
    children: React.ReactNode
  }

  interface UseTemplatesReturnType extends TemplatesContext {
    onTemplatesFilterChange(e: React.ChangeEvent<HTMLInputElement>): void
    addTag(name: Template['name'], tag: string): void
    filteredTemplates: Template[]
  }

  interface ElectronHelpers {
    removeAllListeners: (channel: string) => void
    copyTemplateToPath: (templateName: string, path: string) => void
    openDirectoryPickerPromise: () => Promise<{
      data: string
      event: IpcRendererEvent
    }>
    openWithApp: (templateName: string, dest: string, App: Application) => void
    changeTemplateDirectory: (dir: string) => Promise<string>
    getTemplates: () => Promise<Template[]>
    getVersion: () => Promise<string>
    addTagToTemplate: (name: string, tag: string) => Promise<void>
    deleteTag: (
      name: string,
      tag: string
    ) => Promise<{
      d: null
      e: IpcRendererEvent
    }>
  }

  interface TextEditor {
    appName: string
    command: string
    isInstalled: boolean
  }

  type Application = TextEditor | Terminal

  interface Terminal {
    isInstalled: boolean
    terminal: string
    appName: string
  }

  type DeleteTag = (name: string, tag: string) => Promise<{ d: null; e: IpcRendererEvent }>
}
