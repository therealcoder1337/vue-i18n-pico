import type {App, Ref} from 'vue';

type Plugin = {
    install: (app: App) => void
};

type Settings = {
    messages: object,
    production?: boolean,
    locale?: string,
    fallbackLocale?: string,
};

type TranslateParams = Array<any> | object;

type TranslateOptions = {locale: string};

type Translate = (key: string, params?: TranslateParams | null, options?: TranslateOptions) => string;

type I18n = {
    t: Translate,
    locale: Ref<string>
};

export function createI18n(settings: Settings): Plugin;

export function makePlugin(t: Translate, params?: TranslateParams) : Plugin;

export function useI18n() : I18n;

export function prepareMessages(messages: object) : object;
export function prepareAllMessages(messagesRaw: object) : object;
