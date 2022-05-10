import { h, ref } from '../../lib/guide-mini-vue.esm.js'

// 左侧对比
const preChildren = [
    h('p', { key: "B" }, 'B'),
    h('p', { key: "C" }, 'C')
]
const nextChildren = [
    h('p', { key: "D" }, 'D'),
    h('p', { key: "E" }, 'E'),
    h('p', { key: "B" }, 'B'),
    h('p', { key: "C" }, 'C'),
]


// 右侧对比
// const preChildren = [
//     h('p', {key:"A"}, 'A'),
//     h('p', {key:"B"}, 'B'),
//     h('p', {key:"C"}, 'C')
// ]
// const nextChildren = [
//     h('p', {key:"D"}, 'D')，
//     h('p', {key:"E"}, 'E')，
//     h('p', {key:"B"}, 'B'),
//     h('p', {key:"C"}, 'C'),
// ]

export const Array2Array = {
    setup() {
        const ischange = ref(false)
        window.ischange = ischange
        return {
            ischange
        }

    },
    render() {
        return h('div', { id: 'root' }, this.ischange ? nextChildren : preChildren)
    }
}