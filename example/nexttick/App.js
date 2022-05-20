import { h, ref, createApp, getCurrentInstance, nextTick } from '../../lib/guide-mini-vue.esm.js'

const App = {
    name: 'App',
    setup() {
        const count = ref(1)
        const instance = getCurrentInstance()
        function onclick() {
            console.log('11')
            for (let i = 0; i < 100; i++) {
                console.log('update')
                count.value = i
            }

            console.log(instance)
            nextTick(() => {
                console.log(instance)
            })
        }
        return {
            count, onclick
        }
    },
    render() {
        const button = h('button', { onClick: this.onclick }, 'update')
        const p = h('p', {}, 'count:' + this.count)
        return h('div', {}, [button, p])
    }

}

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)