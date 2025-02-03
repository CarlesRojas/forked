import { app, BrowserWindow, shell } from "electron";
import * as path from "path";

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
    const window = new BrowserWindow({
        width: 1024,
        height: 650,
        autoHideMenuBar: true,
        resizable: false,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.cjs"),
        },
    });

    window.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    // if (isDev) window.webContents.openDevTools();
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
