import {reactive,isReactive,isProxy} from '../reactive'

describe("reactive",()=>{
    it('happy path',()=>{
        let original = {foo:1}
        let observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
        expect(isProxy(observed)).toBe(true)

    })

    it('qiantao',()=>{
        const original = {foo:{age:{a:'',b:''},name:'sf'},arry:[1,2,3]}
        const observed = reactive(original)
        expect(isReactive(original)).toBe(false)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(observed.arry)).toBe(true)
        expect(isReactive(observed.foo)).toBe(true)
        expect(isReactive(observed.foo.age)).toBe(true)
    })
})