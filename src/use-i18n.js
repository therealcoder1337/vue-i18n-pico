import {inject} from 'vue';

export default function useI18n () {
    return inject('i18n');
}
