// rollup 默认支持esm
import typescript from '@rollup/plugin-typescript'
export default {
    input:"./src/index.ts",
    output:[
        {
            format:'es',
            file:'lib/guide-mini-vue.esm.js'    
        },
        {
            format:'cjs',
            file:'lib/guide-mini-vue.cjs.js'
        }
        
    ],
    plugins:[
        typescript()
    ]
}