import { isString } from "../../shared"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_VNODE, helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

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
            break;
        case NodeTypes.ELEMENT:
            genElement(node, context)
            break;
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompoundExpression(node, context)
            break;

        default:
            break;
    }
}

function genText(node, context) {
    const { push } = context
    push(`'${node.content}'`)
}

function genCompoundExpression(node, context) {
    console.log('genCompoundExpression_____', node)
    const { children } = node
    const { push } = context
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isString(child)) {
            push(child)
        } else {
            genNode(child, context)
        }
    }
}

function genElement(node, context) {
    const { push, helper } = context
    const { tag, children, props } = node
    push(`${helper(CREATE_ELEMENT_VNODE)}(`)
    genNodeList(genNullable([tag, props, children]), context)
    push(')')
}

function genNodeList(nodes, context) {
    const { push } = context
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (isString(node)) {
            push(node)
        } else {
            genNode(node, context)
        }
        if (i < nodes.length - 1) {
            push(', ')
        }
    }

}

function genNullable(args) {
    return args.map((arg) => arg || 'null')
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



