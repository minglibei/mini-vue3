import { createVNode, Fragment } from "../vnode"

export function renderSlots(slots, name, props) {
    const val = slots[name]
    if (val) {
        if (typeof val === 'function') {
            return createVNode(Fragment, {}, val(props))
        }
    }
}