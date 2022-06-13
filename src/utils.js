export const msg = (...args) => ['vue-i18n-pico:', ...args].join(' ');
export const log = (...args) => console.log(msg(...args));
export const err = (...args) => new Error(msg(...args));
