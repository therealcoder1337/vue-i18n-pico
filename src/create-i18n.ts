import {ref} from 'vue';
import makeTranslator from './make-translator.js';
import makePlugin from './make-plugin.js';
import {log, err, msg, isDev} from './utils.js';
import {prepareAllMessages} from './prepare-messages.js';
import type {PluginWithI18n, Settings} from './types.js';

export default function createI18n (settings: Settings): PluginWithI18n {
    if (!settings.messages) {
        throw err('missing "messages"');
    }

    if (!['undefined', 'boolean'].includes(typeof settings.production)) {
        throw err(`invalid "production" setting type "${typeof settings.production}", expected boolean`);
    }

    settings.production = !!settings.production;

    if (!settings.production && isDev) {
        log('running in development mode (might be slower due to parsing linked messages at runtime)');
    }

    const defaultLocale = 'en-US';
    const {messages: messagesRaw} = settings;
    const locale = ref(settings.locale ?? defaultLocale);
    const fallbackLocale = ref(settings.fallbackLocale);
    const messages = settings.production ? messagesRaw : prepareAllMessages(messagesRaw);

    if (isDev && !settings.locale && !Object.keys(messages).includes(defaultLocale)) {
        console.warn(msg(
            `No locale matching the default 'en-US' was found in your messages object. 
            Either rename the default locale in your messages or specify a matching locale in your vue-i18n-pico config.`
        ));
    }

    const t = makeTranslator(messages, {locale, fallbackLocale});

    return {...makePlugin(t, locale), t, locale};
}
