export function generate(ast) {
    const context = createCodegenContext(ast)
    const { push } = context
    push('return ')
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

function genNode(node, context) {
    const { push } = context
    push(`'${node.content}'`)
}

function createCodegenContext(ast) {
    const context = {
        code: '',
        push(source) {
            context.code += source
        }
    }
    return context
}

