import { ref } from "../../lib/guide-mini-vue.esm.js"

export const App = {
    template: "<div>hi,{{message}}</div>",
    setup() {
        let message = window.message = ref(1)
        return {
            message
        }
    }
}