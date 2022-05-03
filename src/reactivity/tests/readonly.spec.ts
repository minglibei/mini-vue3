import {readonly,isReadonly,shallowReadonly,isProxy} from '../reactive'

describe('readonly',()=>{
    it('happy path',()=>{
        const original = {
            foo:1,
            bar:{baz:2}
        }
        let obj = readonly(original)
        expect(obj).not.toBe(original)
        expect(obj.foo).toBe(1)
        expect(isReadonly(obj.bar)).toBe(true)
        expect(isProxy(obj)).toBe(true)

        const shallow = shallowReadonly(original)
        expect(isReadonly(shallow.bar)).toBe(false)
        
    })

    it('readonly',()=>{
        const obj = readonly({
            foo:1
        })
        console.warn = jest.fn()
        obj.foo = 2
        expect(console.warn).toBeCalled()
    })

    it('shallow readonly',()=>{
        const obj = shallowReadonly({
            foo:1
        })
        console.warn = jest.fn()
        obj.foo = 2
        expect(console.warn).toBeCalled()
    })
})