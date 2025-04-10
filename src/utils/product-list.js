import Astro from "astro:global"
import { getLangFromUrl, useTranslations } from "../i18n/utils";

const path = typeof window !== 'undefined' ? window.location : Astro.url.pathname;
const lang = getLangFromUrl(path);
const t = useTranslations(lang);

const defaultOptions = {
    season: t("parameters.демисезон"),
    typeOfClasp: t("parameters.шнуровка"),
    upperComposition: t("parameters.100% кожа"),
    liningComposition: t("parameters.100% хлопок"),
    soleComposition: t("parameters.Vibram (ЭВА)"),
    soleHeight: t("parameters.2.5 см"),
    fullnessOfShoes: t("parameters.F (6)"),
    madeIn: t("parameters.Россия"),
}

export const productOptMap = {
    RL24: {
        ...defaultOptions,
        name: 'Рояль',
        altName: 'royal',
        sku: 'RL24',
        color: t("parameters.черный / белый"),
        soleComposition: t("parameters.ЭВА"),
        images: {
            'dark side': import('/src/assets/img/shop/RL24/darkside/01.jpg'),
            'light side': import('/src/assets/img/shop/RL24/lightside/01.jpg'),
            white: import('/src/assets/img/shop/RL24/white/01.jpg'),
            black: import('/src/assets/img/shop/RL24/black/01.jpg'),
        },
    },
    EM24: {
        ...defaultOptions,
        name: 'Империум',
        altName: 'empire',
        sku: 'EM24',
        color: t("parameters.черный / желтый"),
        images: {
            black: import('/src/assets/img/shop/EM24/black/01.jpg'),
            classic: import('/src/assets/img/shop/EM24/classic/01.jpg'),
            choco: import('/src/assets/img/shop/EM24/choco/01.jpg'),
            rif: import('/src/assets/img/shop/EM24/rif/01.jpg'),
        },
    },
};

export const colorMap = {
    'dark side': t("order.дарк сайд"),
    'light side': t("order.лайт сайд"),
    white: t("order.тотал вайт"),
    black: t("order.тотал блэк"),
    gold: t("order.аурум"),
    classic: t("order.классик"),
    black: t("order.тотал блэк"),
    choco: t("order.шоко"),
    rif: t("order.риф"),
};