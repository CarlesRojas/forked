import { IpcRenderer } from "electron";

export type WindowMode = "windowed" | "fullscreen";

export interface Settings {
    window: {
        mode: WindowMode;
        width: number;
        height: number;
        x: number | undefined;
        y: number | undefined;
    };
}

declare global {
    interface Window {
        electron: IpcRenderer;
    }
}

export {};
