import { app, BrowserWindow, shell } from "electron";
import * as path from "path";

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 650,
        autoHideMenuBar: true,
        resizable: false,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    // Open the DevTools.
    if (isDev) {
        //mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
