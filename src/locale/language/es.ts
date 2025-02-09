import { MoveUpgrade, PieceUpgrade, Stage, Tournament } from "@/game/match/type";
import { LanguageObject } from "@/locale/language";

export const es: LanguageObject = {
    enum: {
        language: {
            es: "Español",
            en: "Inglés",
        },
        tournament: {
            [Tournament.SCHOOL_CHESS_CLUB]: "Club de Ajedrez Escolar",
            [Tournament.LOCAL_TOURNAMENT]: "Torneo Local",
            [Tournament.REGIONAL_CHAMPIONSHIP]: "Campeonato Regional",
            [Tournament.NATIONAL_OPEN]: "Torneo Nacional",
            [Tournament.INTERNATIONAL_INVITATIONAL]: "Invitacional Internacional",
            [Tournament.GRAND_PRIX_SERIES]: "Serie de Grand Prix",
            [Tournament.CANDIDATES_TOURNAMENT]: "Torneo de Candidatos",
            [Tournament.WORLD_CHAMPIONSHIP]: "Campeonato Mundial",
            [Tournament.CHALLENGER]: "Contendiente",
        },
        stage: {
            [Stage.QUARTER_FINALS]: "Cuartos de Final",
            [Stage.SEMIFINALS]: "Semifinales",
            [Stage.FINALS]: "Finales",
        },
        pieceUpgrade: {
            [PieceUpgrade.PAWN]: "Peón",
            [PieceUpgrade.KNIGHT]: "Caballo",
            [PieceUpgrade.BISHOP]: "Alfil",
            [PieceUpgrade.ROOK]: "Torre",
            [PieceUpgrade.QUEEN]: "Reina",
            [PieceUpgrade.KING]: "Rey",
        },
        moveUpgrade: {
            [MoveUpgrade.MOVE]: "Movimiento",
            [MoveUpgrade.CAPTURE]: "Captura",
            [MoveUpgrade.CHECK]: "Jaque",
            [MoveUpgrade.MATE]: "Mate",
            [MoveUpgrade.PROMOTE]: "Promoción",
            [MoveUpgrade.CASTLE]: "Enroque",
        },
    },

    mainMenu: {
        title: "Forked",
        play: "Jugar",
        continue: "Continuar",
        newGame: "Nueva Partida",
    },

    game: {
        status: {
            scoreAtLeast: "Puntua como mínimo:",
            roundScore: "Puntuación actual",
            funds: "Dinero",
            moves: "Movimientos",
            consumables: "Consumibles",
            modifiers: "Modificadores",
            price: "Premio de ${{REWARD}}",
        },
    },
};
