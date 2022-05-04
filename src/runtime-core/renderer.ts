import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'
import { ShapFlages } from '../shared/shapeFlags'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
    const {
        createElement,
        patchProps,
        insert
    } = options

    function render(vnode, container) {
        // patch
        patch(vnode, container, null)
    }
    function patch(vnode, container, parentComponent) {
        // 判断vnode type
        // element -> mount Element
        const { type, shapeFlag } = vnode
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent)
                break;
            case Text:
                processText(vnode, container)
                break
            default:
                if (shapeFlag & ShapFlages.ELEMENT) {
                    processElement(vnode, container, parentComponent)
                } else if (shapeFlag & ShapFlages.STATEFUL_COMPONENT) {
                    // component
                    processComponent(vnode, container, parentComponent)
                }
                break;
        }

    }
    function processText(vnode, container) {
        const { children } = vnode
        const textElement = (vnode.el = document.createTextNode(children))
        container.append(textElement)
    }

    function processFragment(vnode, container, parent) {
        mountChildren(vnode, container, parent)
    }

    // 处理组件
    function processComponent(vnode, container, parent) {
        mountComponent(vnode, container, parent)
    }

    // 处理元素
    function processElement(vnode, container, parent) {
        mountElement(vnode, container, parent)
    }


    function mountComponent(vnode, container, parent) {
        const instance = createComponentInstance(vnode, parent)
        setupComponent(instance)

        setupRenderEffect(instance, vnode, container)
    }


    function mountElement(vnode, container, parent) {
        // 创建元素
        const el = (vnode.el = createElement(vnode.type))
        // 增加props
        const { props, children } = vnode
        for (const key in props) {
            const val = props[key]

            patchProps(el, key, val)
        }
        // 处理children
        if (vnode.shapeFlag & ShapFlages.TEXT_CHILDREDN) {
            el.textContent = children
        } else if (vnode.shapeFlag & ShapFlages.ARRAY_CHILDREN) {
            mountChildren(vnode, el, parent)
        }
        // 将元素挂载到 container

        insert(el, container)
    }

    // 处理子内容
    function mountChildren(vnode, container, parent) {
        vnode.children.forEach(c => {
            patch(c, container, parent)
        })
    }

    function setupRenderEffect(instance, vnode, container) {
        const { proxy } = instance
        const subTree = instance.render.call(proxy) // 虚拟节点树
        // vnode -> patch
        // element -> mount
        patch(subTree, container, instance)

        vnode.el = subTree.el

    }

    return {
        creatApp: createAppAPI(render)
    }
}