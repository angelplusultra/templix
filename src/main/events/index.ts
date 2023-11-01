import { BrowserWindow, OpenDialogReturnValue, app, dialog, ipcMain } from 'electron'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { statSync } from 'fs'
import path from 'path'
import copyDir from 'copy-dir'
import os from 'os'

const dataDir = app.getPath('userData')
const dataFile = 'data.json'

const dataPath = path.join(dataDir, dataFile)

export function registerEvents(browserWindow: BrowserWindow): void {
  ipcMain.on('ping', (e) => {
    e.reply('ping:success', 'pong')
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

    console.log({
      d
    })

    parsedData.templateDir = d

    writeFileSync(dataPath, JSON.stringify(parsedData))
    e.reply('confirm-dir-selection:success', parsedData.templateDir)
  })

  ipcMain.on('login', (e) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString())

    if (!parsedData.templateDir) {
      console.log({
        error: 'No template directory on record',
        dataPath: dataPath
      })
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
        description: ''
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
        icon: ''
      })
    }
    writeFileSync(dataPath, JSON.stringify(parsedData))

    e.reply('change-template-display-data:success', parsedData)
  })
  ipcMain.on('change-main-icon', (e, d: Main.ChangeMainIconPayload) => {
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData
    const template = parsedData.templates.find((t) => t.name === d.name)

    console.log(template)

    if (template) {
      template.icon = d.icon
    }

    writeFileSync(dataPath, JSON.stringify(parsedData))

    e.reply('change-main-icon:success')
  })

  ipcMain.on('copy-template-to-path', (_, d: Main.CopyTemplateToPathPayload) => {
    console.log(d)
    const data = readFileSync(dataPath)

    const parsedData = JSON.parse(data.toString()) as Main.UserData
    const template = parsedData.templates.find((t) => t.name === d.name)
    if (!template) {
      console.error('Something went wrong')
      return
    }
    const templatePath = path.join(parsedData.templateDir, template.name)
    console.log({ templatePath, copyPath: d.copyPath })

    copyDir.sync(templatePath, d.copyPath)
  })

  ipcMain.on('open-with-text-editor', async (e, d: Main.OpenWithTextEditorPayload) => {
    //   const command = "code " + d.copyPath
    //
    //   exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.error(`Command execution failed: ${stderr}`);
    //   }
    //   console.log(`Directory opened in VS Code: ${d.copyPath}`);
    // });

    console.log({
      data: d
    })
    const openEditor = await import('open-editor')
    const open = await import('open')

    if (d.textEditor === 'terminal') {
      if (os.platform() === 'win32') {
        open.openApp('cmd', {
          arguments: [d.dest]
        })
      } else if (os.platform() === 'darwin') {
        open.openApp(`Terminal`, {
          arguments: [d.dest],
          newInstance: true
        })
        return
      } else if (os.platform() === 'linux') {
        e.reply('open-with-text-editor:failure', 'Linux not supported')
        return
      }
    }

    openEditor.default(
      [
        {
          file: d.dest
        }
      ],
      {
        editor: d.textEditor
      }
    )
  })
}
