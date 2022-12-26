import makeTranslator from '../src/make-translator.js';
import deDe from './fixtures/de-DE.js';
import enUs from './fixtures/en-US.js';
const messages = {['de-DE']: deDe, ['en-US']: enUs};

describe('make-translator', () => {
    describe('t', () => {
        it('should correctly translate for the provided locale', () => {
            const locale = {value: 'de-DE'};
            const t = makeTranslator(messages, {locale});

            t('coolTranslation').should.eql('Tolle Übersetzung!');
            t('nested.deep.deeper.car').should.eql('Auto');
            t('nested.deep.translateThis', ['testparam1', 'den anderen Parameter']).should.eql('Übersetze dies, denn es hat nicht nur testparam1, sondern auch den anderen Parameter!');
            t('nested.deep.translateThis', ['A', 'B']).should.eql('Übersetze dies, denn es hat nicht nur A, sondern auch B!');
            locale.value = 'en-US';
            t('coolTranslation').should.eql('Cool translation!');
            t('nested.deep.deeper.car').should.eql('Car');
            t('nested.deep.translateThis', ['testparam1', 'another parameter']).should.eql('Translate this, since it not only has testparam1, but also another parameter!');
            t('nested.deep.translateThis', ['A', 'B']).should.eql('Translate this, since it not only has A, but also B!');
        });

        it('should support named interpolation', () => {
            const locale = {value: 'de-DE'};
            const t = makeTranslator(messages, {locale});

            t('nested.deep.namedInterp', {coolParam: 'Hey 123', otherParam123: 'Wie geht\'s?'}).should.eql('Hey 123, das ist ein Beispiel. Wie geht\'s?');
            t('nested.deep.namedInterpMultiple', {userName: 'Mista.cat@new', 2: 'wieder'}).should.eql('An Mista.cat@new: Herzlich willkommen, „Mista.cat@new“! Hier sind noch einige Dinge, die wir wieder und wieder durchexerzieren werden, bis du sie verinnerlicht hast. ;)');

            locale.value = 'en-US';

            t('nested.deep.namedInterp', {coolParam: 'Hey 123', otherParam123: 'How are you doing?'}).should.eql('Hey 123, this is an example. How are you doing?');
            t('nested.deep.namedInterpMultiple', {userName: 'Mista.cat@new', 2: 'again'}).should.eql('At Mista.cat@new: Welcome, "Mista.cat@new"! Here are a few things we will be practising again and again, until you get the hang of them. ;)');
        });

        it('should support list interpolation', () => {
            const locale = {value: 'de-DE'};
            const t = makeTranslator(messages, {locale});

            t('nested.deep.listInterp', [1, 2, 3]).should.eql('Teste nur die List interpolation, sie beginnt mit 1. Die Parameter lauten 1, 2 und 3.');
            t('nested.deep.listInterp', ['cat', 'dog', 'birb']).should.eql('Teste nur die List interpolation, sie beginnt mit cat. Die Parameter lauten cat, dog und birb.');

            locale.value = 'en-US';

            t('nested.deep.listInterp', [1, 2, 3]).should.eql('Just testing list interpolation, it begins with 1. The parameters are 1, 2 and 3.');
            t('nested.deep.listInterp', ['cat', 'dog', 'birb']).should.eql('Just testing list interpolation, it begins with cat. The parameters are cat, dog and birb.');
        });

        it('should revert to fallbackLocale if no translation was found', () => {
            const locale = {value: 'de-DE'};
            const fallbackLocale = {value: 'en-US'};
            const t = makeTranslator(messages, {locale, fallbackLocale});
            t('onlyInEnglish').should.eql('This translation exists only for locale en-US');
        });

        it('should revert to fallbackLocale if selected locale does not exist', () => {
            const locale = {value: 'de-CH'};
            const fallbackLocale = {value: 'en-US'};
            const t = makeTranslator(messages, {locale, fallbackLocale});
            t('onlyInEnglish').should.eql('This translation exists only for locale en-US');
        });

        it('should return the key for non existing translation', () => {
            const locale = {value: 'de-DE'};
            const t = makeTranslator(messages, {locale});
            t('some.translation.doesNotExist').should.eql('some.translation.doesNotExist');
            locale.value = 'es-ES';
            t('some.translation.doesNotExist').should.eql('some.translation.doesNotExist');
        });

        it('should also return the key for non-existing locale and missing fallback translation entry', () => {
            const locale = {value: 'en-AU'};
            const fallbackLocale = {value: 'en-US'};
            const t = makeTranslator(messages, {locale, fallbackLocale});

            t('some.translation.doesNotExist').should.eql('some.translation.doesNotExist');
        });

        it('should correctly return empty string translation values', () => {
            const locale = {value: 'de-DE'};
            const fallbackLocale = {value: 'en-US'};
            const messages = {
                'de-DE': {
                    some: {
                        deep: {
                            emptyStr: ''
                        }
                    },
                    emptyStr2: ''
                },
                'en-US': {
                    some: {
                        fallbackEmptyStr: ''
                    },
                    fallbackEmptyStr2: ''
                }
            };
            const t = makeTranslator(messages, {locale, fallbackLocale});

            t('some.deep.emptyStr').should.eql('');
            t('emptyStr2').should.eql('');
            t('some.fallbackEmptyStr').should.eql('');
            t('fallbackEmptyStr2').should.eql('');
        });

        it('should return string "[object Object]" if the key points to an object (i.e.: is not deep enough)', () => {
            const locale = {value: 'de-DE'};
            const fallbackLocale = {value: 'en-US'};
            const t = makeTranslator(messages, {locale, fallbackLocale});

            (typeof t('nested.deep.deeper')).should.eql('string');
            t('nested.deep.deeper').should.eql('[object Object]');
        });

        it('should work with array values and nested array values', () => {
            const locale = {value: 'de-DE'};
            const fallbackLocale = {value: 'en-US'};
            const messages = {
                'de-DE': {
                    arr: ['eins', 'zwei', 'drei', {nested: [1, 'vier']}, 'fünf', ['ipa']],
                    deep: {another: [11]}
                },
                'en-US': {
                    arr2: ['one', 'two', 'three', {nested: [3, 'four']}, 'five', ['ipa']]
                }
            };
            const t = makeTranslator(messages, {locale, fallbackLocale});

            t('arr.0').should.eql('eins');
            t('arr.1').should.eql('zwei');
            t('arr.2').should.eql('drei');
            t('arr.3.nested.0').should.eql('1');
            t('arr.3.nested.1').should.eql('vier');
            t('arr.4').should.eql('fünf');
            t('arr.5.0').should.eql('ipa');
            t('deep.another.0').should.eql('11');
            t('arr2.0').should.eql('one');
            t('arr2.1').should.eql('two');
            t('arr2.2').should.eql('three');
            t('arr2.3.nested.0').should.eql('3');
            t('arr2.3.nested.1').should.eql('four');
            t('arr2.4').should.eql('five');
            t('arr2.5.0').should.eql('ipa');
            t('arr').should.eql('eins,zwei,drei,[object Object],fünf,ipa');
            t('arr2').should.eql('one,two,three,[object Object],five,ipa');
        });

        it('should allow overriding the locale via locale option', () => {
            const locale = {value: 'de-DE'};
            const messages = {
                'de-DE': {
                    thisIsAMessage: 'Das ist eine Nachricht',
                    showMore: 'Zeige mehr'
                },
                'en-US': {
                    thisIsAMessage: 'This is a message'
                }
            };
            const t = makeTranslator(messages, {locale});

            t('thisIsAMessage', null, {locale: 'en-US'}).should.eql('This is a message');
            t('showMore', null, {locale: 'en-US'}).should.eql('showMore');
        });
    });
});
