
import { h, createTextVNode } from '../../lib/guide-mini-vue.esm.js'
// import { Foo } from './Foo.js'
// import { Emit } from './Emit.js'
import { Slot } from './Slot.js'

window.self = null
export const App = {
    name: 'App',
    render() {
        window.self = this
        return h('div', {
            id: "root",
            class: "parent",
            onClick: () => {
                console.log('click')
            },
            onMousedown: () => {
                console.log("mouseDown")
            },
            onAdd(a, b) {
                console.log('app onAdd', a, b)
            }
        }, [
            h('p', {}, 'parent'),
            h(Slot, {}, {
                header: ({ age }) => [h('p', {}, 'header' + age), createTextVNode('你好')],
                footer: () => h('p', {}, 'footer')
            })
        ])
    },
    setup() {
        return {
            msg: 'mini-vue-hh'
        }
    }

}