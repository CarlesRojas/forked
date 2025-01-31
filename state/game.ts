import { atomWithStorage } from "jotai/utils";

export const savedChessboardAtom = atomWithStorage<string | null>("savedChessboard", null, undefined, {
    getOnInit: true,
});
