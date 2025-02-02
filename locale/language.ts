import { MoveUpgrade, PieceUpgrade, Stage, Tournament } from "@/game/match/type";
import { z } from "zod";

export enum Language {
    EN = "en",
    ES = "es",
}
export const DEFAULT_LANGUAGE = Language.EN;
export const LANGUAGES = Object.values(Language);

export const LanguageObjectSchema = z.object({
    enum: z.object({
        language: z.object(Object.fromEntries(Object.values(Language).map((item) => [item, z.string()]))),
        tournament: z.object(Object.fromEntries(Object.values(Tournament).map((item) => [item, z.string()]))),
        stage: z.object(Object.fromEntries(Object.values(Stage).map((item) => [item, z.string()]))),
        pieceUpgrade: z.object(Object.fromEntries(Object.values(PieceUpgrade).map((item) => [item, z.string()]))),
        moveUpgrade: z.object(Object.fromEntries(Object.values(MoveUpgrade).map((item) => [item, z.string()]))),
    }),

    mainMenu: z.object({
        title: z.string(),
        play: z.string(),
        continue: z.string(),
        newGame: z.string(),
    }),

    game: z.object({
        status: z.object({
            scoreAtLeast: z.string(),
            roundScore: z.string(),
            funds: z.string(),
            moves: z.string(),
            consumables: z.string(),
            modifiers: z.string(),
            price: z.string(),
        }),
    }),
});

export type LanguageObject = z.infer<typeof LanguageObjectSchema>;
