import { ChessBoard } from "@/chess/ChessBoard";
import { atom } from "jotai";

export const chessBoardAtom = atom(new ChessBoard());
