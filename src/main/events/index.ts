import { BrowserWindow, OpenDialogReturnValue, app, dialog, ipcMain } from 'electron'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { statSync } from 'fs'
import path from 'path'
import copyDir from 'copy-dir'
import os from 'os'
import { exec } from 'child_process'

const dataDir = app.getPath('userData')
const dataFile = 'data.json'

const dataPath = path.join(dataDir, dataFile)

export function registerEvents(browserWindow: BrowserWindow): void {
  ipcMain.on('ping', (e) => {
    e.reply('ping:success', 'pong')
  })

  ipcMain.on('get-version', (e) => {
    e.reply('get-version:success', app.getVersion())
  })

  ipcMain.on('open', (e) => {
    dialog
      .showOpenDialog(browserWindow, {
        defaultPath: os.homedir(),

        properties: ['openDirectory', 'createDirectory', 'promptToCreate']
      })
      .then((v: OpenDialogReturnValue) => {
        if (v.canceled) {
          return
        }
        e.reply('open:success', v.filePaths[0])
      })
  })
  ipcMain.on('confirm-dir-selection', (e, d) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString())

    parsedData.templateDir = d

    writeFileSync(dataPath, JSON.stringify(parsedData))
    e.reply('confirm-dir-selection:success', parsedData.templateDir)
  })

  ipcMain.on('login', (e) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString())

    if (!parsedData.templateDir) {
      e.reply('login:failure')
      return
    }
    e.reply('login:success', parsedData.templateDir)
  })

  ipcMain.on('get-templates', (e) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData

    const v = readdirSync(parsedData.templateDir)
    const dirs = v.filter((item) => {
      if (statSync(path.join(parsedData.templateDir, item)).isDirectory()) {
        return true
      }

      return false
    })
    const templates: Main.Template[] = dirs.map((dir) => {
      const matchingTemplate = parsedData.templates.find((t) => t.name === dir)

      if (matchingTemplate) {
        return matchingTemplate
      }

      return {
        name: dir,
        title: dir,
        icon: '',
        description: '',
        tags: []
      }
    })
    parsedData.templates = templates

    writeFileSync(dataPath, JSON.stringify(parsedData))

    e.reply('get-templates:success', templates)
  })

  ipcMain.on('change-template-display-data', (e, d: Main.ChangeTemplateDisplayDataPayload) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData

    const template = parsedData.templates.find((t) => t.name === d.name)

    if (template) {
      template.title = d.title
      template.description = d.description
    } else {
      parsedData.templates.push({
        ...d,
        icon: '',
        tags: []
      })
    }
    writeFileSync(dataPath, JSON.stringify(parsedData))

    e.reply('change-template-display-data:success', parsedData)
  })
  ipcMain.on('change-main-icon', (e, d: Main.ChangeMainIconPayload) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData
    const template = parsedData.templates.find((t) => t.name === d.name)

    if (template) {
      template.icon = d.icon
    }

    writeFileSync(dataPath, JSON.stringify(parsedData))

    e.reply('change-main-icon:success')
  })

  ipcMain.on('copy-template-to-path', (e, d: Main.CopyTemplateToPathPayload) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData
    const template = parsedData.templates.find((t) => t.name === d.name)
    if (!template) {
      return
    }
    const templatePath = path.join(parsedData.templateDir, template.name)

    copyDir.sync(templatePath, d.copyPath)

    e.reply('copy-template-to-path:success')
  })
  ipcMain.on('add-tag', (e, d: Main.AddTagEventPayload) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData
    const template = parsedData.templates.find((t) => t.name === d.name)
    if (!template) {
      return
    }
    template.tags.push(d.tag)
    writeFileSync(dataPath, JSON.stringify(parsedData))
    e.reply('add-tag:success')
  })
  ipcMain.on('delete-tag', (e, d: Main.AddTagEventPayload) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData
    const template = parsedData.templates.find((t) => t.name === d.name)
    if (!template) {
      return
    }
    template.tags = template.tags.filter((tag) => tag !== d.tag)
    writeFileSync(dataPath, JSON.stringify(parsedData))
    e.reply('delete-tag:success')
  })

  ipcMain.on('open-with-app', async (_, d: Main.OpenWithAppPayload) => {
    const openEditor = await import('open-editor')
    const open = await import('open')
    if ('terminal' in d.app) {
      open.openApp(d.app.terminal, {
        arguments: [d.dest],
        newInstance: true
      })
    } else {
      openEditor.default(
        [
          {
            file: d.dest
          }
        ],
        {
          editor: d.app.command
        }
      )
    }
  })

  ipcMain.on('get-apps', (e) => {
    function hasTextEditor(
      appCommand: string,
      appName: string
    ): Promise<{
      isInstalled: boolean
      command: string
      appName: string
    }> {
      const command = `${os.platform() === 'win32' ? 'where' : 'which'} ${appCommand}`

      return new Promise((res) => {
        exec(command, (e) => {
          if (e) {
            res({
              isInstalled: false,
              command: appCommand,
              appName
            })
          } else {
            res({
              isInstalled: true,
              command: appCommand,
              appName
            })
          }
        })
      })
    }
    const terminals = {
      darwin: [
        {
          term: 'iTerm.app',
          appName: 'iTerm'
        },
        {
          term: 'Hyper.app',
          appName: 'Hyper Terminal'
        }
      ]
    }

    function hasTerminal(terminal: string, appName: string): Main.Terminal {
      if (existsSync(`/Applications/${terminal}`)) {
        return {
          isInstalled: true,
          terminal,
          appName
        }
      }
      return {
        isInstalled: false,
        terminal,
        appName
      }
    }

    const editors = [
      {
        command: 'code',
        appName: 'VS Code'
      }
    ]

    const promises = editors.map((app) => hasTextEditor(app.command, app.appName))

    Promise.all(promises).then((editors) => {
      const installedTerminals = [
        {
          terminal: 'Terminal',
          appName: 'Terminal',
          isInstalled: true
        },
        ...terminals[os.platform() as keyof typeof terminals]
          .map((term) => hasTerminal(term.term, term.appName))
          .filter((term) => term.isInstalled === true)
      ]

      const installedEditors = editors.filter((editor) => editor.isInstalled === true)
      // NOT PLATFORM AGNOSTIC YET, WINDOWS WILL RETURN AN EMPTY ARRAY FOR TERMINALS
      e.reply('get-apps:success', {
        editors: installedEditors,
        terminals: installedTerminals
      })
    })
  })
}
