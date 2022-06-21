# vue-i18n-pico

[![Vue.js 3](https://img.shields.io/badge/Vue.js-3-brightgreen)](https://vuejs.org/)
[![GitHub license](https://img.shields.io/github/license/therealcoder1337/vue-i18n-pico)](https://github.com/therealcoder1337/vue-i18n-pico/blob/master/LICENSE.md)
[![codecov](https://codecov.io/gh/therealcoder1337/vue-i18n-pico/branch/master/graph/badge.svg?token=Cm6EOTXH2q)](https://codecov.io/gh/therealcoder1337/vue-i18n-pico)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](/package.json)
[![Known Vulnerabilities](https://snyk.io/test/github/therealcoder1337/vue-i18n-pico/badge.svg)](https://snyk.io/test/github/therealcoder1337/vue-i18n-pico)

Easy, small & fast i18n for Vue! While `vue-i18n` uses thousands of lines of code, this one just uses ~200 lines of source code at the time of writing (excluding tests and types). It does so by providing a smaller API, containing only some essential features.

## Features & advantages

### Easy migration coming from vue-i18n

When just using features available here, the migration is quite easy. `vue-i18n-pico` also exports a `useI18n` that returns `{t, locale}` and we also create the vue plugin using `createI18n` which takes parameters similar to `vue-i18n`. In your Vue template you just continue using `$t('your.translation.key')` as usual.

### Linked messages

Linked messages allow reusing translations. They start with `@:` and then only support `A-Z`, `0-9` and `.` characters. Example: `Some translation string with @:animals.littleCats!` would be interpreted as `Some translation string with kittens!`, if the value for key `animals.littleCats` equals `kittens`.
Note that we don't support some special syntaxes of `vue-i18n`, which means that what e.g. would have been `„@:{\'someOtherLinkedMessage\'}“` (linked message inside German quotation marks) in `vue-i18n` must now be written as `„@:someOtherLinkedMessage“`.

### Message interpolation

#### Named interpolation

`thisTranslation: 'This translation has {animals1} and {animals2}!'`. With code `t('thisTranslation', {animals1: 'cats', animals2: 'doggos'})` this evaluates to `This translation has cats and doggos!`.

#### List interpolation

`thisTranslation: 'This translation has {0} and {1}!'`. With code `t('thisTranslation', ['cats', 'doggos'])` this evaluates to `This translation has cats and doggos!`.

#### Array values

Your translations can have array values and those may even contain nested objects. Example: `{arr: [3, {nested: 'red'}]}` would allow accessing `arr.1.nested` and return `red` or `arr.0` and return `3`.

### Attention to performance

This package prefers string functions over regular expressions whenever reasonable; in fact there is only a single regex used currently - and that can be limited to development mode only (see next section).

### Optimize your translation files for build

When `production` is set to `false` (default setting), linked messages get resolved during runtime. But when it is set to `true`, it is up to you to provide already prepared message files, where the message links have been resolved. This can be done with help of the function `prepareAllMessages` to process your `messages` object, e.g. in a build script. But note that you would need to create new message source files and link them in your source code for the build, so this would currently involve some manual work on your side.

### No dependencies

We have zero `dependencies` in `package.json`, only a few `devDependencies` are required for testing and code checking (eslint).

## Getting started

```js
import {createI18n} from 'vue-i18n-pico';
import messages from 'src/i18n'; // e.g. object of shape {'en-US': {...}, 'de-DE': {...}}

const i18n = createI18n({
    locale: 'de-DE', // example: German (DE) as preferred locale
    fallbackLocale: 'en-US', // example: English (US) as fallback locale
    messages,
    production: false // ensures linked messages are processed
});

app.use(i18n);
```

Notes:

* `locale` defaults to `en-US`
* `fallbackLocale` is optional and doesn't need to be set at all
* `production` is also optional and defaults to `false` (only change when you have preprocessed your linked messages)

## Limitations

Currently only aiming to support Vue 3 (CLI). Vue 2 will not be supported.

## Disclaimer

This is a private project that is not in any way affiliated with Vue.js or vue-i18n.

## Contributing

For bugfixes: Feel free to open a PR. Include a test if possible.

For anything else: Please create an Issue first to discuss if the feature is needed/wanted.

Always: Ensure appropriate coding style (`npm run fix`) and passing tests (`npm run test`) before committing.
