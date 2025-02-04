import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import * as fs from "fs";
import * as path from "path";

let window: BrowserWindow;
const isDev = process.env.IS_DEV == "true" ? true : false;

// Add settings file path and type definition
const settingsPath = path.join(app.getPath("userData"), "settings.json");
interface Settings {
    windowMode: WindowMode;
    showFrame: boolean;
}

// Initialize settings with defaults
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

const getLastWindowMode = () => {
    return settings.windowMode;
};

const getShowFrame = () => {
    return settings.showFrame;
};

const initialSize = { width: 1024, height: 650 };

const createWindow = () => {
    const lastMode = getLastWindowMode();
    Menu.setApplicationMenu(null);

    window = new BrowserWindow({
        ...initialSize,
        autoHideMenuBar: false,
        fullscreen: lastMode === "fullscreen",
        resizable: lastMode === "windowed",
        frame: getShowFrame(),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    window.on("closed", () => {
        window = null as any;
    });

    window.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    // if (isDev) window.webContents.openDevTools();
    setWindowMode(lastMode);
};

const setWindowMode = (mode: WindowMode) => {
    if (!window || !["windowed", "borderless", "fullscreen"].includes(mode)) return;

    const currentShowFrame = getShowFrame();
    const needsRestart = (currentShowFrame && mode === "borderless") || (!currentShowFrame && mode === "windowed");

    settings.showFrame = mode === "windowed";
    settings.windowMode = mode;

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

ipcMain.handle("set-window-mode", async (_, mode: WindowMode) => setWindowMode(mode));

app.whenReady().then(() => {
    loadSettings();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
