import { ShapFlages } from "../shared/shapeFlags"
export function createVNode(type, props?, children?) {
    const vnode = {
        type, // 传入组件
        props, // 组件属性
        children, // 子
        shapeFlag: getShapeFlag(type), // 元素类型
        el: null
    }
    if (typeof vnode.children === 'string') {
        vnode.shapeFlag = ShapFlages.TEXT_CHILDREDN | vnode.shapeFlag
    } else {
        vnode.shapeFlag = ShapFlages.ARRAY_CHILDREN | vnode.shapeFlag
    }
    return vnode

}

function getShapeFlag(type) {
    return typeof type === "string" ? ShapFlages.ELEMENT : ShapFlages.STATEFUL_COMPONENT
}