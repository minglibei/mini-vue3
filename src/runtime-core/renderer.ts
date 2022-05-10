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
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = options

    function render(vnode, container) {
        // patch
        patch(null, vnode, container, null, null)
    }

    function patch(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
        // 判断vnode type
        // element -> mount Element
        const { type, shapeFlag } = n2
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor)
                break;
            case Text:
                processText(n1, n2, container)
                break;
            default:
                if (shapeFlag & ShapFlages.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor)
                } else if (shapeFlag & ShapFlages.STATEFUL_COMPONENT) {
                    // component
                    processComponent(n1, n2, container, parentComponent, anchor)
                }
                break;
        }

    }
    function processText(n1, n2, container) {
        const { children } = n2
        const textElement = (n2.el = document.createTextNode(children))
        container.append(textElement)
    }

    function processFragment(n1, n2, container, parent, anchor) {
        mountChildren(n2.children, container, parent, anchor)
    }

    // 处理组件
    function processComponent(n1, n2, container, parent, anchor) {
        mountComponent(n2, container, parent, anchor)
    }

    // 处理元素
    function processElement(n1, n2, container, parent, anchor) {
        if (!n1) {
            mountElement(n2, container, parent, anchor)
        } else {
            patchElement(n1, n2, container, parent, anchor)
        }
    }

    function patchElement(n1, n2, container, parentComponent, anchor) {
        console.log('patchElement')
        console.log('n1', n1)
        console.log('n2', n2)
        const oldProps = n1.props || EMPTY_OBJ
        const newProps = n2.props || EMPTY_OBJ
        const el = (n2.el = n1.el)
        patchChildren(n1, n2, el, parentComponent, anchor)
        patchProps(el, oldProps, newProps)
    }

    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapFlags = n1.shapeFlag
        const { shapeFlag } = n2
        const c2 = n2.children
        const c1 = n1.children
        if (shapeFlag & ShapFlages.TEXT_CHILDREDN) {
            if (prevShapFlags & ShapFlages.ARRAY_CHILDREN) {
                // 清空原数组
                unmountChildren(n1.children)
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2)
            }
        } else {
            if (prevShapFlags & ShapFlages.TEXT_CHILDREDN) {
                hostSetElementText(container, '')
                mountChildren(c2, container, parentComponent, anchor)
            } else {
                // array diff array
                patchKeyedChildren(c1, c2, container, parentComponent, anchor)

            }
        }

    }


    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        let i = 0
        let e1 = c1.length - 1
        let e2 = c2.length - 1
        const l2 = c2.length

        function isSameVNodeType(e1, e2) {
            return e1.type === e2.type && e1.key === e2.key

        }
        // 从左向右对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]

            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break
            }
            i++
        }
        // 从右向左对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1]
            const n2 = c2[e2]
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break
            }
            e1--
            e2--
        }

        // 新的比老的多 创建
        if (i > e1) {
            if (i <= e2) {
                debugger
                const nextPos = e2 + 1
                const anchor = nextPos < l2 ? c2[nextPos].el : null
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor)
                    i++
                }
            }
        } else if (i > e2) {
            while (i <= e1) {
                hostRemove(c1[i].el)
                i++
            }
        } else {

        }

    }

    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el
            hostRemove(el)
        }

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


    function mountComponent(vnode, container, parent, anchor) {
        const instance = createComponentInstance(vnode, parent)
        setupComponent(instance)

        setupRenderEffect(instance, vnode, container, anchor)
    }


    function mountElement(vnode, container, parent, anchor) {
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
            mountChildren(vnode.children, el, parent, anchor)
        }
        // 将元素挂载到 container

        hostInsert(el, container, anchor)
    }

    // 处理子内容
    function mountChildren(children, container, parent, anchor) {
        children.forEach(c => {
            patch(null, c, container, parent, anchor)
        })
    }

    function setupRenderEffect(instance, initialVnode, container, anchor) {
        effect(() => {

            if (!instance.isMounted) {
                console.log('init')
                const { proxy } = instance
                const subTree = (instance.subTree = instance.render.call(proxy))// 虚拟节点树

                console.log(subTree)

                patch(null, subTree, container, instance, anchor)
                initialVnode.el = subTree.el

                instance.isMounted = true
            } else {
                console.log('update')
                const { proxy } = instance
                const subTree = instance.render.call(proxy)
                const prevSubTree = instance.subTree
                instance.subTree = subTree
                patch(prevSubTree, subTree, container, instance, anchor)

            }
        })

    }

    return {
        createApp: createAppAPI(render)
    }
}