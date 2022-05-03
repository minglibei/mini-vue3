import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"
import { isObject,extend } from "../shared"

const set = createSetter()
const get = createGetter()
const readonlyget = createGetter(true)
const shallowreadonlyget = createGetter(true,true)

function createGetter(isReadOnly = false,shallow = false){
    return  function get(target,key){
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isReadOnly
        } else if(key===ReactiveFlags.IS_READONLY){
            return isReadOnly
        }
        
        let res = Reflect.get(target,key)

        if(shallow){
            return res
        }

        if(isObject(res)){
            return isReadOnly? readonly(res) : reactive(res)
        }
        
        if(!isReadOnly){
            track(target,key)
        }
        return res
    }
}

function createSetter(){
    return function set(target,key,val){
        let res = Reflect.set(target,key,val)
        trigger(target,key)
        return res
    }
}

export const mutableHandlers  = {
    get,
    set
}
export const readonlyHandlers = {
    get:readonlyget,
    set(target,key){
        console.warn(`${target}.${key} can not be set (readonly)`)
        return true
    }
}

export const shallowReadonlyHandlers = extend({},readonlyHandlers,{get:shallowreadonlyget})