import type {App, Ref} from 'vue';

export type Plugin = {
    install: (app: App) => void;
};

export type Settings = {
    messages: Messages;
    production?: boolean;
    locale?: string;
    fallbackLocale?: string;
};

export type Messages = {
    [locale: string]: MessagesObject;
};

export type MessagesObject = {
    [key: string]: MessagesValue;
};

export type MessagesValue = string | number | MessagesObject | MessagesArray;

export type MessagesArray = MessagesValue[];

export type Translate = (key: string, params?: TranslateParams | null, options?: TranslateOptions) => string;

export type TranslateOptions = {locale: string};

export type TranslateParams = (string | number)[] | {[key: string | number]: string | number} | null;

export type I18n = {
    t: Translate;
    locale: Ref<string>;
};

export type PluginWithI18n = Plugin & I18n;
