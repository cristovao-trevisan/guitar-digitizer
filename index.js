const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

global.usb = require('usb')

let toLoad = process.NODE_ENV === 'production'
  ? url.format({
    pathname: path.join(__dirname, 'www', 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  : 'http://localhost:8080/'

// Keep a global reference of the window object
let win

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({width: 1080, height: 600})

  // and load the index.html of the app.
  win.loadURL(toLoad)

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object
    win = null
  })
}

app.on('ready', createWindow)

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
  if (win === null) {
    createWindow()
  }
})
