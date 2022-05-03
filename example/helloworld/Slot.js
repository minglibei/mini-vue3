import { h } from '../../lib/guide-mini-vue.esm.js'

export const Slot = {
    setup() {
        return {}
    },
    render() {
        return h('p', {}, ['Slot Component', this.$slots])
    }
}