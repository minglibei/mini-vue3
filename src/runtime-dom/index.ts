import { createRenderer } from '../runtime-core'

function createElement(type) {
    return document.createElement(type)
}

function patchProps(el, key, oldVal, newVal) {

    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, newVal)
    } else {
        if (newVal === undefined || newVal === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, newVal)
        }
    }

}

function insert(child, parent, anchor) {
    // 在指定位置插入
    parent.insertBefore(child, anchor || null)
}

function remove(child) {
    const parent = child.parentNode
    if (parent) {
        parent.removeChild(child)
    }
}

function setElementText(el, text) {
    el.textContent = text

}

const renderer: any = createRenderer({
    createElement,
    patchProps,
    insert,
    remove,
    setElementText
})
export function createApp(...args) {
    return renderer.createApp(...args)
}
export * from '../runtime-core'