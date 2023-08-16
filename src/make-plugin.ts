import type {App, Ref} from 'vue';
import type {Plugin, Translate} from './types.js';

export default (t: Translate, locale: Ref<string>): Plugin => {
    return {
        install (app: App) {
            app.config.globalProperties.$t = t;

            app.provide('i18n', {t, locale});
        }
    };
};
