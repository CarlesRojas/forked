declare global {
    interface Window {
        electron: {
            setFullscreenMode: () => Promise<void>;
            setWindowedMode: () => Promise<void>;
            setBorderlessMode: () => Promise<void>;
            getSettings: () => Promise<{
                mode: "windowed" | "borderless" | "fullscreen";
            }>;
        };
    }
}

export {};
