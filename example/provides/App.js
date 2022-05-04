import { h, provide, inject, createApp } from '../../lib/guide-mini-vue.esm.js'

export const App = {
    name: 'app',
    setup() {
        provide('app', 'APP-value')
        provide('parentname', 'app')
    },
    render() {
        return h(Child)
    }

}

const Child = {
    name: 'child',
    setup() {
        provide('child', 'child')
        const name = inject('parentname')
        const name1 = inject('ass', 'default name')
        return { name, name1 }
    },
    render() {
        return h('Fragment', {}, [h('p', {}, 'child:' + this.name1 + ';' + this.name), h(Child1)])
    }

}

const Child1 = {
    name: 'child1',
    setup() {
        const child = inject('child')
        const name = inject('parentname')
        return { child, name }
    },
    render() {
        return h('div', {}, `\n${this.child};  ${this.name}`)
    }
}

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)