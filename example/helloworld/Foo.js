import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
    setup(props) {
        // test1 能够接收props √
        console.log(props)
        // test2 不可修改内部属性值
        props.count = 2
    },
    render() {
        // test3 能够获取props中的值
        return h('div', {}, 'hi props:' + this.count)
    }
}
