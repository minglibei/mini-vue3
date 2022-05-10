import { h, ref } from '../../lib/guide-mini-vue.esm.js'

export const Text2Text = {
    setup() {
        const ischange = ref(false)
        window.ischange = ischange
        return {
            ischange
        }

    },
    render() {
        return h('div', { id: 'root' }, this.ischange ? 'newNode' : 'oldNode')
    }
}