import { atomWithStorage } from "jotai/utils";

export enum Atom {
    SAVED_CHESSBOARD = "FORKED_SAVED_CHESSBOARD",
    IS_IN_MIDDLE_OF_GAME = "FORKED_IS_IN_MIDDLE_OF_GAME",
}

export const isInMiddleOfGameAtom = atomWithStorage<boolean>(Atom.IS_IN_MIDDLE_OF_GAME, false, undefined, {
    getOnInit: true,
});

export const savedChessboardAtom = atomWithStorage<string | null>(Atom.SAVED_CHESSBOARD, null, undefined, {
    getOnInit: true,
});
