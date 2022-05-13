import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'
import { ShapFlages } from '../shared/shapeFlags'
import { createAppAPI } from './createApp'
import { effect } from '../reactivity/effect'
import { EMPTY_OBJ } from '../shared'
import { shouldUpdateComponent } from './componentUpdateUtils'

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
        if (!n1) {
            mountComponent(n2, container, parent, anchor)
        } else {
            updateComponent(n1, n2)
        }
    }

    function updateComponent(n1, n2) {

        const instance = (n2.component = n1.component)
        if (shouldUpdateComponent(n1, n2)) {
            instance.next = n2
            instance.update()
        } else {
            n2.el = n1.el
            instance.vnode = n2
        }
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
            // 老的比新的多 删除
            while (i <= e1) {
                hostRemove(c1[i].el)
                i++
            }
        } else {
            // 处理中间不匹配的两个子串 寻找相同节点-节点移动  节点删除
            let s1 = i
            let s2 = i
            // 优化： 当已处理节点数大于需要处理的节点数（老节点多余新节点），则把未比较的老节点全部删除
            const toBePatched = e2 - i + 1
            let patched = 0

            // 优化： 处理老节点在新节点顺序时判断是否存在乱序 需要移动
            let moved = false
            let maxNewIndexSoFar = 0

            // 找出来的中间部分的新节点存入map
            const keyToNewIndexMap = new Map()
            for (let i = s2; i <= e2; i++) {
                keyToNewIndexMap.set(c2[i].key, i)
            }

            const newIndexToOldIndexMap = new Array(toBePatched)
            for (let i = 0; i < toBePatched; i++) {
                // 为每项初始化为0
                newIndexToOldIndexMap[i] = 0
            }

            // 遍历老节点
            for (let i = s1; i <= e1; i++) {

                let newIndex
                const prevChild = c1[i]

                if (patched >= toBePatched) {
                    hostRemove(prevChild.el)
                    continue
                }


                // 找出老节点在新数组中的位置
                if (prevChild.key !== null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key)
                } else {
                    for (let j = s2; j <= e2; j++) {
                        if (isSameVNodeType(c2[j], prevChild)) {
                            newIndex = j
                            break
                        }
                    }
                }

                if (newIndex !== undefined) {
                    if (newIndex > maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex
                    } else {
                        moved = true
                    }
                    newIndexToOldIndexMap[newIndex - s2] = i + 1

                    // 新树中存在老节点
                    patch(prevChild, c2[newIndex], container, parentComponent, null)
                    patched++
                } else {
                    // 新树中不存在老节点
                    hostRemove(prevChild.el)
                }
            }

            const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
            let j = increasingNewIndexSequence.length - 1
            // 遍历新数组中的节点，处理新增或位置移动
            for (let i = toBePatched; i >= 0; i--) {
                const nextIndex = i + s2
                const nextChild = c2[nextIndex]
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
                if (newIndexToOldIndexMap[i] === 0) {
                    patch(null, nextChild, container, parentComponent, anchor)
                } else if (moved) {
                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        hostInsert(nextChild.el, container, anchor)
                    } else {
                        j--
                    }
                }

            }

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
        const instance = (vnode.component = createComponentInstance(vnode, parent))
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
        instance.update = effect(() => {

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
                // 获取更新后的节点
                const { next, vnode } = instance
                if (next) {
                    next.el = vnode.el
                    updateComponentPreRender(instance, next)
                }
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

function updateComponentPreRender(instance, nextVNode) {
    instance.next = null
    instance.vnode = nextVNode
    instance.props = nextVNode.props
}

// 获取数组的最长递增子串 下标数组
// [3,4,6,2,1,7] => [0,1,2,5]
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                } else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
