import { ChessBoard } from "@/game/chess/ChessBoard";
import { Fen, MoveType } from "@/game/chess/type";
import { MoveUpgrade, PieceUpgrade } from "@/game/match/type";
import { Event, useEvent } from "@/lib/Event";
import { currentMatchAtom } from "@/state/game";
import { useAtom } from "jotai";

interface Props {
    chessBoard: ChessBoard;
}

const fenToPieceUpgrade = (fen: Fen): PieceUpgrade => {
    const map: Record<Fen, PieceUpgrade> = {
        [Fen.WHITE_PAWN]: PieceUpgrade.PAWN,
        [Fen.WHITE_KNIGHT]: PieceUpgrade.KNIGHT,
        [Fen.WHITE_BISHOP]: PieceUpgrade.BISHOP,
        [Fen.WHITE_ROOK]: PieceUpgrade.ROOK,
        [Fen.WHITE_QUEEN]: PieceUpgrade.QUEEN,
        [Fen.WHITE_KING]: PieceUpgrade.KING,
        [Fen.BLACK_PAWN]: PieceUpgrade.PAWN,
        [Fen.BLACK_KNIGHT]: PieceUpgrade.KNIGHT,
        [Fen.BLACK_BISHOP]: PieceUpgrade.BISHOP,
        [Fen.BLACK_ROOK]: PieceUpgrade.ROOK,
        [Fen.BLACK_QUEEN]: PieceUpgrade.QUEEN,
        [Fen.BLACK_KING]: PieceUpgrade.KING,
    };
    return map[fen];
};

const moveTypeToMoveUpgrade = (moveType: Set<MoveType>): MoveUpgrade[] => {
    const map: Record<MoveType, MoveUpgrade> = {
        [MoveType.MOVE]: MoveUpgrade.MOVE,
        [MoveType.CAPTURE]: MoveUpgrade.CAPTURE,
        [MoveType.CASTLE]: MoveUpgrade.CASTLE,
        [MoveType.PROMOTE]: MoveUpgrade.PROMOTE,
        [MoveType.CHECK]: MoveUpgrade.CHECK,
        [MoveType.MATE]: MoveUpgrade.MATE,
    };
    return Array.from(moveType).map((moveType) => map[moveType]);
};

const pieceScaling = (piece: PieceUpgrade, level: number) => {
    const map: Record<PieceUpgrade, number> = {
        [PieceUpgrade.PAWN]: 5 * level,
        [PieceUpgrade.KNIGHT]: 10 * level,
        [PieceUpgrade.BISHOP]: 10 * level,
        [PieceUpgrade.ROOK]: 20 * level,
        [PieceUpgrade.QUEEN]: 40 * level,
        [PieceUpgrade.KING]: 50 * level,
    };

    return map[piece];
};

const moveScaling = (move: MoveUpgrade, level: number) => {
    const map: Record<MoveUpgrade, number> = {
        [MoveUpgrade.MOVE]: level,
        [MoveUpgrade.CAPTURE]: 2 * level,
        [MoveUpgrade.CASTLE]: 3 * level,
        [MoveUpgrade.CHECK]: 5 * level,
        [MoveUpgrade.PROMOTE]: 8 * level,
        [MoveUpgrade.MATE]: 10 * level,
    };

    return map[move];
};

export const useScore = ({ chessBoard }: Props) => {
    const { emit } = useEvent();

    const [match, setMatch] = useAtom(currentMatchAtom);

    const score = async () => {
        const lastMove = chessBoard.lastMove;
        if (!lastMove || !match) return;

        const { piece, currX, currY, moveType } = lastMove;

        const pieceMoved = fenToPieceUpgrade(piece.fen);
        const movesMade = moveTypeToMoveUpgrade(moveType);

        let points = pieceScaling(pieceMoved, match.pieceLevels[pieceMoved]);
        let mult = Math.max(...movesMade.map((m) => moveScaling(m, match.moveLevels[m])));

        setMatch({
            ...match,
            rounds: match.rounds.map((round, i) => {
                if (i === match.currentRound) {
                    return {
                        ...round,
                        currentScore: round.currentScore + points * mult,
                    };
                }

                return round;
            }),
        });

        emit(Event.SCORE_PIECE, { coords: { x: currX, y: currY } });
    };

    return score;
};
