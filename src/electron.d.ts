interface ElectronAPI {
    setFullscreenMode: () => Promise<void>;
    setWindowedMode: () => Promise<void>;
    setBorderlessMode: () => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

export {};
