const reduceList = (carry, current, idx) => carry.replaceAll(`{${idx}}`, current);
const reduceNamed = (carry, [name, val]) => carry.replaceAll(`{${name}}`, val);

export default (messages, {locale, fallbackLocale}) => {
    return function t (name, params) {
        const translations = messages[locale.value];
        const fallbackTranslations = fallbackLocale?.value && locale.value !== fallbackLocale.value ? messages[fallbackLocale.value] : null;
        const parts = name.split('.');
        const translate = translations => parts.reduce((carry, prop) => carry?.[prop] ?? null, translations);

        const raw = '' + (translate(translations || {}) ?? (fallbackTranslations ? (translate(fallbackTranslations) ?? name) : name));

        return !params ?
            raw :
            (Array.isArray(params) ? params.reduce(reduceList, raw) : Object.entries(params).reduce(reduceNamed, raw));
    };
};
