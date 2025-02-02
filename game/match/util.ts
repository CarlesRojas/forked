import { Base, Fen, Material } from "@/game/chess/type";
import { Match, MoveUpgrade, PieceUpgrade, Stage, Tarot, Tournament } from "@/game/match/type";

export const createNewMatch = () => {
    const match: Match = {
        money: 0,
        pieceLevels: {
            [PieceUpgrade.PAWN]: 0,
            [PieceUpgrade.KNIGHT]: 0,
            [PieceUpgrade.BISHOP]: 0,
            [PieceUpgrade.ROOK]: 0,
            [PieceUpgrade.QUEEN]: 0,
            [PieceUpgrade.KING]: 0,
        },
        moveLevels: {
            [MoveUpgrade.MOVE]: 0,
            [MoveUpgrade.CAPTURE]: 0,
            [MoveUpgrade.CHECK]: 0,
            [MoveUpgrade.MATE]: 0,
            [MoveUpgrade.PROMOTE]: 0,
            [MoveUpgrade.EN_PASSANT]: 0,
            [MoveUpgrade.CASTLE]: 0,
        },
        maxMoves: 10,
        consumables: [],
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
