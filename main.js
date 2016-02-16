var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

app.commandLine.appendSwitch("no-proxy-server");

// Report crashes to our server.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  var mainWindow = new BrowserWindow({
    "resizable": true,
    "macIcon": "",
    "titleBarStyle": "default",
    "minHeight": "",
    "frame": true,
    "enableLargerThanScreen": false,
    "height": 768,
    "maxHeight": "",
    "autoHideMenuBar": false,
    "useContentSize": false,
    "skipTaskbar": false,
    "fullscreen": false,
    "icon": "",
    "acceptFirstMouse": false,
    "transparent": false,
    "minWidth": "",
    "x": "",
    "maxWidth": "",
    "width": 1024,
    "type": "",
    "alwaysOnTop": false,
    "darkTheme": false,
    "show": true,
    "y": "",
    "kiosk": false,
    "exeIcon": "",
    "backgroundColor": "#000000",
    "webPreferences": {
        "preload": "",
        "nodeIntegration": true,
        "javascript": true,
        "images": true,
        "plugins": false,
        "experimentalCanvasFeatures": false,
        "webgl": true,
        "allowRunningInsecureContent": false,
        "webaudio": true,
        "zoomFactor": 1.0,
        "blinkFeatures": "",
        "experimentalFeatures": false,
        "allowDisplayingInsecureContent": false,
        "textAreasAreResizable": true,
        "directWrite": true,
        "partition": "",
        "webSecurity": true
    },
    "title": "Electrify",
    "disableAutoHideCursor": false,
    "center": true
});
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.setUserAgent("");

  mainWindow.webContents.on('did-finish-load',function(){
    mainWindow.setTitle("Electrify");
    
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
