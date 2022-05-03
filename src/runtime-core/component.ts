import { PublicInstanceProxyHandlers } from './componentsPublicInstance'
import { shallowReadonly } from '../reactivity/reactive'
import { initProps } from './componentProps'
import { initSlots } from './componentSlots'
import { emit } from './componentEmit'

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: null,
        props: {},
        slots: {},
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
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult) {
    // function 
    // object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const Component = instance.type
    instance.render = Component.render
}