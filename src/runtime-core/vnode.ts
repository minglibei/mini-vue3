import { ShapFlages } from "../shared/shapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export { createVNode as createElementVNode }
export function createVNode(type, props?, children?) {
    const vnode = {
        type, // 传入组件
        props, // 组件属性
        children, // 子
        component: null,
        next: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type), // 元素类型
        el: null
    }
    if (typeof vnode.children === 'string') {
        vnode.shapeFlag = ShapFlages.TEXT_CHILDREDN | vnode.shapeFlag
    } else if (Array.isArray(children)) {
        vnode.shapeFlag = ShapFlages.ARRAY_CHILDREN | vnode.shapeFlag
    }

    if (vnode.shapeFlag & ShapFlages.STATEFUL_COMPONENT) {
        if (typeof children === 'object') {
            vnode.shapeFlag = ShapFlages.SLOT_CHILDREN | vnode.shapeFlag
        }
    }
    return vnode

}

export function createTextVNode(text) {
    return createVNode(Text, {}, text)
}

function getShapeFlag(type) {
    return typeof type === "string" ? ShapFlages.ELEMENT : ShapFlages.STATEFUL_COMPONENT
}