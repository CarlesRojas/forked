import { PieceTypeSchema } from "@/game/chess/type";
import { z } from "zod";

export const exhaustiveRecord = <T extends { [k: string]: string | number }>(enumObj: T, valueSchema: z.ZodType) => {
    const entries = Object.values(enumObj).map((key) => [key, valueSchema] as const);
    return z.object(Object.fromEntries(entries));
};

export enum Tournament {
    SCHOOL_CHESS_CLUB = "SCHOOL_CHESS_CLUB",
    LOCAL_TOURNAMENT = "LOCAL_TOURNAMENT",
    REGIONAL_CHAMPIONSHIP = "REGIONAL_CHAMPIONSHIP",
    NATIONAL_OPEN = "NATIONAL_OPEN",
    INTERNATIONAL_INVITATIONAL = "INTERNATIONAL_INVITATIONAL",
    GRAND_PRIX_SERIES = "GRAND_PRIX_SERIES",
    CANDIDATES_TOURNAMENT = "CANDIDATES_TOURNAMENT",
    WORLD_CHAMPIONSHIP = "WORLD_CHAMPIOSHIP",
    CHALLENGER = "CHALLENGER",
}

export enum Stage {
    QUARTER_FINALS = "QUARTER_FINALS",
    SEMIFINALS = "SEMIFINALS",
    FINALS = "FINALS",
}

export enum PieceUpgrade {
    PAWN = "PAWN",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    ROOK = "ROOK",
    QUEEN = "QUEEN",
    KING = "KING",
}

export enum MoveUpgrade {
    MOVE = "MOVE",
    CAPTURE = "CAPTURE",
    CHECK = "CHECK",
    MATE = "MATE",
    PROMOTE = "PROMOTE",
    EN_PASSANT = "EN_PASSANT",
    CASTLE = "CASTLE",
}

export enum Tarot {
    THE_FOOL = "THE_FOOL",
    THE_MAGICIAN = "THE_MAGICIAN",
    THE_HIGH_PRIESTESS = "THE_HIGH_PRIESTESS",
    THE_EMPRESS = "THE_EMPRESS",
    THE_EMPEROR = "THE_EMPEROR",
    THE_HIEROPHANT = "THE_HIEROPHANT",
    THE_LOVERS = "THE_LOVERS",
    THE_CHARIOT = "THE_CHARIOT",
    STRENGTH = "STRENGTH",
    THE_HERMIT = "THE_HERMIT",
    WHEEL_OF_FORTUNE = "WHEEL_OF_FORTUNE",
    JUSTICE = "JUSTICE",
    THE_HANGED_MAN = "THE_HANGED_MAN",
    DEATH = "DEATH",
    TEMPERANCE = "TEMPERANCE",
    THE_DEVIL = "THE_DEVIL",
    THE_TOWER = "THE_TOWER",
    THE_STARS = "THE_STARS",
    THE_MOON = "THE_MOON",
    THE_SUN = "THE_SUN",
    JUDGEMENT = "JUDGEMENT",
    THE_WORLD = "THE_WORLD",
}

export const ShopSchema = z.object({
    rerolls: z.number().default(0),
    cards: z.array(
        z.union([
            z.nativeEnum(Tarot),
            z.nativeEnum(PieceUpgrade),
            z.nativeEnum(MoveUpgrade),
            // z.nativeEnum(Mod),
        ]),
    ),
    // TODO boosters: z.array(z.nativeEnum(Booster)),
    // TODO voucher: z.nativeEnum(Voucher).nullable(),
});
export type Shop = z.infer<typeof ShopSchema>;

export const RoundSchema = z.object({
    tournament: z.nativeEnum(Tournament),
    stage: z.nativeEnum(Stage),
    targetScore: z.number(),
    currentScore: z.number().default(0),
    movesMade: z.number().default(0),
    reward: z.number(),
    // TODO effect: z.nativeEnum(RoundEffect),
    // TODO color: z.nativeEnum(Color),
    // TODO skipEffect: z.nativeEnum(SkipEffect),
    shop: ShopSchema,
});
export type Round = z.infer<typeof RoundSchema>;

export const MatchSchema = z.object({
    money: z.number(),
    pieceLevels: exhaustiveRecord(PieceUpgrade, z.number()),
    moveLevels: exhaustiveRecord(MoveUpgrade, z.number()),
    maxMoves: z.number(),
    consumables: z.array(z.nativeEnum(Tarot)),
    currentRound: z.number().default(0),
    rounds: z.array(RoundSchema),
    pieces: z.array(PieceTypeSchema),
    // TODO mods: z.array(z.nativeEnum(Mod)),
    // TODO vouchers: z.array(z.nativeEnum(Voucher)),
});
export type Match = z.infer<typeof MatchSchema>;
