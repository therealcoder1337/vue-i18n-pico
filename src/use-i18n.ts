import {inject} from 'vue';
import type {I18n} from './types.js';

export default function useI18n (): I18n {
    return inject('i18n')!;
}
