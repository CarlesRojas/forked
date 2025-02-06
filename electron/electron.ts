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
    windowMode: "fullscreen",
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
const initialSize = { width: 1024, height: 650 };

const createWindow = () => {
    Menu.setApplicationMenu(null);

    window = new BrowserWindow({
        ...initialSize,
        autoHideMenuBar: false,
        fullscreen: settings.windowMode === "fullscreen",
        resizable: true,
        frame: true,
        icon: path.join(__dirname, isDev ? "../public/icon.png" : "./icon.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.cjs"),
        },
    });

    window.webContents.setWindowOpenHandler((event) => {
        shell.openExternal(event.url);
        return { action: "deny" };
    });

    try {
        steam = steamworks.init(123); // TODO add app id
    } catch (error) {
        console.error("Failed to initialize Steam:", error);
    }

    window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);

    // if (isDev) window.webContents.openDevTools();
    setWindowMode(settings.windowMode);
};

//  #################################################
//   MAIN
//  #################################################

const exit = () => {
    window = null as any;
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

const setWindowMode = (mode: WindowMode) => {
    if (!window) return;
    settings.windowMode = mode;
    saveSettings();

    switch (mode) {
        case "windowed":
            window.setFullScreen(false);
            window.setSize(initialSize.width, initialSize.height);
            break;

        case "fullscreen":
            window.setFullScreen(true);
            break;
    }
};

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
