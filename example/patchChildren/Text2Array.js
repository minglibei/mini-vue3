import { h, ref } from '../../lib/guide-mini-vue.esm.js'

export const Text2Array = {
    setup() {
        const ischange = ref(false)
        window.ischange = ischange
        return {
            ischange
        }

    },
    render() {
        return h('div', { id: 'root' }, this.ischange ? [
            h('p', {}, 'A'),
            h('p', {}, 'B'),
            h('p', {}, 'C')
        ] : 'oldNode')
    }
}