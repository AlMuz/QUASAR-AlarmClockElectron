import { app, BrowserWindow, nativeTheme, Menu, Tray, Notification } from 'electron'
const path = require('path')
const os = require('os-utils');


try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

let tray

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 220,
    minHeight: 200,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
    frame: false
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  let contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show();
    } },
    { label: 'Quit', click:  function(){
        app.quit()
    } }
  ]);

  tray = new Tray(path.resolve(__statics,'icons', 'favicon-128x128.png'))
  tray.setToolTip('quasar-first-try')
  tray.setContextMenu(contextMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
