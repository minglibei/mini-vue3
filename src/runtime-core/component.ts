import { PublicInstanceProxyHandlers } from './componentsPublicInstance'
import { shallowReadonly } from '../reactivity/reactive'
import { initProps } from './componentProps'
import { initSlots } from './componentSlots'
import { emit } from './componentEmit'
import { proxyRefs } from '../reactivity'

export function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: null,
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => {
        }
    }
    component.emit = emit.bind(null, vnode) as any
    return component
}

export function setupComponent(instance) {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
    const Component = instance.type
    instance.proxy = new Proxy({ _: instance },
        PublicInstanceProxyHandlers
    )
    const { setup } = Component
    if (setup) {
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        setCurrentInstance(null)

        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult) {
    // function 
    // object
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult)
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const Component = instance.type
    if (compiler && !Component.render) {
        if (Component.template) {
            Component.render = compiler(Component.template)
        }
    }
    instance.render = Component.render
}


let currentInstance = null

export function getCurrentInstance() {
    return currentInstance
}

function setCurrentInstance(instance) {
    currentInstance = instance
}

let compiler
export function registerRuntimeComplier(_compiler) {
    compiler = _compiler

}