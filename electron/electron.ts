import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import * as fs from "fs";
import * as path from "path";

const isDev = process.env.IS_DEV == "true" ? true : false;

//  #################################################
//   SETTINGS
//  #################################################

const settingsPath = path.join(app.getPath("userData"), "settings.json");
interface Settings {
    windowMode: WindowMode;
    showFrame: boolean;
}

let settings: Settings = {
    windowMode: "fullscreen" as WindowMode,
    showFrame: true,
};

type WindowMode = "windowed" | "borderless" | "fullscreen";

const loadSettings = () => {
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, "utf8");
            const loadedSettings = JSON.parse(data);
            settings = { ...settings, ...loadedSettings };
        }
    } catch (error) {
        console.error("Failed to load settings:", error);
    }
};

const saveSettings = () => {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error("Failed to save settings:", error);
    }
};


//  #################################################
//   WINDOW
//  #################################################

let window: BrowserWindow;
const initialSize = { width: 1024, height: 650 };

const createWindow = () => {
    Menu.setApplicationMenu(null);

    window = new BrowserWindow({
        ...initialSize,
        autoHideMenuBar: false,
        fullscreen: settings.windowMode === "fullscreen",
        resizable: settings.windowMode === "windowed",
        frame: settings.showFrame,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    window.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    // if (isDev) window.webContents.openDevTools();
    setWindowMode(settings.windowMode);
};

const setWindowMode = (mode: WindowMode) => {
    console.log("CHANGE TO ", mode)
    if (!window || !["windowed", "borderless", "fullscreen"].includes(mode)) return;

    const needsRestart = (settings.showFrame && mode === "borderless") || (!settings.showFrame && mode === "windowed");

    settings.showFrame = mode === "windowed";
    settings.windowMode = mode;

    saveSettings();

    console.log(needsRestart)
    console.log(settings)
    if (needsRestart) {
        app.relaunch();
        app.exit();
        return;
    }

    switch (mode) {
        case "windowed":
            window.setFullScreen(false);
            window.setResizable(true);
            window.setSize(initialSize.width, initialSize.height); // TODO save last size and position
            break;

        case "borderless":
            window.setFullScreen(false);
            window.maximize();
            window.setResizable(false);
            break;

        case "fullscreen":
            window.setFullScreen(true);
            break;
    }
};

//  #################################################
//   MAIN
//  #################################################

app.whenReady().then(() => {
    loadSettings();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    window = null as any;
    if (process.platform !== "darwin") app.quit();
});


//  #################################################
//   GAME INTERFACE
//  #################################################

ipcMain.handle("set-window-mode", async (_, mode: WindowMode) => setWindowMode(mode));
