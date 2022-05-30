import { generate } from "./codegen"
import { baseParse } from "./parse"
import { transfromElement } from "./transforms/transformElement"
import { transformExpression } from "./transforms/transformExpression"
import { transformText } from "./transforms/transfromText"
import { transform } from "./transfrom"

export function baseCompile(template) {
    const ast: any = baseParse(template)
    transform(ast, {
        // 执行顺序： transformExpression -> transformText -> transfromElement
        nodeTransforms: [transformExpression, transfromElement, transformText]
    })
    return generate(ast)
}