import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";
import {
    fallbackLng,
    languages,
    cookieName,
} from "@/utils/locales/settings.js";
import acceptLanguage from "accept-language";

acceptLanguage.languages(languages);

export default async (req: any) => {
    let lng;
    if (req.cookies.has(cookieName))
        lng = acceptLanguage.get(req.cookies.get(cookieName).value);
    if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
    if (!lng) lng = fallbackLng;
    if (req.headers.has("referer")) {
        const refererUrl = new URL(req.headers.get("referer"));
        const lngInReferer = languages.find((l) =>
            refererUrl.pathname.startsWith(`/${l}`),
        );
        if (lngInReferer) req.cookies.set(cookieName, lngInReferer);
        return i18nRouter(req, i18nConfig);
    }


    return i18nRouter(req, i18nConfig);
};

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|utils/fonts|assets|icons).*)",
    ],
};
