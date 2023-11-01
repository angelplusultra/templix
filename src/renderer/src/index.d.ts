declare namespace App {
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
  }
  type TextEditor = 'vim' | 'nvim' | 'vscode' | 'terminal'
}
