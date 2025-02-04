import { app, BrowserWindow, ipcMain, Menu, screen, shell } from "electron";
import * as fs from "fs";
import * as path from "path";

const isDev = process.env.IS_DEV == "true" ? true : false;

//  #################################################
//   SETTINGS
//  #################################################

const settingsPath = path.join(app.getPath("userData"), "settings.json");
export interface Settings {
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
            preload: path.join(__dirname, "preload.cjs"),
        },
    });

    window.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    if (isDev) window.webContents.openDevTools();
    setWindowMode(settings.windowMode);
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
//   INTERFACE
//  #################################################

const setWindowMode = (mode: WindowMode) => {
    const needsRestart = (settings.showFrame && mode === "borderless") || (!settings.showFrame && mode === "windowed");
    if (mode !== "fullscreen") settings.showFrame = mode === "windowed";
    settings.windowMode = mode;

    console.log(needsRestart);
    console.log(settings);

    if (!window) return;

    saveSettings();

    if (needsRestart) {
        app.relaunch();
        app.exit();
        return;
    }

    switch (mode) {
        case "windowed":
            window.setFullScreen(false);
            window.setResizable(true);
            window.setSize(initialSize.width, initialSize.height);
            break;

        case "borderless":
            window.setFullScreen(false);
            const windowBounds = window.getBounds();
            const currentDisplay = screen.getDisplayNearestPoint({ x: windowBounds.x, y: windowBounds.y });
            const { width, height, x, y } = currentDisplay.bounds;
            window.setSize(width, height);
            window.setPosition(x, y);
            window.setResizable(false);
            break;

        case "fullscreen":
            window.setFullScreen(true);
            break;
    }
};

ipcMain.handle("getSettings", async () => {
    console.log(settings);
    return settings;
});
ipcMain.handle("setFullscreenMode", async () => setWindowMode("fullscreen"));
ipcMain.handle("setWindowedMode", async () => setWindowMode("windowed"));
ipcMain.handle("setBorderlessMode", async () => setWindowMode("borderless"));
