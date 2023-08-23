import {prepareMessages, prepareAllMessages} from '../src/prepare-messages.ts';
import {expect, describe, it} from 'vitest';


describe('prepareMessages', () => {
    it('should throw if there are non resolvable dependencies', () => {
        const messagesA = {
            a: '@:b',
            b: '@:a'
        };

        const messagesB = {
            a: '@:a'
        };

        const messagesC = {
            a: '@:b', b: '@:c', c: '@:a'
        };

        expect(() => prepareMessages(messagesA)).toThrowError(/circular/);
        expect(() => prepareMessages(messagesB)).toThrowError(/self referencing/);
        expect(() => prepareMessages(messagesC)).toThrowError(/could not be resolved/);
    });

    it('should resolve simple resolvable dependencies', () => {
        const messages = {
            a: '@:b',
            b: 'Hallo!'
        };

        expect(prepareMessages(messages)).toEqual({a: 'Hallo!', b: 'Hallo!'});
    });

    it('should resolve contained resolvable dependencies', () => {
        const messages = {
            a: 'Wie möchtest du @:b?',
            b: 'deinen @:c haben',
            c: 'Kaffee'
        };

        expect(prepareMessages(messages)).toEqual({
            a: 'Wie möchtest du deinen Kaffee haben?',
            b: 'deinen Kaffee haben',
            c: 'Kaffee'
        });
    });

    it('should resolve complex resolvable dependencies', () => {
        const messages = {
            a: 'Wie möchtest du @:b?',
            b: 'deinen @:deeper.coffee haben? Vielleicht mit "@:deeper.much, @:deeper.much" @:deeper.milk',
            c: 'Stell dir vor, der Satz endet mit einem message link, auf den ein Punkt @:d. Ob das klappt?',
            d: 'folgt',
            deeper: {
                coffee: 'Kaffee',
                much: 'viel',
                milk: 'Milch'
            }
        };

        expect(prepareMessages(messages)).toEqual({
            a: 'Wie möchtest du deinen Kaffee haben? Vielleicht mit "viel, viel" Milch?',
            b: 'deinen Kaffee haben? Vielleicht mit "viel, viel" Milch',
            c: 'Stell dir vor, der Satz endet mit einem message link, auf den ein Punkt folgt. Ob das klappt?',
            d: 'folgt',
            deeper: {
                coffee: 'Kaffee',
                much: 'viel',
                milk: 'Milch'
            }
        });
    });

    it('should fix a bug where nested linked messages were not correctly resolved', () => {
        const messages = {
            test: {
                cars: {
                    changeBlueCar: 'Change blue car',
                    blueCar: 'Blue car',
                    useBlueCar: 'Use @:test.cars.blueCar',
                    useBlueCarFirst: 'Please use @:test.cars.blueCar first',
                    otherBlueCar: 'Other @:test.cars.blueCar'
                }
            }
        };

        expect(prepareMessages(messages)).toEqual({
            test: {
                cars: {
                    changeBlueCar: 'Change blue car',
                    blueCar: 'Blue car',
                    useBlueCar: 'Use Blue car',
                    useBlueCarFirst: 'Please use Blue car first',
                    otherBlueCar: 'Other Blue car'
                }
            }
        });
    });

    it('should throw an error when some messages could not be processed', () => {
        const messagesA = {
            a: 'Wie möchtest du @:b?',
            b: 'deinen @:deeper.coffee haben? Vielleicht mit "@:deeper.much, @:deeper.much" @:deeper.milk',
            deeper: {
                test123abc: '@:a',
                much: 'viel',
                milk: 'Milch'
            }
        };

        expect(() => prepareMessages(messagesA)).toThrowError(/"a", "b", "deeper\.test123abc"/);
    });

    it('should not process linked messages with unsupported syntax', () => {
        const messages = {
            debugMe: 'This is „@:{\'a.unsupportedSyntax\'}“, and should „@:{\'not.beProcessed123\'}“ and instead just be returned. @:<other weirdness here>'
        };

        const results = prepareMessages(messages);
        expect(results.debugMe).toEqual('This is „@:{\'a.unsupportedSyntax\'}“, and should „@:{\'not.beProcessed123\'}“ and instead just be returned. @:<other weirdness here>');
    });
});

describe('prepareAllMessages', () => {
    it('should act as a wrapper for prepareMessages and not consider locale keys as part of the linked message path', () => {
        const messages = {
            'de-DE': {aTest: {nested: '@:aTest.nested2', nested2: 'abc'}},
            'en-US': {aTest: {nested: '@:aTest.nested3', nested2: 'abc', nested3: 'def'}}
        };

        const results = prepareAllMessages(messages);
        expect(results).toEqual({
            'de-DE': {aTest: {nested: 'abc', nested2: 'abc'}},
            'en-US': {aTest: {nested: 'def', nested2: 'abc', nested3: 'def'}}
        });
    });
});
