import { toHandlerKey, camelize } from "../shared/index"
export function emit(instance: any, event: string, ...args) {
    console.log('emit', event)
    const { props } = instance

    // 找到响应函数
    const handler = props[toHandlerKey(camelize(event))]
    handler && handler(...args)
}