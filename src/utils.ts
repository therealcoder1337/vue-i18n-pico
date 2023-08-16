export const msg = (...args: unknown[]) => ['vue-i18n-pico:', ...args].join(' ');
export const log = (...args: unknown[]) => console.log(msg(...args));
export const err = (...args: unknown[]) => new Error(msg(...args));
