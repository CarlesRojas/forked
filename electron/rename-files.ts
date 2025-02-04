import { rename } from "node:fs/promises";
import { join } from "node:path";

const electronDir = join(process.cwd(), "electron");

async function renameFiles() {
    try {
        await rename(join(electronDir, "electron.js"), join(electronDir, "electron.cjs"));
        await rename(join(electronDir, "preload.js"), join(electronDir, "preload.cjs"));
        console.log("Successfully renamed files");
    } catch (error) {
        console.error("Error renaming files:", error);
        process.exit(1);
    }
}

renameFiles();
