import { isObject } from '../shared/index'
import { createComponentInstance, setupComponent } from './component'
import { createVNode } from './vnode'
import { ShapFlages } from '../shared/shapeFlags'

export function render(vnode, container) {
    // patch
    patch(vnode, container)
}
function patch(vnode, container) {
    // 判断vnode type
    // element -> mount Element
    const { shapeFlag } = vnode
    if (shapeFlag & ShapFlages.ELEMENT) {
        processElement(vnode, container)
    } else if (shapeFlag & ShapFlages.STATEFUL_COMPONENT) {
        // component
        processComponent(vnode, container)
    }
}

// 处理组件
function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

// 处理元素
function processElement(vnode, container) {
    mountElement(vnode, container)
}


function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)

    setupRenderEffect(instance, vnode, container)
}


function mountElement(vnode, container) {
    // 创建元素
    const el = (vnode.el = document.createElement(vnode.type))
    // 增加props
    const { props, children } = vnode
    for (const key in props) {
        const isOn = (key: string) => /^on[A-Z]/.test(key)
        const val = props[key]
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase()
            el.addEventListener(event, val)
        } else {
            el.setAttribute(key, val)
        }
    }
    // 处理children
    if (vnode.shapeFlag & ShapFlages.TEXT_CHILDREDN) {
        el.textContent = children
    } else if (vnode.shapeFlag & ShapFlages.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    // 将元素挂载到 container
    container.append(el)
}

// 处理子内容
function mountChildren(vnode, container) {
    vnode.children.forEach(c => {
        patch(c, container)
    })
}

function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy) // 虚拟节点树
    // vnode -> patch
    // element -> mount
    patch(subTree, container)

    vnode.el = subTree.el

}