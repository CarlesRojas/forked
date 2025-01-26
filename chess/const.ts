export const MAX_ENGINE_THINK_TIME = 4000;

export const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

// TODO use this
export enum EngineDifficulty {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3,
    EXPERT = 4,
    MASTER = 5,
    GRANDMASTER = 6,
}
