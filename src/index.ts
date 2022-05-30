export * from './runtime-dom'


import { baseCompile } from './complier-core/src'
import * as runtimeDom from './runtime-dom'
import { registerRuntimeComplier } from './runtime-dom'

function compileToFunction(template) {
    const { code } = baseCompile(template)
    const render = new Function('Vue', code)(runtimeDom)
    return render
}
registerRuntimeComplier(compileToFunction)
