import { hasChanged,isObject } from "../shared"
import { trackEffects, triggerEffects,isTracking } from "./effect"
import { reactive } from "./reactive"

// ref : number/bool/string
// proxy 支持对象劫持
// 使用ref对基础类型包裹一层，从而触发 get set操作
class RefImpl{
    private _value:any
    public dep:any
    private _rawValue:any
    public __V_isRef = true

    constructor(value:any){
        this.dep = new Set()
        this._rawValue = value
        this._value = convert(value)
    }

    get value(){
        trackRefValue(this)
        return this._value
    }

    set value(newValue){
        if(hasChanged(newValue,this._rawValue)){
            this._value = convert(newValue)
            this._rawValue = newValue
            triggerEffects(this.dep)
        }
    }
}

function convert(value){
   return isObject(value) ? reactive(value): value
}

function trackRefValue(ref) {
    if(isTracking()){
        trackEffects(ref.dep)
    }
}

export function ref(value){
    return new RefImpl(value)
}

export function isRef(ref){
    return !!ref.__V_isRef
}

export function unRef(ref){
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs){
    return new Proxy(objectWithRefs,{
        get(target,key){
           return unRef(Reflect.get(target,key))
        },
        set(target,key,value){
            if(isRef(target[key]) && !isRef(value)){
                return (target[key].value = value)
            } else  {
                return Reflect.set(target,key,value)
            }
        }
    })
}