import { h } from '../../lib/guide-mini-vue.esm.js'

// 实现emit
// 编写测试代码
// 写组件逻辑
// 为组件添加emit属性 -> 初始化emit -> emit 将emit name进行解析，找到触发的函数-> 执行handler
// 支持传入多个参数，支持 add-foo 形式命名
export const Emit = {
    setup(props, { emit }) {
        const onChange = () => {
            console.log('onChange')
            emit('add', 1, 2)
            emit('add-foo')
        }
        return {
            onChange
        }
    },
    render() {
        // h : el props child
        return h('div', {
            onClick: this.onChange
        }, "click btn")
    }
}