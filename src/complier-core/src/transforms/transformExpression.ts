import { NodeTypes } from "../ast";

export function transformExpression(node) {
    if (node.type === NodeTypes.INTERPLOATION) {
        node.content = processExpression(node.content)
    }
}
function processExpression(node) {
    node.content = '_ctx.' + node.content
    return node
}