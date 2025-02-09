import { Base, Fen, Material } from "@/game/chess/type";
import { Match, MoveUpgrade, PieceUpgrade, Stage, Tarot, Tournament } from "@/game/match/type";

export const createNewMatch = () => {
    const match: Match = {
        money: 0,
        pieceLevels: {
            [PieceUpgrade.PAWN]: 1,
            [PieceUpgrade.KNIGHT]: 1,
            [PieceUpgrade.BISHOP]: 1,
            [PieceUpgrade.ROOK]: 1,
            [PieceUpgrade.QUEEN]: 1,
            [PieceUpgrade.KING]: 1,
        },
        moveLevels: {
            [MoveUpgrade.MOVE]: 1,
            [MoveUpgrade.CAPTURE]: 1,
            [MoveUpgrade.CHECK]: 1,
            [MoveUpgrade.MATE]: 1,
            [MoveUpgrade.PROMOTE]: 1,
            [MoveUpgrade.CASTLE]: 1,
        },
        maxMoves: 10,
        consumables: [],
        currentRound: 0,
        rounds: [
            {
                tournament: Tournament.SCHOOL_CHESS_CLUB,
                stage: Stage.QUARTER_FINALS,
                targetScore: 500,
                currentScore: 0,
                movesMade: 0,
                reward: 3,
                shop: {
                    rerolls: 0,
                    cards: [Tarot.THE_STARS, Tarot.DEATH, Tarot.THE_MAGICIAN],
                },
            },
        ],
        pieces: [
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_PAWN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },

            { fen: Fen.WHITE_ROOK, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_KNIGHT, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_BISHOP, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_QUEEN, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_KING, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_BISHOP, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_KNIGHT, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
            { fen: Fen.WHITE_ROOK, material: Material.DEFAULT, base: Base.DEFAULT, hasMoved: false },
        ],
    };

    return match;
};
