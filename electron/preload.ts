import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    setFullscreenMode: () => ipcRenderer.invoke("setFullscreenMode"),
    setWindowedMode: () => ipcRenderer.invoke("setWindowedMode"),
    setBorderlessMode: () => ipcRenderer.invoke("setBorderlessMode"),
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
