import { CREATE_ELEMENT_VNODE } from "./runtimeHelpers"

export const enum NodeTypes {
    INTERPLOATION,
    SIMPLE_EXPRESSION,
    ELEMENT,
    TEXT,
    ROOT,
    COMPOUND_EXPRESSION
}

export function createVNodeCall(context, tag, props, children) {
    context.helper(CREATE_ELEMENT_VNODE)
    return {
        tag,
        props,
        children,
        type: NodeTypes.ELEMENT
    }

}