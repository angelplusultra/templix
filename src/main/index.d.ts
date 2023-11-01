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

  type TextEditor = 'vim' | 'nvim' | 'vscode' | 'terminal'

  interface OpenWithTextEditorPayload {
    name: string
    dest: string
    textEditor: TextEditor
  }
}
