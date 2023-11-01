import { IpcRendererEvent } from 'electron'

export const electron = {
  removeAllListeners: (channel: App.EventChannel) => {
    window.electron.ipcRenderer.removeAllListeners(channel)
  },
  copyTemplateToPath: (templateName: string, path: string) => {
    window.electron.ipcRenderer.send('copy-template-to-path', {
      name: templateName,
      copyPath: path
    })
  },
  openDirectoryPicker: (cb: (e: IpcRendererEvent, tn: string) => void) => {
    window.electron.ipcRenderer.send('open')
    window.electron.ipcRenderer.once('open:success', (e, d: string) => {
      cb(e, d)
    })
  },
  openDirectoryPickerPromise: () =>
    new Promise<{
      data: string
      event: IpcRendererEvent
    }>((res) => {
      window.electron.ipcRenderer.send('open')
      window.electron.ipcRenderer.once('open:success', (e, d: string) => {
        res({
          data: d,
          event: e
        })
      })
    }),
  openProjectInTextEditor: (
    templateName: string,
    dest: string,
    textEditor: App.TextEditor
  ): void => {
    window.electron.ipcRenderer.send('open-with-text-editor', {
      name: templateName,
      dest,
      textEditor
    })
  },
  changeTemplateDirectory: (dir: string): Promise<string> => {
    window.electron.ipcRenderer.send('confirm-dir-selection', dir)

    return new Promise((res) => {
      window.electron.ipcRenderer.on('confirm-dir-selection:success', (_, d) => {
        res(d)
      })
    })
  },
  getTemplates: (): Promise<App.Template[]> => {
    window.electron.ipcRenderer.send('get-templates')

    return new Promise((res) => {
      window.electron.ipcRenderer.on('get-templates:success', (_, d) => {
        res(d)
      })
    })
  }
}
