'use strict'

// Import parts of electron to use
const {app, BrowserWindow, dialog, ipcMain, Menu, screen, Tray} = require('electron')
const openAboutWindow = require('about-window').default
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray;
let devBrowserProperties = {};

let trayMenu = Menu.buildFromTemplate([
  {
    label: 'Öffnen',
    click:  function(){
      mainWindow.show();
    }
  },
  {
    label: 'Beenden',
    click:  function(){
      mainWindow.close()
      app.quit()
    }
  }
])

function createTray() {
  tray = new Tray('./resources/files/images/marvin16x16.png');
  tray.setToolTip('Marvin')
  tray.setContextMenu(trayMenu);
  tray.on('click', function() {
    tray.popUpContextMenu();
  })
}

// Keep a reference for dev mode
let dev = false

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

// Functions

async function handleFileOpen() {
  const {canceled, filePaths} = await dialog.showOpenDialog(mainWindow, {properties: ['openDirectory']})
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

// Build main menu from file.
let mainMenu = Menu.buildFromTemplate(
  [
    // { role: 'fileMenu' }
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Beenden',
          role: 'quit'
        }
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'Ansicht',
      submenu: [
        {
          label: 'Neu laden',
          role: 'reload'
        },
        {
          label: 'Erzwinge Neustart',
          role: 'forceReload'
        },
        {type: 'separator'},
        {
          label: 'Zoom zurücksetzen',
          role: 'resetZoom'
        },
        {
          label: 'Hineinzoomen',
          role: 'zoomIn',
          accelerator: 'Ctrl+=',
        },
        {
          label: 'Herauszoomen',
          role: 'zoomOut',
          accelerator: 'Ctrl+-',
        },
        {type: 'separator'},
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Fenster',
      submenu: [
        {
          label: 'Minimieren',
          role: 'minimize'
        },
      ]
    },
    {
      label: 'Hilfe',
      role: 'help',
      submenu: [
        {
          label: 'Über Marvin',
          click: () => {
            openAboutWindow({
              icon_path: path.join(__dirname, 'marvin.ico'),
              bug_report_url: 'mailto:r.nasarek@gnm.de',
              bug_link_text: 'Einen Fehler melden',
              license: 'MIT',
              description: 'App zur Dokumentverwaltung im IKK am Germanischen Nationalmuseum.',
              win_options: {title: 'Über Marvin'},
              homepage: 'https://github.com/rnsrk/marvin'
            })
          }
        }
      ]
    }
  ]
)

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

console.log(process.resourcesPath);
console.log(__dirname);

const getAssetPath = (paths) => {
  return path.join(RESOURCES_PATH, paths);
};

function createWindow(dimensions) {
  if (dev !== true) {
    devBrowserProperties = {
      fullscreenable: false,
      resizable: false,
    }

  }
  // Create tray icon.
  createTray()
  let appWidth = 400;
  let appHeight = 720;
  let xPosition = (dimensions.width - appWidth)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    ...devBrowserProperties,
    x: xPosition,
    y: 0,
    width: appWidth,
    height: appHeight,
    icon: __dirname + '/marvin.ico',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  let indexPath


  // Server Options
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    // Ether from devServer
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    // Or build file
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  // Load base html
  mainWindow.loadURL(indexPath)

  // Load menu
  Menu.setApplicationMenu(mainMenu)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {

    mainWindow.show()
    // Open the DevTools automatically if developing
    if (dev) {
      const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer')
      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('close', function (e) {
    if(mainWindow.isMinimized()) {
      app.quit()
    } else {
      e.preventDefault()
      mainWindow.minimize();

    }
  })
  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  const display = screen.getPrimaryDisplay();
  const dimensions = display.size;
  createWindow(dimensions);

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }

})
