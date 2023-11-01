import type {Ref} from 'vue';
import type {Messages, TranslateParams, TranslateOptions, TranslateKeys, MessagesObject, MessagesValue, TranslatePlugin} from './types.js';

const reduceList = (carry: string, current: string | number, idx: number) => carry.replaceAll(`{${idx}}`, current as string);
const reduceNamed = (carry: string, [name, val]: [string, string | number]) => carry.replaceAll(`{${name}}`, val as string);

export default <T extends MessagesObject = MessagesObject>(messages: Messages<T>, {locale, fallbackLocale, plugins}: {locale: Ref<string>; fallbackLocale?: Ref<string | undefined>; plugins?: TranslatePlugin<T>[]}) => {
    // overload for general strings
    function t(name: string, params?: TranslateParams, opts?: TranslateOptions): string;

    // overload for autocomplete
    function t<K extends TranslateKeys<T>>(name: K, params?: TranslateParams, opts?: TranslateOptions): string;

    function t (name: string | TranslateKeys<T>, params?: TranslateParams, opts?: TranslateOptions): string {
        const translations = messages[opts?.locale ?? locale.value];
        const fallbackTranslations = fallbackLocale?.value && locale.value !== fallbackLocale?.value ? messages[fallbackLocale!.value!] : null;
        const parts = name.split('.');
        const translate = (translations: MessagesObject) => parts.reduce((carry, prop) => (carry as MessagesObject)?.[prop] ?? null, translations as MessagesValue | null);

        const raw = '' + (translate(translations || {}) ?? (fallbackTranslations ? (translate(fallbackTranslations) ?? name) : name));

        let result = !params ?
            raw :
            (Array.isArray(params) ? params.reduce(reduceList, raw) : Object.entries(params).reduce(reduceNamed, raw));

        if (plugins) {
            for (const plugin of plugins) {
                const pluginResult = plugin({name, params, opts, translations, fallbackTranslations, messages, locale, fallbackLocale, raw, result});

                if (plugin.intercept) {
                    result = pluginResult as string;
                }
            }
        }

        return result;
    };

    return t;
};
