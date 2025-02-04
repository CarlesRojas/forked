interface ElectronAPI {
    setWindowMode: (mode: "windowed" | "borderless" | "fullscreen") => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

export {};
