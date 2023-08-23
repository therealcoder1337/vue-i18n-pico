import createI18n from '../src/create-i18n.ts';
import {expect, describe, it} from 'vitest';

const messages = {
    'en-US': {
        hello: 'Hello!'
    }
};

describe('create-i18n', () => {
    it('should throw if "messages" are missing', () => {
        expect(() => createI18n()).toThrowError(/messages/);
    });

    it('should throw for invalid "production" value', () => {
        expect(() => createI18n({messages, production: 1})).toThrowError(/production/);
        expect(() => createI18n({messages, production: null})).toThrowError(/production/);
    });

    it('should return a plugin with i18n props', () => {
        const i18n = createI18n({messages});
        const keys = Object.keys(i18n);

        expect(keys.length).toEqual(3);
        expect(keys).toEqual(['install', 't', 'locale']);

        expect(typeof i18n.install).toEqual('function');
        expect(typeof i18n.t).toEqual('function');
        expect(typeof i18n.locale).toEqual('object');

        expect(i18n.t('hello')).toEqual('Hello!');
        expect(i18n.locale.value).toEqual('en-US');
    });
});
