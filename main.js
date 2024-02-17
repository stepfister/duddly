const { app, Menu, dialog, BrowserWindow } = require('electron')
const path = require('path')


function createWindow () {
  //Test
//const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
win.webContents.session.on('will-download', (event, item, webContents) => {
  // Set the save path, making Electron not to prompt a save dialog.
  //item.setSavePath('/tmp/save.pdf')
  // funkt item.setSavePath('/tmp/index.html')
  
  // funkt überschreibt in Appverzeichnis item.setSavePath(app.getAppPath()+ '/' + item.getFilename())
  
  // als appimage schreibt es ins appverzeichnis item.setSavePath(process.cwd()+ '/' + item.getFilename())
  
  let schlitzURL = win.webContents.getURL ()
  let currentURL = schlitzURL.slice(7)


  // ergibt Download-Pfad: file:///tmp/index.html - also String abschneiden

  item.setSavePath(currentURL)

    item.on('updated', (event, state) => {
    if (state === 'interrupted') {
      console.log('Download is interrupted but can be resumed')
    } else if (state === 'progressing') {
      if (item.isPaused()) {
        console.log('Download is paused')
      } else {
        console.log(`Received bytes: ${item.getReceivedBytes()}`)
        console.log(`Download-Pfad: ${item.getSavePath()}`)
      }
    }
  })
  item.once('done', (event, state) => {
    if (state === 'completed') {
      console.log('Download successfully'), 
      console.log(`Download-Pfad: ${item.getSavePath()}`)
    } else {
      console.log(`Download failed: ${state}`)
    }
  })
})
  
  
  
  
//  const win = new BrowserWindow({
//    width: 800,
//    height: 600,
//    webPreferences: {
//      preload: path.join(__dirname, 'preload.js')
//    }
//  })

  win.loadFile('startseite.html')


  // hier kommt das Menu

const template = [
  {    label: 'Datei',
    submenu: [
      {
        label: 'öffnen',
        click () {
          console.log('Datei wird geöffnet')
// Show an "Open File" dialog and attempt to open
// the chosen file in our window.
dialog.showOpenDialog(win, {
  properties: ['openFile']
}).then(result => {
  if (result.canceled) {
    console.log('Dialog was canceled')
  } else {
    const file = result.filePaths[0]
    win.loadURL(`file://${file}`)
  }
}).catch(err => {
  console.log(err)
})


        }
      },
      // default menu
      { type: 'separator' },
      // { role: 'close' },
      { role: 'quit' }      
    ]
  },
// Zweites Menü
{
  label: 'Fenster',
  submenu: [
     // default menu
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' }
  ]
}
]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)


}

app.whenReady().then(() => {
  createWindow()
 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      
    }

  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
