import {prepareMessages} from '../src/prepare-messages.js';

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

        (() => prepareMessages(messagesA)).should.throwError(/circular/);
        (() => prepareMessages(messagesB)).should.throwError(/self referencing/);
        (() => prepareMessages(messagesC)).should.throwError(/could not be resolved/);
    });

    it('should resolve simple resolvable dependencies', () => {
        const messages = {
            a: '@:b',
            b: 'Hallo!'
        };

        prepareMessages(messages).should.deepEqual({a: 'Hallo!', b: 'Hallo!'});
    });

    it('should resolve contained resolvable dependencies', () => {
        const messages = {
            a: 'Wie möchtest du @:b?',
            b: 'deinen @:c haben',
            c: 'Kaffee'
        };

        prepareMessages(messages).should.deepEqual({a: 'Wie möchtest du deinen Kaffee haben?', b: 'deinen Kaffee haben', c: 'Kaffee'});
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

        prepareMessages(messages).should.deepEqual({
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

        prepareMessages(messages).should.deepEqual({
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

        (() => prepareMessages(messagesA)).should.throwError(/"a", "b", "deeper\.test123abc"/);
    });

    it('should not process linked messages with unsupported syntax', () => {
        const messages = {
            debugMe: 'This is „@:{\'a.unsupportedSyntax\'}“, and should „@:{\'not.beProcessed123\'}“ and instead just be returned. @:<other weirdness here>'
        };

        const results = prepareMessages(messages);
        results.debugMe.should.eql('This is „@:{\'a.unsupportedSyntax\'}“, and should „@:{\'not.beProcessed123\'}“ and instead just be returned. @:<other weirdness here>');
    });
});
