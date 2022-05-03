import {reactive} from '../reactive'
import {effect,stop} from '../effect'

describe('effect',()=>{
    it('happy path',()=>{
        let user = reactive({
            age:10
        }) 
        let nextAge
        effect(()=>{
            nextAge = user.age+1
        })
        expect(nextAge).toBe(11)

        user.age++
        expect(nextAge).toBe(12)
    })

    it('return runner when call effect',()=>{
        //  effect 附属功能
        //  effect 函数返回runner runner执行后需要返回函数的结果
        let age = 10
        let runner = effect(()=>{
            age++
            return 'result'
        })
        expect(age).toBe(11)
        let res = runner()
        expect(age).toBe(12)
        expect(res).toBe('result')

    })

    it('effect scheduler',()=>{
        // 传入scheduler 事件
        // 第一次调用effect不会执行
        // 当触发set 更新操作后 将会执行scheduler事件 不去执行runner
        // 当执行runner时，会再次执行fn
        let run
        let dummy
        let scheduler = jest.fn(()=>{
            run = runner
        })
        const obj = reactive({foo:1})
        const runner = effect(()=>{
            dummy = obj.foo
        },
        { scheduler })
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
        run()
        expect(dummy).toBe(2)
    })
    it('stop',()=>{
        let dummy
        const obj = reactive({
            prop:1
        })
        const runner = effect(()=>{
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        // obj.prop = 3
        obj.prop++
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(3)
    })

    it('onStop',()=>{
        const obj = reactive({
            foo:1
        })
        let dummy
        const onStop = jest.fn()
        const runner = effect(()=>{
            dummy = obj.foo
        },{
            onStop
        })
        stop(runner)
        expect(onStop).toBeCalledTimes(1)

    })
})