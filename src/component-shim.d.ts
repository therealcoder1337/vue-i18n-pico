import type {I18n} from 'vue-i18n-pico';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: I18n['t'];
    }
}
