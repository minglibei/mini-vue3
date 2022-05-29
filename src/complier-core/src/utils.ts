import { NodeTypes } from "./ast";


export function isText(node) {
    return node.type === NodeTypes.INTERPLOATION || node.type === NodeTypes.TEXT
}