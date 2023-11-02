import {inject} from 'vue';
import type {I18n, MessagesObject} from './types.js';

export default function useI18n<T extends MessagesObject = MessagesObject> (): I18n<T> {
    return inject('i18n')!;
}
