import type {App, Ref} from 'vue';

export type Plugin = {
    install: (app: App) => void;
};

export type Settings<T extends MessagesObject = MessagesObject> = {
    messages: Messages<T>;
    production?: boolean;
    locale?: string;
    fallbackLocale?: string;
    plugins?: TranslatePlugin<T>[];
};

export type Messages<T extends MessagesObject = MessagesObject> = Record<string, T>;

export type MessagesObject = {
    [key: string]: MessagesValue;
};

export type MessagesValue = string | number | MessagesObject | MessagesArray;

export type MessagesArray = MessagesValue[];

export type Translate<T extends MessagesObject = MessagesObject> =
    ((key: TranslateKeys<T>, params?: TranslateParams | null, options?: TranslateOptions) => string) &
    ((key: string, params?: TranslateParams | null, options?: TranslateOptions) => string);

export type TranslateOptions = {locale: string};

export type TranslateParams = (string | number)[] | {[key: string | number]: string | number} | null;

export type I18n<T extends MessagesObject = MessagesObject> = {
    t: Translate<T>;
    locale: Ref<string>;
};

export type PluginWithI18n = Plugin & I18n;

export type TranslatePluginArgs<T extends MessagesObject = MessagesObject> = {
    name: string;
    translations: T;
    fallbackTranslations: T | null;
    messages: Messages<T>;
    locale: Ref<string>;
    fallbackLocale?: Ref<string | undefined>;
    raw: string;
    result: string;
    params?: TranslateParams;
    opts?: TranslateOptions;
};

type TranslatePluginIntercept<T extends MessagesObject = MessagesObject> =
  ((args: TranslatePluginArgs<T>) => string) & { intercept: true };

type TranslatePluginNoIntercept<T extends MessagesObject = MessagesObject> =
  ((args: TranslatePluginArgs<T>) => void) & { intercept?: false };

export type TranslatePlugin<T extends MessagesObject = MessagesObject> =
  TranslatePluginIntercept<T> | TranslatePluginNoIntercept<T>;

export type TranslateKeys<T, Prefix extends string = ''> =
  T extends object
      ? {
          [K in keyof T]: `${Prefix}${K extends string ? K : ''}` |
          (T[K] extends object ? `${Prefix}${K extends string ? `${K}.` : ''}${TranslateKeys<T[K], ''>}` : never)
      }[keyof T]
      : '';
