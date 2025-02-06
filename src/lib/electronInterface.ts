const electronMethod = [
    "GET_SETTINGS",
    "SET_FULLSCREEN_MODE",
    "SET_WINDOWED_MODE",
    "EXIT_GAME",

    // Steam
    "GET_STEAM_NAME",
    "IS_STEAM_ENABLED",
] as const;
export type ElectronMethod = (typeof electronMethod)[number];

export const electron = async (method: ElectronMethod) => {
    if (typeof window === "undefined" || !window.electron) return;

    return await window.electron.invoke(method);
};
