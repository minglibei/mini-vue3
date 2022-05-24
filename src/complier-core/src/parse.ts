import { NodeTypes } from "./ast"

const enum TagTypes {
    Start,
    End
}

export function baseParse(content: any) {
    const context = createParserContext(content)

    return createRoot(parserChildren(context, []))
}

function parserChildren(context, ancestors) {
    const nodes: any = []
    while (!isEnd(context, ancestors)) {
        const s = context.source
        let node
        if (s.startsWith('{{')) {
            node = parseInterpolation(context)
        } else if (s[0] === '<') {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors)
            }
        }

        if (!node) {
            node = parseText(context)
        }
        nodes.push(node)
    }
    return nodes
}

function isEnd(context, ancestors) {
    const s = context.source
    if (s.startsWith('</')) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
            const tag = ancestors[i].tag
            if (s.slice(2, 2 + tag.length) === tag) {
                return true
            }
        }
    }
    return !s

}

function parseText(context) {
    const matchEndFlag = ['{{', '</']
    const s = context.source
    let endIndex = s.length

    for (let i = 0; i < matchEndFlag.length; i++) {
        const index = s.indexOf(matchEndFlag[i])
        if (index !== -1 && index < endIndex) {
            endIndex = index
        }
    }
    // 取值
    // 处理后字符串删除
    const content = parseTextData(context, endIndex)

    return {
        type: NodeTypes.TEXT,
        content
    }

}

function parseElement(context, ancestors) {
    const element: any = parseTag(context, TagTypes.Start)
    ancestors.push(element)
    element.children = parserChildren(context, ancestors)
    ancestors.pop()
    if (context.source.slice(2, 2 + element.tag.length) === element.tag) {
        parseTag(context, TagTypes.End)
    } else {
        throw new Error('缺少结束标签:' + element.tag)
    }
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

    advanceBy(context, closeDelimiter.length)
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