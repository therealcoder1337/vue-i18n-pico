import type {Messages, MessagesArray, MessagesObject, MessagesValue} from './types.js';
import {err} from './utils.js';

const pattern = /@:[.a-z0-9]+/ig;

type MessageDependencies = {
    [name: string]: string[];
};

function walkMessages (messagesRaw: MessagesObject | MessagesArray, parentKeys: string[] = []) {
    const dependencies: MessageDependencies = {};
    const messages: MessagesObject = {};

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

const clone = (obj: unknown) => JSON.parse(JSON.stringify(obj));

function resolveDependencies (dependencies: MessageDependencies, messages: MessagesObject, messagesRaw: MessagesObject) {
    type CarryResult = MessagesValue;

    const getRawMessage = (key: string) => key.split('.').reduce((carry, prop) =>
        (carry as MessagesObject)?.[prop] || '', messagesRaw as CarryResult);

    const getMessage = (key: string) => key.split('.').reduce((carry, prop) =>
        (carry as MessagesObject)?.[prop] || '', messages as CarryResult);

    const setMessage = (key: string, val: MessagesValue) => key.split('.').reduce((carry, prop, idx, arr) => {
        if (idx === arr.length - 1) {
            (carry as MessagesObject)[prop] = val;
            return null;
        }

        return (carry as MessagesObject)[prop];
    }, messages as CarryResult | null);

    const hasMessage = (key: string) => key.split('.').reduce((carry, prop) => (carry as MessagesObject)?.[prop] ?? false, (messages as CarryResult | boolean)) !== false;
    const dependenciesArrays = Object.values(dependencies);
    const dependenciesArraysOriginal = clone(dependenciesArrays) as typeof dependenciesArrays;
    const entries = Object.entries(dependencies);
    const resolveDep = (dep: string) => dependenciesArrays.forEach((arr, idx) => {
        while (arr.indexOf(dep) > -1) {
            arr.splice(arr.indexOf(dep), 1);
        }

        if (!arr.length) {
            const [key] = entries[idx];
            let rawMsg = getRawMessage(key) || '';
            const curDeps = dependenciesArraysOriginal[idx];
            curDeps.forEach(depKey => rawMsg = (rawMsg as string).replaceAll(`@:${depKey}`, getMessage(depKey).toString()));
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

export function prepareMessages<T extends MessagesObject> (messages: T): T {
    const result = walkMessages(messages);
    resolveDependencies(result.dependencies, result.messages, messages);

    return result.messages as T;
}

export function prepareAllMessages <T extends MessagesObject> (messagesRaw: Messages<T>): Messages<T> {
    return Object.fromEntries(Object.entries(messagesRaw).map(([locale, messages]) => [locale, prepareMessages(messages)]));
}
