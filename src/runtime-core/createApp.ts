import { createVNode } from './vnode'

export function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 将组件 转为虚拟节点
                const vnode = createVNode(rootComponent)
                // 处理完后 挂载到根节点
                render(vnode, rootContainer)
            }
        }
    }
}