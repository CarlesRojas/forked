import { Match, MatchSchema } from "@/game/match/type";
import { atomWithStorage } from "jotai/utils";

export enum Atom {
    SAVED_CHESSBOARD = "FORKED_SAVED_CHESSBOARD",
    CURRENT_MATCH = "FORKED_CURRENT_MATCH",
}

export const currentMatchAtom = atomWithStorage<Match | null>(
    Atom.CURRENT_MATCH,
    null,
    {
        getItem(key, initialValue) {
            const storedValue = localStorage.getItem(key);

            try {
                return MatchSchema.parse(JSON.parse(storedValue ?? ""));
            } catch {
                return initialValue;
            }
        },
        setItem(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem(key) {
            localStorage.removeItem(key);
        },
        subscribe(key, callback, initialValue) {
            if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {};

            const listener = (event: StorageEvent) => {
                if (event.storageArea === localStorage && event.key === key) {
                    let newValue;
                    try {
                        newValue = MatchSchema.parse(JSON.parse(event.newValue ?? ""));
                    } catch {
                        newValue = initialValue;
                    }
                    callback(newValue);
                }
            };

            window.addEventListener("storage", listener);
            return () => window.removeEventListener("storage", listener);
        },
    },
    {
        getOnInit: true,
    },
);

export const savedChessboardAtom = atomWithStorage<string | null>(Atom.SAVED_CHESSBOARD, null, undefined, {
    getOnInit: true,
});
