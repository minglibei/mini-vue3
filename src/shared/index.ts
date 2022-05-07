export const extend = Object.assign

export function isObject(obj: any) {
    return obj && typeof obj === 'object'
}

export function hasChanged(value: any, newValue: any) {
    return !Object.is(value, newValue)
}

export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key)

// 将首字母大写
const capitalize = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
// 将add-foo 形式转为驼峰命名
export const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : ''
    })
}

export const toHandlerKey = (str: string) => {
    return str ? 'on' + capitalize(str) : ''
}

export const EMPTY_OBJ = {}