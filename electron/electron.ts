import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as steamworks from "steamworks.js";
import { Settings, WindowMode } from "../src/electron.d";

const isDev = process.env.IS_DEV == "true" ? true : false;

//  #################################################
//   SETTINGS
//  #################################################

const settingsPath = path.join(app.getPath("userData"), "settings.json");

let settings: Settings = {
    window: {
        mode: "fullscreen",
        width: 1024,
        height: 650,
        x: 50,
        y: 50,
    },
};

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

let steam: Omit<steamworks.Client, "init" | "runCallbacks">;
let window: BrowserWindow;
let saveWindowSizeTimeout: NodeJS.Timeout | undefined;

const setWindowMode = (mode: WindowMode) => {
    if (!window) return;
    settings.window.mode = mode;
    saveSettings();

    window.setFullScreen(mode === "fullscreen");

    if (mode === "windowed")
        setWindowSizeAndPosition(settings.window.x, settings.window.y, settings.window.width, settings.window.height);
};

const setWindowSizeAndPosition = (x?: number, y?: number, width?: number, height?: number) => {
    if (!window) return;

    if (x !== undefined && y !== undefined) {
        settings.window.x = x;
        settings.window.y = y;
        window.setPosition(x, y);
    }

    if (width !== undefined && height !== undefined) {
        settings.window.width = width;
        settings.window.height = height;
        window.setSize(width, height);
    }

    saveSettings();
};

const onResizeOrMove = () => {
    if (settings.window.mode !== "windowed") return;

    if (saveWindowSizeTimeout) clearTimeout(saveWindowSizeTimeout);

    saveWindowSizeTimeout = setTimeout(() => {
        if (!window.isDestroyed()) {
            const bounds = window.getBounds();
            setWindowSizeAndPosition(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        saveWindowSizeTimeout = undefined;
    }, 500);
};

const createWindow = () => {
    Menu.setApplicationMenu(null);

    const windowOptions = {
        ...settings.window,
        autoHideMenuBar: false,
        fullscreen: settings.window.mode === "fullscreen",
        resizable: true,
        frame: true,
        icon: path.join(__dirname, isDev ? "../public/icon.png" : "./icon.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.cjs"),
        },
    };

    window = new BrowserWindow(windowOptions);

    window.on("resized", onResizeOrMove);
    window.on("moved", onResizeOrMove);
    window.on("closed", () => {
        if (saveWindowSizeTimeout) {
            clearTimeout(saveWindowSizeTimeout);
            saveWindowSizeTimeout = undefined;
        }
    });

    window.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    try {
        steam = steamworks.init(3519930);
    } catch (error) {
        console.error("Failed to initialize Steam:", error);
    }

    window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    if (isDev) window.webContents.openDevTools();

    setWindowSizeAndPosition(settings.window.x, settings.window.y, settings.window.width, settings.window.height);
    setWindowMode(settings.window.mode);
};

//  #################################################
//   MAIN
//  #################################################

const exit = () => {
    window = null as any;
    if (saveWindowSizeTimeout) clearTimeout(saveWindowSizeTimeout);
    if (process.platform !== "darwin") app.quit();
};

app.whenReady().then(() => {
    loadSettings();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => exit());

//  #################################################
//   INTERFACE
//  #################################################

ipcMain.handle("GET_SETTINGS", () => settings);
ipcMain.handle("SET_FULLSCREEN_MODE", () => setWindowMode("fullscreen"));
ipcMain.handle("SET_WINDOWED_MODE", () => setWindowMode("windowed"));
ipcMain.handle("EXIT_GAME", exit);

//  #################################################
//   STEAM
//  #################################################

ipcMain.handle("IS_STEAM_ENABLED", () => !!steam);
ipcMain.handle("GET_STEAM_NAME", () => steam && steam.localplayer.getName());

steamworks.electronEnableSteamOverlay();
