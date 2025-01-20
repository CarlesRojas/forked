import { DEFAULT_LANGUAGE, Language, LanguageObject, LanguageObjectSchema } from '@/locale/language';
import { en } from '@/locale/language/en';
import { es } from '@/locale/language/es';

export const getTranslation = (language: string): LanguageObject => {
    const parsedLanguage: Language = !Object.values(Language).includes(language as Language)
        ? DEFAULT_LANGUAGE
        : (language as Language);

    const languageObject: Record<Language, LanguageObject> = {
        [Language.ES]: LanguageObjectSchema.parse(es) as LanguageObject,
        [Language.EN]: LanguageObjectSchema.parse(en) as LanguageObject
    };

    return languageObject[parsedLanguage];
};
