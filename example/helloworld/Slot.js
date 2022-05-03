import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Slot = {
    setup() {
        return {}
    },
    render() {
        console.log(this.$slots)
        // 具名插槽
        // 作用域插槽
        // 父组件获取到子组件内部的变量，渲染到插槽内
        const age = 18
        return h('p', {}, [
            renderSlots(this.$slots, 'header', { age }),
            h('p', {}, '123'),
            renderSlots(this.$slots, 'footer')])
    }
}