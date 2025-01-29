import en from './locales/en.js';
import ru from './locales/ru.js';

export const defaultLang = 'ru';

export const showDefaultLang = false;

export const languages = {
    'en': 'En',
    'ru': 'Ru',
};

export const ui = {
    'en': en,
    'ru': ru,
} as const;
