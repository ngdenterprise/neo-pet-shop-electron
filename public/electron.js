const electron = require("electron");
const path = require("path");

const mode = (process.argv[2] || "").trim().replace(/^--/, "");
console.log("Running in mode: ", mode);

let mainWindow = null;

const createWindow = () => {
  // Create the browser window and load the HTML of the outer frame:
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, "server", "./server.js"),
    },
  });
  mainWindow.loadFile(
    path.join(__dirname, mode === "dev" ? "electron.dev.html" : "electron.html")
  );
};

if (mode !== "dev") {
  electron.Menu.setApplicationMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.whenReady().then(createWindow);

// Quit when all windows are closed.
electron.app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

electron.app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

electron.ipcMain.on("get-save-path", (event) => {
  event.returnValue = electron.dialog.showSaveDialogSync(mainWindow);
});
