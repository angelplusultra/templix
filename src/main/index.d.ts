declare namespace Main {
  interface UserData {
    templateDir: string
    templates: Template[]
  }
  interface Template {
    name: string
    title: string
    description: string
    icon: string
    tags: string[]
  }
  interface ChangeTemplateDisplayDataPayload {
    title: string
    description: string
    name: string
  }
  interface ChangeMainIconPayload {
    name: string
    icon: string
  }
  interface CopyTemplateToPathPayload {
    name: string
    copyPath: string
  }

  interface TextEditor {
    appName: string
    command: string
    isInstalled: boolean
  }
  interface Terminal {
    appName: string
    terminal: string
    isInstalled: boolean
  }

  interface OpenWithAppPayload {
    name: string
    dest: string
    app: Application
  }

  type Application = Terminal | TextEditor

  interface AddTagEventPayload {
    tag: string
    name: Template['name']
  }
}
