
// 对ast树进行处理
import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function transform(root, options = {}) {
    const context = createTranformContext(root, options)
    traverseNode(root, context)
    createCodegenNode(root)
    root.helpers = [...context.helpers.keys()]
}

function createCodegenNode(root) {

    root.codegenNode = root.children[0]
}

function traverseNode(node, context) {
    const nodeTransforms = context.nodeTransforms
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transformOption = nodeTransforms[i]
        transformOption(node)
    }
    switch (node.type) {
        case NodeTypes.INTERPLOATION:
            context.helper(TO_DISPLAY_STRING)
            break;
        case NodeTypes.ELEMENT:
        case NodeTypes.ROOT:
            traverseChildren(node, context)
            break;
        default:
            break;
    }



}


function traverseChildren(node, context) {
    const children = node.children
    if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
            traverseNode(children[i], context)
        }
    }
}

function createTranformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options && options.nodeTransforms || [],
        helpers: new Map(),
        helper(key) {
            context.helpers.set(key, 1)
        }
    }
    return context
}