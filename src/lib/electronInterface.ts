export enum ElectronMethod {
    GET_SETTINGS = "GET_SETTINGS",
    SET_FULLSCREEN_MODE = "SET_FULLSCREEN_MODE",
    SET_WINDOWED_MODE = "SET_WINDOWED_MODE",
    EXIT_GAME = "EXIT_GAME",

    // Steam
    GET_STEAM_NAME = "GET_STEAM_NAME",
    IS_STEAM_ENABLED = "IS_STEAM_ENABLED",
}

export const electron = async (method: ElectronMethod) => {
    if (typeof window === "undefined" || !window.electron) return;

    return await window.electron.invoke(method);
};
