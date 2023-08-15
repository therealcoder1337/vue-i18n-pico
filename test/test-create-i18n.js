import createI18n from '../src/create-i18n.js';

const messages= {
    'en-US': {
        hello: 'Hello!'
    }
};

describe('create-i18n', () => {
    it('should throw if "messages" are missing', () => {
        (() => createI18n()).should.throwError(/messages/);
    });

    it('should throw for invalid "production" value', () => {
        (() => createI18n({messages, production: 1})).should.throwError(/production/);
        (() => createI18n({messages, production: null})).should.throwError(/production/);
    });

    it('should return a plugin with i18n props', () => {
        const i18n = createI18n({messages});
        const keys = Object.keys(i18n);

        keys.length.should.eql(3);
        keys.should.containEql('install');
        keys.should.containEql('t');
        keys.should.containEql('locale');

        (typeof i18n.install).should.eql('function');
        (typeof i18n.t).should.eql('function');
        (typeof i18n.locale).should.eql('object');

        i18n.t('hello').should.eql('Hello!');
        i18n.locale.value.should.eql('en-US');
    });
});
