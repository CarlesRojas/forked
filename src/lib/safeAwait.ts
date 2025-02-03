/* eslint-disable @typescript-eslint/no-explicit-any */

export const safeAwait = async <T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]> => {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        return [null, error as E];
    }
};

export const safeAwaits = async <T extends any[], E = Error>(
    promises: [...{ [K in keyof T]: Promise<T[K]> }],
): Promise<[{ [K in keyof T]: T[K] }, null] | [null, E]> => {
    try {
        const result = await Promise.all(promises);
        return [result, null];
    } catch (error) {
        return [null, error as E];
    }
};
