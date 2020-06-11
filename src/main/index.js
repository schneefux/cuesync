/* globals INCLUDE_RESOURCES_PATH */
import { app, dialog, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined // eslint-disable-line no-underscore-dangle
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH // eslint-disable-line no-unused-expressions
if (__resources === undefined) console.error('[Main-process]: Resources path is undefined')

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

autoUpdater.logger = log
// override console.log etc.
Object.assign(console, log.functions)

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify()
})

autoUpdater.on('update-available', async function (info) {
  const updateDialog = await dialog.showMessageBox({
    type: 'info',
    buttons: ['Download Update', 'No Thanks'],
    message: `Version ${info.version} is available.`,
  })
  if (updateDialog.response == 0) {
    shell.openExternal('https://cuesync.pro/update')
  }
})

// Load here all startup windows
require('./mainWindow')
