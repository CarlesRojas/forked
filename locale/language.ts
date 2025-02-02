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
    }),

    mainMenu: z.object({
        title: z.string(),
        play: z.string(),
        continue: z.string(),
        newGame: z.string(),
    }),
});

export type LanguageObject = z.infer<typeof LanguageObjectSchema>;
