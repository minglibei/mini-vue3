
import { h } from '../../lib/guide-mini-vue.esm.js'
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
            // h(Foo, { count: 1 }),
            // h(Emit, {
            //     onAdd: (a, b) => {
            //         console.log('app onadd', a, b)
            //     },
            //     onAddFoo: () => {
            //         console.log('app onAddFoo')
            //     }
            // }),
            h('div', {}, '0'),
            h(Slot, {}, h('p', {}, '123'))
        ])
    },
    setup() {
        return {
            msg: 'mini-vue-hh'
        }
    }

}