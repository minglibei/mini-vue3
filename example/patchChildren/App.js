import { h } from '../../lib/guide-mini-vue.esm.js'
import { Array2Array } from './Array2Array.js'
import { Array2Text } from './Array2Text.js'
import { Text2Array } from './Text2Array.js'
import { Text2Text } from './Text2Text.js'


export const App = {
    setup() {

    },
    render() {
        return h('div', { id: 'App' },
            [h(Array2Array)]
        )
    }
}