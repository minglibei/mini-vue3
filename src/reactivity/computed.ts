import {RactiveEffect} from './effect'

class ComputedImpl{
    private _getter: any
    private _dirty:Boolean = true
    private _value:any
    private _effect:any
    constructor(getter){
        this._getter = getter
        this._effect = new RactiveEffect(getter,()=>{
            if(!this._dirty){
                this._dirty = true
            }
        })
    }

    get value(){
        // 依赖值发生改变 _dirty变为TRUE
        if(this._dirty){
            this._dirty = false
            this._value = this._effect.run()
        }
        return this._value
    }
}

export function computed(getter){
    return new ComputedImpl(getter)
}