export type WindowMode = "windowed" | "fullscreen";

export interface Settings {
    windowMode: WindowMode;
}

declare global {
    interface Window {
        electron: {
            setFullscreenMode: () => Promise<void>;
            setWindowedMode: () => Promise<void>;
            getSettings: () => Promise<Settings>;
        };
    }
}

export {};
