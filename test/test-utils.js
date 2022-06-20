import {log, msg, err} from '../src/utils.js';

describe('utils', () => {
    describe('log', () => {
        it('should log with prefix', () => {
            const originalLog = console.log;
            const logged = [];

            console.log = (...args) => logged.push(...args);

            log('hey', 'ho', 'test123', 4);

            console.log = originalLog;

            logged.should.eql(['vue-i18n-pico: hey ho test123 4']);
        });
    });

    describe('msg', () => {
        it('should create a string with prefix', () => {
            const result = msg('this', 'is some', 'test', 777);

            result.should.eql('vue-i18n-pico: this is some test 777');
        });
    });

    describe('err', () => {
        it('should create an error object with prefix', () => {
            const obj = err('some error', 'to be thrown', 333);

            (obj instanceof Error).should.eql(true);

            obj.message.should.eql('vue-i18n-pico: some error to be thrown 333');

            (() => {
                throw obj;
            }).should.throwError(/vue-i18n-pico: some error to be thrown 333/);
        });
    });
});
