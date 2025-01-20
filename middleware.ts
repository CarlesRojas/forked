import { CookieName } from "@/constant/Cookie";
import { DEFAULT_LANGUAGE, Language, LANGUAGES } from "@/locale/language";
import acceptLanguage from "accept-language";
import { NextRequest, NextResponse } from "next/server";

acceptLanguage.languages(LANGUAGES);

const excludedPaths = ["api", "_next/static", "_next/image", "asset", "favicon.ico", ".json", ".png", ".ico", ".svg"];

const getLanguageInCookie = (request: NextRequest) => {
    const cookie = request.cookies.get(CookieName.LANGUAGE);
    if (!cookie) return null;

    if (!Object.values(Language).includes(cookie.value as Language)) return null;

    return cookie.value as Language;
};

const getLanguageInPathname = (pathname: string) => {
    for (const language of LANGUAGES) if (pathname.startsWith(`/${language}`)) return language;
    return null;
};

const isLanguageInPathname = (pathname: string) => {
    return !!getLanguageInPathname(pathname) || pathname.startsWith("/_next");
};

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    if (excludedPaths.some((excludedPath) => path.includes(excludedPath))) return NextResponse.next();

    const language =
        getLanguageInPathname(path) ??
        getLanguageInCookie(request) ??
        (acceptLanguage.get(request.headers.get("Accept-Language")) as Language) ??
        DEFAULT_LANGUAGE;

    if (!isLanguageInPathname(path)) return NextResponse.redirect(new URL(`/${language}${path}`, request.url));

    const response = NextResponse.next();
    response.cookies.set(CookieName.LANGUAGE, language);
    return response;
}
