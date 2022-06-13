export default (t, locale) => {
    return {
        install (app) {
            app.config.globalProperties.$t = t;

            app.provide('i18n', {t, locale});
        }
    };
};
