const electronMethod = ["GET_SETTINGS", "SET_FULLSCREEN_MODE", "SET_WINDOWED_MODE", "EXIT_GAME"] as const;
export type ElectronMethod = (typeof electronMethod)[number];

export const electron = async (method: ElectronMethod) => {
    if (typeof window === "undefined" || !window.electron) return;

    return await window.electron.invoke(method);
};
