import { IpcRendererEvent } from 'electron'
const send = window.electron.ipcRenderer.send
const once = window.electron.ipcRenderer.once
const removeAllListeners = window.electron.ipcRenderer.removeAllListeners
export const electron = {
  removeAllListeners: (channel): void => {
    removeAllListeners(channel)
  },
  copyTemplateToPath: async (templateName: string, path: string): Promise<string> => {
    send('copy-template-to-path', {
      name: templateName,
      copyPath: path
    })
    await onceElectronEventPromise('copy-template-to-path:success')
    return `Copied ${templateName} to ${path}`
  },
  openDirectoryPickerPromise: (): Promise<{
    data: string
    event: IpcRendererEvent
  }> =>
    new Promise<{
      data: string
      event: IpcRendererEvent
    }>((res) => {
      send('open')
      once('open:success', (e, d: string) => {
        res({
          data: d,
          event: e
        })
      })
    }),
  openWithApp: (templateName: string, dest: string, app: App.Application): void => {
    send('open-with-app', {
      name: templateName,
      dest,
      app
    })
  },
  changeTemplateDirectory: (dir: string): Promise<string> => {
    send('confirm-dir-selection', dir)

    return new Promise((res) => {
      once('confirm-dir-selection:success', (_, d) => {
        res(d)
      })
    })
  },
  getTemplates: (): Promise<App.Template[]> => {
    send('get-templates')

    return new Promise((res) => {
      once('get-templates:success', (_, d) => {
        res(d)
      })
    })
  },
  getVersion: (): Promise<string> => {
    send('get-version')
    return new Promise((res) => {
      once('get-version:success', (_, d: string) => {
        res(d)
      })
    })
  },
  addTagToTemplate: (name: string, tag: string): Promise<void> => {
    send('add-tag', {
      name,
      tag
    })

    return new Promise((res) => {
      once('add-tag:success', () => {
        res()
      })
    })
  },
  deleteTag: async (
    name: string,
    tag: string
  ): Promise<{
    d: null
    e: IpcRendererEvent
  }> => {
    send('delete-tag', { name, tag })

    const { d, e } = await onceElectronEventPromise<null>('delete-tag:success')
    return {
      d,
      e
    }
  },
  getApps: async (): Promise<{
    terminals: App.Terminal[]
    editors: App.TextEditor[]
  }> => {
    send('get-apps')

    const { d } = await onceElectronEventPromise<{
      editors: App.TextEditor[]
      terminals: App.Terminal[]
    }>('get-apps:success')

    return {
      ...d
    }
  },
  changeIcon: async (
    name: string,
    icon: string
  ): Promise<{
    e: IpcRendererEvent
    d: null
  }> => {
    send('change-icon', {
      name,
      icon
    })
    return await onceElectronEventPromise('change-icon:success')
  }
}

function onceElectronEventPromise<DataType = null>(
  channel: string
): Promise<{ e: IpcRendererEvent; d: DataType }> {
  return new Promise((res) => {
    once(channel, (e: IpcRendererEvent, d: DataType) => {
      res({ e, d })
    })
  })
}
