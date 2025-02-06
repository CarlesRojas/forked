import { IpcRenderer } from "electron";

export type WindowMode = "windowed" | "fullscreen";

export interface Settings {
    windowMode: WindowMode;
}

declare global {
    interface Window {
        electron: IpcRenderer;
    }
}

export {};
