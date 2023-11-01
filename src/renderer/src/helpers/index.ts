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
  openProjectInTextEditor: (templateName: string, dest: string, textEditor: App.TextEditor) => {
    window.electron.ipcRenderer.send('open-with-text-editor', {
      name: templateName,
      dest,
      textEditor
    })
  }
}
