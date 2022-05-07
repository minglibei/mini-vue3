import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'
import { ShapFlages } from '../shared/shapeFlags'
import { createAppAPI } from './createApp'
import { effect } from '../reactivity/effect'
import { EMPTY_OBJ } from '../shared'

export function createRenderer(options) {
    const {
        createElement: hostCreateElement,
        patchProps: hostPatchProps,
        insert: hostInsert
    } = options

    function render(vnode, container) {
        // patch
        patch(null, vnode, container, null)
    }
    function patch(n1, n2, container, parentComponent) {
        // 判断vnode type
        // element -> mount Element
        const { type, shapeFlag } = n2
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break;
            case Text:
                processText(n1, n2, container)
                break;
            default:
                if (shapeFlag & ShapFlages.ELEMENT) {
                    processElement(n1, n2, container, parentComponent)
                } else if (shapeFlag & ShapFlages.STATEFUL_COMPONENT) {
                    // component
                    processComponent(n1, n2, container, parentComponent)
                }
                break;
        }

    }
    function processText(n1, n2, container) {
        const { children } = n2
        const textElement = (n2.el = document.createTextNode(children))
        container.append(textElement)
    }

    function processFragment(n1, n2, container, parent) {
        mountChildren(n2, container, parent)
    }

    // 处理组件
    function processComponent(n1, n2, container, parent) {
        mountComponent(n2, container, parent)
    }

    // 处理元素
    function processElement(n1, n2, container, parent) {
        if (!n1) {
            mountElement(n2, container, parent)
        } else {
            patchElement(n1, n2, container)
        }
    }

    function patchElement(n1, n2, container) {
        console.log('patchElement')
        console.log('n1', n1)
        console.log('n2', n2)
        const oldProps = n1.props || EMPTY_OBJ
        const newProps = n2.props || EMPTY_OBJ
        const el = (n2.el = n1.el)
        patchProps(el, oldProps, newProps)
    }

    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const oldVal = oldProps[key]
                const newVal = newProps[key]
                if (oldVal !== newVal) {
                    hostPatchProps(el, key, oldVal, newVal)
                }
            }
            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProps(el, key, oldProps[key], null)
                    }
                }
            }
        }

    }


    function mountComponent(vnode, container, parent) {
        const instance = createComponentInstance(vnode, parent)
        setupComponent(instance)

        setupRenderEffect(instance, vnode, container)
    }


    function mountElement(vnode, container, parent) {
        // 创建元素
        const el = (vnode.el = hostCreateElement(vnode.type))
        // 增加props
        const { props, children } = vnode
        for (const key in props) {
            const val = props[key]

            hostPatchProps(el, key, null, val)
        }
        // 处理children
        if (vnode.shapeFlag & ShapFlages.TEXT_CHILDREDN) {
            el.textContent = children
        } else if (vnode.shapeFlag & ShapFlages.ARRAY_CHILDREN) {
            mountChildren(vnode, el, parent)
        }
        // 将元素挂载到 container

        hostInsert(el, container)
    }

    // 处理子内容
    function mountChildren(vnode, container, parent) {
        vnode.children.forEach(c => {
            patch(null, c, container, parent)
        })
    }

    function setupRenderEffect(instance, initialVnode, container) {
        effect(() => {

            if (!instance.isMounted) {
                console.log('init')
                const { proxy } = instance
                const subTree = (instance.subTree = instance.render.call(proxy))// 虚拟节点树

                console.log(subTree)

                patch(null, subTree, container, instance)
                initialVnode.el = subTree.el

                instance.isMounted = true
            } else {
                console.log('update')
                const { proxy } = instance
                const subTree = instance.render.call(proxy)
                const prevSubTree = instance.subTree
                instance.subTree = subTree
                patch(prevSubTree, subTree, container, instance)

            }
        })

    }

    return {
        createApp: createAppAPI(render)
    }
}