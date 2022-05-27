export function transform(root, options = {}) {
    const context = createTranformContext(root, options)
    traverseNode(root, context)
    createCodegenNode(root)
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

    console.log(node)
    traverseChildren(node, context)

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
    return {
        root,
        nodeTransforms: options && options.nodeTransforms || []
    }
}