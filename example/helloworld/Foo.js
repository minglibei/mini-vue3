import { h, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
    name: 'Foo',
    setup(props) {
        // test1 能够接收props √
        console.log(props)
        // test2 不可修改内部属性值
        props.count = 2
        const instance = getCurrentInstance()
        console.log('Foo', instance)
    },
    render() {
        // test3 能够获取props中的值
        return h('div', {}, 'hi props:' + this.count)
    }
}
