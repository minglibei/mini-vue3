import { h, ref } from '../../lib/guide-mini-vue.esm.js'
import Child from './Child.js'

export const App = {
    name: 'App',
    setup() {
        const msg = ref('123')
        const count = ref(1)

        window.msg = msg

        const changChildProps = () => {
            msg.value = '465'
        }

        const changeCount = () => {
            count.value = 2
        }

        return { msg, count, changChildProps, changeCount }

    },
    render() {
        return h("div", {}, [
            h('div', {}, '你好'),
            h("button", {
                onClick: this.changChildProps
            }, "change child props"),
            h(Child, {
                msg: this.msg
            }),
            h('button', {
                onClick: this.changeCount
            }, "change self count"),
            h('p', {}, "count: " + this.count)
        ])
    }
}