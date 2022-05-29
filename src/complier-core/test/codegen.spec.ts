import { baseParse } from "../src/parse"
import { transform } from "../src/transfrom"
import { generate } from '../src/codegen'
import { transfromElement } from "../src/transforms/transformElement"
import { transformExpression } from "../src/transforms/transformExpression"
import { transformText } from "../src/transforms/transfromText"

describe('codegen', () => {
    it('string', () => {
        const ast = baseParse('hi')
        transform(ast)
        const { code } = generate(ast)
        expect(code).toMatchSnapshot()
    })

    it('interpolation', () => {
        const ast = baseParse('{{message}}')
        transform(ast, {
            nodeTransforms: [transformExpression]
        })
        const { code } = generate(ast)
        expect(code).toMatchSnapshot()

    })

    it('element', () => {
        const ast = baseParse('<div></div>')
        transform(ast, {
            nodeTransforms: [transfromElement]
        })
        const { code } = generate(ast)
        expect(code).toMatchSnapshot()

    })


    it('compound', () => {
        const ast: any = baseParse('<div>hi,{{message}}</div>')
        transform(ast, {
            // 执行顺序： transformExpression -> transformText -> transfromElement
            nodeTransforms: [transformExpression, transfromElement, transformText]
        })

        console.log('ast___', ast, ast.codegenNode.children)
        const { code } = generate(ast)
        expect(code).toMatchSnapshot()

    })
})