import { NodeTypes } from "./ast"

const enum TagTypes {
    Start,
    End
}

export function baseParse(content: any) {
    const context = createParserContext(content)

    return createRoot(parserChildren(context))
}

function parserChildren(context) {
    const nodes: any = []
    const s = context.source
    let node
    if (s.startsWith('{{')) {
        node = parseInterpolation(context)
    } else if (s[0] === '<') {
        if (/[a-z]/i.test(s[1])) {
            node = parseElement(context)
        }
    }

    if (!node) {
        node = parseText(context)
    }
    nodes.push(node)
    return nodes
}

function parseText(context) {
    // 取值
    // 处理后字符串删除
    const content = parseTextData(context, context.source.length)
    advanceBy(context, content.length)
    return {
        type: NodeTypes.TEXT,
        content
    }

}

function parseElement(context) {
    const element = parseTag(context, TagTypes.Start)
    parseTag(context, TagTypes.End)
    console.log('context source:', context.source)
    return element
}

function parseTag(context, type: TagTypes) {
    // 1、解析tag
    // 2、删除处理完成的代码
    const match: any = /^<\/?([a-z]*)/i.exec(context.source)
    const tag = match[1]
    advanceBy(context, match[0].length)

    advanceBy(context, 1)
    if (type === TagTypes.End) return
    return {
        type: NodeTypes.ELEMENT,
        tag
    }
}

function parseInterpolation(context) {
    // {{message}}
    const openDelimiter = '{{'
    const closeDelimiter = '}}'
    const closeIndex = context.source.indexOf(closeDelimiter, closeDelimiter.length)


    advanceBy(context, openDelimiter.length)
    const rawContentLength = closeIndex - openDelimiter.length
    const rawContent = parseTextData(context, rawContentLength)

    advanceBy(context, rawContentLength + closeDelimiter.length)
    const content = rawContent.trim()
    return {
        type: NodeTypes.INTERPLOATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: content
        }
    }
}

function advanceBy(context, length) {
    context.source = context.source.slice(length)
}

function parseTextData(context, length) {
    const content = context.source.slice(0, length)
    advanceBy(context, length)
    return content
}

function createRoot(children) {
    return {
        children
    }
}

function createParserContext(content: string) {
    return {
        source: content
    }
}