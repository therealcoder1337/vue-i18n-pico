import {log, msg, err} from '../src/utils.js';
import {expect, describe, it} from 'vitest';


describe('utils', () => {
    describe('log', () => {
        it('should log with prefix', () => {
            const originalLog = console.log;
            const logged: string[] = [];

            console.log = (...args) => logged.push(...args);

            log('hey', 'ho', 'test123', 4);

            console.log = originalLog;

            expect(logged).toEqual(['vue-i18n-pico: hey ho test123 4']);
        });
    });

    describe('msg', () => {
        it('should create a string with prefix', () => {
            const result = msg('this', 'is some', 'test', 777);

            expect(result).toEqual('vue-i18n-pico: this is some test 777');
        });
    });

    describe('err', () => {
        it('should create an error object with prefix', () => {
            const obj = err('some error', 'to be thrown', 333);

            expect((obj instanceof Error)).toEqual(true);

            expect(obj.message).toEqual('vue-i18n-pico: some error to be thrown 333');

            expect(() => {
                throw obj;
            }).toThrowError(/vue-i18n-pico: some error to be thrown 333/);
        });
    });
});
