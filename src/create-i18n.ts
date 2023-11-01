import {ref} from 'vue';
import makeTranslator from './make-translator.js';
import makePlugin from './make-plugin.js';
import {log, err} from './utils.js';
import {prepareAllMessages} from './prepare-messages.js';
import type {MessagesObject, PluginWithI18n, Settings} from './types.js';

export default function createI18n<T extends MessagesObject = MessagesObject> (settings: Settings<T>): PluginWithI18n {
    if (!settings.messages) {
        throw err('missing "messages"');
    }

    if (!['undefined', 'boolean'].includes(typeof settings.production)) {
        throw err(`invalid "production" setting type "${typeof settings.production}", expected boolean`);
    }

    settings.production = !!settings.production;

    if (!settings.production && process.env.NODE_ENV !== 'production') {
        log('running in development mode (might be slower due to parsing linked messages at runtime)');
    }

    const {messages: messagesRaw} = settings;
    const locale = ref(settings.locale ?? 'en-US');
    const fallbackLocale = ref(settings.fallbackLocale);
    const messages = settings.production ? messagesRaw : prepareAllMessages(messagesRaw);

    const t = makeTranslator<T>(messages, {locale, fallbackLocale});

    return {...makePlugin(t, locale), t, locale};
}
