import { h, ref } from '../../lib/guide-mini-vue.esm.js'
export const App = {
    setup() {
        const count = ref(0)
        const props = ref({
            foo: "foo",
            bar: "bar"
        })
        const onClick = () => {
            console.log('onclick')
            count.value++
        }
        const onChangeFooVal = () => {
            props.value.foo = 'new-foo'
        }
        const onChangeFooValEmpty = () => {
            props.value.foo = null
        }
        const onDelBarProp = () => {
            props.value = {
                foo: "foo"
            }
        }
        return {
            count,
            onClick,
            props,
            onChangeFooVal,
            onChangeFooValEmpty,
            onDelBarProp
        }
    },
    render() {
        return h('div', { id: "root", ...this.props }, [
            h('div', {}, 'count:' + this.count),
            h('button', {
                onClick: this.onClick
            }, 'click'),
            h('button', {
                onClick: this.onChangeFooVal
            }, 'onChangeFooVal'),
            h('button', {
                onClick: this.onChangeFooValEmpty
            }, 'onChangeFooValEmpty'),
            h('button', {
                onClick: this.onDelBarProp
            }, 'onDelBarProp')
        ])
    }
}