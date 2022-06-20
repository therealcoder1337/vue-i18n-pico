import {err} from './utils.js';

const pattern = /@:[.a-z0-9]+/ig;

function walkMessages (messagesRaw, parentKeys = []) {
    const dependencies = {};
    const messages = {};

    Object.entries(messagesRaw).forEach(entry => {
        const [key, value] = entry;
        const fullKey = (parentKeys.length ? parentKeys.join('.') + '.' : '') + key;
        if (typeof value === 'string') {
            if (value.indexOf('@:') > -1) {
                const curDeps = value.match(pattern)?.map(entry => entry.slice(2, (entry.endsWith('.') ? -1 : undefined)));

                if (curDeps) {
                    dependencies[fullKey] = curDeps;
                    return;
                }
            }

            messages[key] = value;
        }

        if (typeof value === 'object' && value) {
            const results = walkMessages(value, [...parentKeys, key]);
            Object.assign(dependencies, results.dependencies);
            messages[key] = results.messages;
        }
    });

    return {dependencies, messages};
}

const clone = obj => JSON.parse(JSON.stringify(obj));

function resolveDependencies (dependencies, messages, messagesRaw) {
    const getRawMessage = key => key.split('.').reduce((carry, prop) => carry?.[prop] || '', messagesRaw);
    const getMessage = key => key.split('.').reduce((carry, prop) => carry?.[prop] || '', messages);
    const setMessage = (key, val) => key.split('.').reduce((carry, prop, idx, arr) => {
        if (idx === arr.length - 1) {
            carry[prop] = val;
            return null;
        }

        return carry[prop];
    }, messages);
    const hasMessage = key => key.split('.').reduce((carry, prop) => carry?.[prop] ?? false, messages) !== false;
    const dependenciesArrays = Object.values(dependencies);
    const dependenciesArraysOriginal = clone(dependenciesArrays);
    const entries = Object.entries(dependencies);
    const resolveDep = dep => dependenciesArrays.forEach((arr, idx) => {
        while (arr.indexOf(dep) > -1) {
            arr.splice(arr.indexOf(dep), 1);
        }

        if (!arr.length) {
            const [key] = entries[idx];
            let rawMsg = getRawMessage(key) || '';
            const curDeps = dependenciesArraysOriginal[idx];
            curDeps.forEach(depKey => rawMsg = rawMsg.replaceAll(`@:${depKey}`, getMessage(depKey)));
            setMessage(key, rawMsg);
        }
    });

    let firstPass = true;
    let didResolve = false;

    while (dependenciesArrays.some(arr => !!arr.length) && (firstPass || didResolve)) {
        firstPass = false;
        didResolve = false;

        entries.forEach(([fullKey, curDeps]) => {
            if (curDeps.includes(fullKey)) {
                throw err(`cannot resolve: self referencing message ${fullKey}`);
            }

            if (curDeps.some(dep => dependencies[dep]?.includes(fullKey))) {
                throw err(`cannot resolve: circular dependency of ${fullKey}`);
            }

            curDeps.forEach(dep => {
                if (hasMessage(dep)) {
                    resolveDep(dep);
                    didResolve = true;
                }
            });
        });
    }

    const keyWithErrors = dependenciesArrays.reduce((carry, arr, idx) => {
        if (arr.length) {
            carry.push(entries[idx][0]);
        }

        return carry;
    }, []);

    if (keyWithErrors.length) {
        throw err(`the following keys contain references that could not be resolved: "${keyWithErrors.join('", "')}"`);
    }
}

export function prepareMessages (messages) {
    const result = walkMessages(messages);
    resolveDependencies(result.dependencies, result.messages, messages);

    return result.messages;
}

export function prepareAllMessages (messagesRaw) {
    return Object.fromEntries(Object.entries(messagesRaw).map(([locale, messages]) => [locale, prepareMessages(messages)]));
}
