import type {Ref} from 'vue';
import type {Messages, Translate, TranslateParams, TranslateOptions, MessagesObject, MessagesValue} from './types.js';

const reduceList = (carry: string, current: string | number, idx: number) => carry.replaceAll(`{${idx}}`, current as string);
const reduceNamed = (carry: string, [name, val]: [string, string | number]) => carry.replaceAll(`{${name}}`, val as string);

export default (messages: Messages, {locale, fallbackLocale}: {locale: Ref<string>; fallbackLocale?: Ref<string | undefined>}): Translate => {
    return function t (name: string, params?: TranslateParams, opts?: TranslateOptions) {
        const translations = messages[opts?.locale ?? locale.value];
        const fallbackTranslations = fallbackLocale?.value && locale.value !== fallbackLocale?.value ? messages[fallbackLocale!.value!] : null;
        const parts = name.split('.');
        const translate = (translations: MessagesObject) => parts.reduce((carry, prop) => (carry as MessagesObject)?.[prop] ?? null, translations as MessagesValue | null);

        const raw = '' + (translate(translations || {}) ?? (fallbackTranslations ? (translate(fallbackTranslations) ?? name) : name));

        return !params ?
            raw :
            (Array.isArray(params) ? params.reduce(reduceList, raw) : Object.entries(params).reduce(reduceNamed, raw));
    };
};
