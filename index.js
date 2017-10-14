const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		frame: true
	});

	mainWindow.webContents.openDevTools();

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/www/index.html');

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});