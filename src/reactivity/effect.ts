import {extend} from '../shared/index'


let activeEffect
let shouldTrack

export class RactiveEffect{
    private _fn: any
    public scheduler: any
    deps = []
    active = true
    onStop ?: () => void
    constructor(fn,scheduler?:Function){
        this._fn = fn
        this.scheduler = scheduler
    }
    run(){
        // 如果使用了stop
        if(!this.active) {
            return this._fn()
        }

        // 如果没使用stop 进行依赖收集
        shouldTrack = true
        activeEffect = this

        let result = this._fn() // 执行时会触发依赖数据的get操作，从而完成收集依赖
        shouldTrack = false
        return result

    }
    stop(){
        if(this.active){
            cleanupEffect(this)
            if(this.onStop) this.onStop()
            this.active= false
        }
    }
}

function cleanupEffect(effect){
    effect.deps.forEach((e: any) => {
        e.delete(effect)
    });
    effect.deps.length = 0
}
// 收集、执行依赖事件
// fn 绑定的事件处理函数
// options.scheduler 数据更新时调用的事件
export function effect(fn,options:any = {}){
    let _effect = new RactiveEffect(fn,options.scheduler)
    extend(_effect,options)
    _effect.run()
    const runner:any = _effect.run.bind(_effect)
    runner.effect = _effect

    return  runner
}

const targetMap = new Map()

// 收集依赖
export function track(target,key){
    if(!isTracking()) return
    // 添加监听
    // 获取target的监听对象
    let depsMap = targetMap.get(target)
    if(!depsMap){
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    // 获取key的监听对象, 因为不能重复，所以使用set
    let dep = depsMap.get(key)
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }
    // 调用effect时 会将当前的方法对象赋值给activeEffect，将对象添加到监听队列
    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)

    trackEffects(dep)
}

export function trackEffects(dep){
    // 调用effect时 会将当前的方法对象赋值给activeEffect，将对象添加到监听队列
    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

export function isTracking(){
    return activeEffect!==undefined && shouldTrack
}

export function trigger(target,key){
    let targets = targetMap.get(target)
    let dep = targets.get(key)

    triggerEffects(dep)
}

export function triggerEffects(dep){
    for( const effect of dep){
        if(effect.scheduler){
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

export function stop(runner){
    runner.effect.stop()
}

