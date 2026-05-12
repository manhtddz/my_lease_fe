import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './en/en.json';
import translationVI from './vi/vi.json';
import translationValidationEN from './en/validation.json';
import translationValidationVI from './vi/validation.json';
import translationEnumsEN from './en/enums.json';
import translationEnumsVI from './vi/enums.json';

export const lang = i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    ...translationEN,
                    validation: translationValidationEN,
                    enums: translationEnumsEN
                }
            },
            vi: {
                translation: {
                    ...translationVI,
                    validation: translationValidationVI,
                    enums: translationEnumsVI
                }
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });