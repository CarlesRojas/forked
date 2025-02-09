import { MoveUpgrade, PieceUpgrade, Stage, Tournament } from "@/game/match/type";
import { LanguageObject } from "@/locale/language";

export const en: LanguageObject = {
    enum: {
        language: {
            es: "Spanish",
            en: "English",
        },
        tournament: {
            [Tournament.SCHOOL_CHESS_CLUB]: "School Chess Club",
            [Tournament.LOCAL_TOURNAMENT]: "Local Tournament",
            [Tournament.REGIONAL_CHAMPIONSHIP]: "Regional Championship",
            [Tournament.NATIONAL_OPEN]: "National Open",
            [Tournament.INTERNATIONAL_INVITATIONAL]: "International Invitational",
            [Tournament.GRAND_PRIX_SERIES]: "Grand Prix Series",
            [Tournament.CANDIDATES_TOURNAMENT]: "Candidates Tournament",
            [Tournament.WORLD_CHAMPIONSHIP]: "World Championship",
            [Tournament.CHALLENGER]: "Challenger",
        },
        stage: {
            [Stage.QUARTER_FINALS]: "Quarter Finals",
            [Stage.SEMIFINALS]: "Semi-Finals",
            [Stage.FINALS]: "Finals",
        },
        pieceUpgrade: {
            [PieceUpgrade.PAWN]: "Pawn",
            [PieceUpgrade.KNIGHT]: "Knight",
            [PieceUpgrade.BISHOP]: "Bishop",
            [PieceUpgrade.ROOK]: "Rook",
            [PieceUpgrade.QUEEN]: "Queen",
            [PieceUpgrade.KING]: "King",
        },
        moveUpgrade: {
            [MoveUpgrade.MOVE]: "Move",
            [MoveUpgrade.CAPTURE]: "Capture",
            [MoveUpgrade.CHECK]: "Check",
            [MoveUpgrade.MATE]: "Mate",
            [MoveUpgrade.PROMOTE]: "Promote",
            [MoveUpgrade.CASTLE]: "Castle",
        },
    },

    mainMenu: {
        title: "Forked",
        play: "Play",
        continue: "Continue",
        newGame: "New Game",
    },

    game: {
        status: {
            scoreAtLeast: "Score at least:",
            roundScore: "Round Score",
            funds: "Funds",
            moves: "Moves",
            consumables: "Consumables",
            modifiers: "Modifiers",
            price: "${{REWARD}} Price",
        },
    },
};
