import makeTranslator from '../src/make-translator.js';
import deDe from './fixtures/de-DE.js';
import enUs from './fixtures/en-US.js';
import {expect, describe, it} from 'vitest';
import {ref} from 'vue';
import type {TranslatePlugin} from '../src/types.js';

const messages = {['de-DE']: deDe, ['en-US']: enUs};


describe('make-translator', () => {
    describe('t', () => {
        it('should correctly translate for the provided locale', () => {
            const locale = ref('de-DE');
            const t = makeTranslator(messages, {locale});

            expect(t('coolTranslation')).toEqual('Tolle Übersetzung!');
            expect(t('nested.deep.deeper.car')).toEqual('Auto');
            expect(t('nested.deep.translateThis', ['testparam1', 'den anderen Parameter'])).toEqual('Übersetze dies, denn es hat nicht nur testparam1, sondern auch den anderen Parameter!');
            expect(t('nested.deep.translateThis', ['A', 'B'])).toEqual('Übersetze dies, denn es hat nicht nur A, sondern auch B!');
            locale.value = 'en-US';
            expect(t('coolTranslation')).toEqual('Cool translation!');
            expect(t('nested.deep.deeper.car')).toEqual('Car');
            expect(t('nested.deep.translateThis', ['testparam1', 'another parameter'])).toEqual('Translate this, since it not only has testparam1, but also another parameter!');
            expect(t('nested.deep.translateThis', ['A', 'B'])).toEqual('Translate this, since it not only has A, but also B!');
        });

        it('should support named interpolation', () => {
            const locale = ref('de-DE');
            const t = makeTranslator(messages, {locale});

            expect(t('nested.deep.namedInterp', {
                coolParam: 'Hey 123',
                otherParam123: 'Wie geht\'s?'
            })).toEqual('Hey 123, das ist ein Beispiel. Wie geht\'s?');
            expect(t('nested.deep.namedInterpMultiple', {
                userName: 'Mista.cat@new',
                2: 'wieder'
            })).toEqual('An Mista.cat@new: Herzlich willkommen, „Mista.cat@new“! Hier sind noch einige Dinge, die wir wieder und wieder durchexerzieren werden, bis du sie verinnerlicht hast. ;)');

            locale.value = 'en-US';

            expect(t('nested.deep.namedInterp', {
                coolParam: 'Hey 123',
                otherParam123: 'How are you doing?'
            })).toEqual('Hey 123, this is an example. How are you doing?');
            expect(t('nested.deep.namedInterpMultiple', {
                userName: 'Mista.cat@new',
                2: 'again'
            })).toEqual('At Mista.cat@new: Welcome, "Mista.cat@new"! Here are a few things we will be practising again and again, until you get the hang of them. ;)');
        });

        it('should support list interpolation', () => {
            const locale = ref('de-DE');
            const t = makeTranslator(messages, {locale});

            expect(t('nested.deep.listInterp', [1, 2, 3])).toEqual('Teste nur die List interpolation, sie beginnt mit 1. Die Parameter lauten 1, 2 und 3.');
            expect(t('nested.deep.listInterp', ['cat', 'dog', 'birb'])).toEqual('Teste nur die List interpolation, sie beginnt mit cat. Die Parameter lauten cat, dog und birb.');

            locale.value = 'en-US';

            expect(t('nested.deep.listInterp', [1, 2, 3])).toEqual('Just testing list interpolation, it begins with 1. The parameters are 1, 2 and 3.');
            expect(t('nested.deep.listInterp', ['cat', 'dog', 'birb'])).toEqual('Just testing list interpolation, it begins with cat. The parameters are cat, dog and birb.');
        });

        it('should revert to fallbackLocale if no translation was found', () => {
            const locale = ref('de-DE');
            const fallbackLocale = ref('en-US');
            const t = makeTranslator(messages, {locale, fallbackLocale});
            expect(t('onlyInEnglish')).toEqual('This translation exists only for locale en-US');
        });

        it('should revert to fallbackLocale if selected locale does not exist', () => {
            const locale = ref('de-CH');
            const fallbackLocale = ref('en-US');
            const t = makeTranslator(messages, {locale, fallbackLocale});
            expect(t('onlyInEnglish')).toEqual('This translation exists only for locale en-US');
        });

        it('should return the key for non existing translation', () => {
            const locale = ref('de-DE');
            const t = makeTranslator(messages, {locale});
            expect(t('some.translation.doesNotExist')).toEqual('some.translation.doesNotExist');
            locale.value = 'es-ES';
            expect(t('some.translation.doesNotExist')).toEqual('some.translation.doesNotExist');
        });

        it('should also return the key for non-existing locale and missing fallback translation entry', () => {
            const locale = ref('en-AU');
            const fallbackLocale = ref('en-US');
            const t = makeTranslator(messages, {locale, fallbackLocale});

            expect(t('some.translation.doesNotExist')).toEqual('some.translation.doesNotExist');
        });

        it('should correctly return empty string translation values', () => {
            const locale = ref('de-DE');
            const fallbackLocale = ref('en-US');
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

            expect(t('some.deep.emptyStr')).toEqual('');
            expect(t('emptyStr2')).toEqual('');
            expect(t('some.fallbackEmptyStr')).toEqual('');
            expect(t('fallbackEmptyStr2')).toEqual('');
        });

        it('should return string "[object Object]" if the key points to an object (i.e.: is not deep enough)', () => {
            const locale = ref('de-DE');
            const fallbackLocale = ref('en-US');
            const t = makeTranslator(messages, {locale, fallbackLocale});

            expect((typeof t('nested.deep.deeper'))).toEqual('string');
            expect(t('nested.deep.deeper')).toEqual('[object Object]');
        });

        it('should work with array values and nested array values', () => {
            const locale = ref('de-DE');
            const fallbackLocale = ref('en-US');
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

            expect(t('arr.0')).toEqual('eins');
            expect(t('arr.1')).toEqual('zwei');
            expect(t('arr.2')).toEqual('drei');
            expect(t('arr.3.nested.0')).toEqual('1');
            expect(t('arr.3.nested.1')).toEqual('vier');
            expect(t('arr.4')).toEqual('fünf');
            expect(t('arr.5.0')).toEqual('ipa');
            expect(t('deep.another.0')).toEqual('11');
            expect(t('arr2.0')).toEqual('one');
            expect(t('arr2.1')).toEqual('two');
            expect(t('arr2.2')).toEqual('three');
            expect(t('arr2.3.nested.0')).toEqual('3');
            expect(t('arr2.3.nested.1')).toEqual('four');
            expect(t('arr2.4')).toEqual('five');
            expect(t('arr2.5.0')).toEqual('ipa');
            expect(t('arr')).toEqual('eins,zwei,drei,[object Object],fünf,ipa');
            expect(t('arr2')).toEqual('one,two,three,[object Object],five,ipa');
        });

        it('should allow overriding the locale via locale option', () => {
            const locale = ref('de-DE');
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

            expect(t('thisIsAMessage', null, {locale: 'en-US'})).toEqual('This is a message');
            expect(t('showMore', null, {locale: 'en-US'})).toEqual('showMore');
        });
    });

    describe('plugins', () => {
        it('should be invoked with the correct arguments', () => {
            type MessageSchema = typeof messages['de-DE'] | typeof messages['en-US'];

            const locale = ref('de-DE');
            const spyPlugin: TranslatePlugin<MessageSchema> = (args) => {
                expect(args.name).toEqual('nested.deep.translateThis');
                expect(args.fallbackLocale).toBeUndefined();
                expect(args.fallbackTranslations).toBeNull();
                expect(args.locale.value).toBe('de-DE');
                expect(args.translations.nested.deep.translateThis).toContain('Übersetze');
                expect(args.messages['de-DE'].nested.deep.translateThis).toContain('Übersetze');
                expect(args.messages['en-US'].nested.deep.translateThis).toContain('Translate');
                expect(args.raw).toEqual('Übersetze dies, denn es hat nicht nur {0}, sondern auch {1}!');
                expect(args.result).toEqual('Übersetze dies, denn es hat nicht nur Katzen, sondern auch Capybaras!');
                expect(args.params).toEqual(['Katzen', 'Capybaras']);
            };

            const t = makeTranslator<MessageSchema>(messages, {locale, plugins: [spyPlugin]});

            expect(t('nested.deep.translateThis', ['Katzen', 'Capybaras'])).toEqual('Übersetze dies, denn es hat nicht nur Katzen, sondern auch Capybaras!');
        });

        it('should only replace the translation when "intercept" is truthy', () => {
            const locale = ref('de-DE');
            const nonInterceptingPlugin = () => 'test from non intercepting plugin';
            const interceptingPlugin = () => 'test from intercepting plugin';
            interceptingPlugin.intercept = true;

            const t1 = makeTranslator(messages, {locale, plugins: [nonInterceptingPlugin]});
            const t2 = makeTranslator(messages, {locale, plugins: [interceptingPlugin]});

            expect(t1('nested.deep.translateThis', ['Katzen', 'Capybaras'])).toEqual('Übersetze dies, denn es hat nicht nur Katzen, sondern auch Capybaras!');
            expect(t2('nested.deep.translateThis', ['Katzen', 'Capybaras'])).toEqual('test from intercepting plugin');
        });

        it('should return the result of the last intercepting plugin', () => {
            const locale = ref('de-DE');
            const interceptingPlugin1 = () => 'test from first plugin';
            const interceptingPlugin2 = () => 'test from second plugin';
            const interceptingPlugin3 = () => 'test from third plugin';
            interceptingPlugin1.intercept = true;
            interceptingPlugin2.intercept = true;
            interceptingPlugin3.intercept = true;

            const t = makeTranslator(messages, {locale, plugins: [interceptingPlugin1, interceptingPlugin2, interceptingPlugin3]});

            expect(t('nested.deep.translateThis', ['Katzen', 'Capybaras'])).toEqual('test from third plugin');
        });
    });
});
