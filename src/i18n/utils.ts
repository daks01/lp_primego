import { ui, languages, defaultLang, showDefaultLang } from './ui';

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const urlRu = `${import.meta.env.BASE_URL}/${path}`.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
    const urlEn = `${import.meta.env.BASE_URL}/${l}/${path}`.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
    const isRuLang = !showDefaultLang && l === defaultLang;
    return isRuLang ? urlRu : urlEn;
  }
}

export function getLangFromUrl(url: URL) {
  const pathnameArr = url.pathname.split('/');
  const lang = Object.keys(languages).find(l=> pathnameArr.includes(l))
  if (lang && lang.length > 0) {
    return lang as keyof typeof ui;
  }
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui['en']) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}