import { ChessBoard } from "@/chess/board";
import { atom } from "jotai";

export const boardAtom = atom(new ChessBoard());
