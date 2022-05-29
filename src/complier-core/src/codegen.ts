import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

// 根据ast树每个节点类型，生成不同的render代码
export function generate(ast) {
    const context = createCodegenContext(ast)
    const { push } = context

    genFunctionPreamble(ast, context)

    const functionName = 'render'
    let args: any = ['_ctx', "_cache"]
    args = args.join(', ')
    push(`function ${functionName}(${args}){ `)
    push('return ')
    genNode(ast.codegenNode, context)
    push(' }')
    return {
        code: context.code
    }

}

function genFunctionPreamble(ast: any, context: any) {
    const { push } = context
    const VueBinding = "Vue"
    const aliasHelpers = (s) => {
        return `${helperMapName[s]}: _${helperMapName[s]}`
    }
    if (ast.helpers.length > 0) {
        push(`const { ${ast.helpers.map(aliasHelpers).join(', ')} } = ${VueBinding}`)
        push('\n')
    }
    push('return ')
}

function genNode(node, context) {
    switch (node.type) {
        case NodeTypes.TEXT:
            genText(node, context)
            break;
        case NodeTypes.INTERPLOATION:
            genInterpolation(node, context)
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context)
            break
        default:
            break;
    }
}

function genText(node, context) {
    const { push } = context
    push(`'${node.content}'`)
}

function genInterpolation(node, context) {
    const { push, helper } = context
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(')')

}

function genExpression(node: any, context: any) {
    const { push } = context
    push(`${node.content}`)

}

function createCodegenContext(ast) {
    const context = {
        code: '',
        push(source) {
            context.code += source
        },
        helper(key) {
            return `_${helperMapName[key]}`
        }
    }
    return context
}



