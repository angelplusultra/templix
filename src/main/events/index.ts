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
    exec(`open -a "${d.app.appName}" ${d.dest}`, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })

  ipcMain.on('get-apps', async (e) => {
    function hasApplication(app: Main.Application): Main.SystemApplication {
      const appExists = existsSync('/Applications/' + app.appName)

      if (!appExists) {
        return {
          ...app,
          isInstalled: false
        }
      }

      return {
        ...app,
        isInstalled: true
      }
    }

    const applications: Main.Application[] = [
      {
        type: 'editor',
        appName: 'Visual Studio Code.app',
        displayName: 'VS Code'
      },
      {
        type: 'terminal',
        appName: 'iTerm.app',
        displayName: 'iTerm'
      },
      {
        type: 'terminal',
        appName: 'Terminal',
        displayName: 'Terminal'
      },
      {
        type: 'editor',
        appName: 'Hyper.app',
        displayName: 'Hyper Terminal'
      }
    ]

    const systemApps = applications.map((app) => {
      return hasApplication({
        ...app
      })
    })

    // NOT PLATFORM AGNOSTIC YET, WINDOWS WILL RETURN AN EMPTY ARRAY FOR TERMINALS
    e.reply(
      'get-apps:success',
      systemApps.filter((app) => app.isInstalled)
    )
  })
}
