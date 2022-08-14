interface AppConfig {
    globalProperties: Object;
}

interface App {
    provide: Function;
    config: AppConfig;
}

type Plugin = {
    install: (app: any) => void
};

type Settings = {
    messages: object,
    production?: boolean,
    locale?: string,
    fallbackLocale?: string,
};

type TranslateParams = Array<any> | object;

type Translate = (key: string, params?: TranslateParams) => string;

type Ref<Type> = {
    value: Type
};

type I18n = {
    t: Translate,
    locale: Ref<string>
};

export function createI18n(settings: Settings): Plugin;

export function makePlugin(t: Translate, params?: TranslateParams) : Plugin;

export function useI18n() : I18n;

export function prepareMessages(messages: object) : object;
export function prepareAllMessages(messagesRaw: object) : object;
