import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    getSettings: () => ipcRenderer.invoke("getSettings"),
    setFullscreenMode: () => ipcRenderer.invoke("setFullscreenMode"),
    setWindowedMode: () => ipcRenderer.invoke("setWindowedMode"),
});

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ["chrome", "node", "electron"]) {
        replaceText(`${dependency}-version`, process.versions[dependency] ?? "");
    }
});
