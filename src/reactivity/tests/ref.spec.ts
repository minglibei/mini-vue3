import { effect } from "../effect"
import { ref,isRef,unRef,proxyRefs } from '../ref'
import { isReactive } from '../reactive'

describe("reactive",()=>{
    it('happy path',()=>{
        const a = ref(1)
        expect(a.value).toBe(1)
    })

    it('should be reactive',()=>{
        const a = ref(1)
        expect(a.value).toBe(1)
        let count = 0
        let dummy = 2
        effect(()=>{
            count++
            dummy = a.value
        })
        expect(count).toBe(1)
        expect(dummy).toBe(1)
        a.value = 2
        expect(count).toBe(2)
        expect(dummy).toBe(2)
        a.value=2
        expect(count).toBe(2)
    })

    it('accept object to be reactive',()=>{
        const obj = ref({
            count:1
        })
        let dummy
        effect(()=>{
            dummy = obj.value.count
        })
        expect(dummy).toBe(1)
        obj.value.count = 2
        expect(dummy).toBe(2)
        expect(isReactive(obj.value)).toBe(true)
    })

    it('isRef',()=>{
        const a = ref(1)
        const b = 1
        expect(isRef(a)).toBe(true)
        expect(isRef(b)).toBe(false)
    })

    it('unRef',()=>{
        const a = ref(1)
        expect(unRef(a)).toBe(1)
        expect(1).toBe(1)
    })

    it('proxyRefs',() => {
        const user =  {
            age:ref(1),
            name:'bml'
        }
        const proxyUser = proxyRefs(user)
        expect(user.age.value).toBe(1)
        expect(proxyUser.age).toBe(1)
        expect(proxyUser.name).toBe('bml')
        
        proxyUser.age = 2
        expect(user.age.value).toBe(2)
        expect(proxyUser.age).toBe(2)

        proxyUser.age = ref(10)
        expect(user.age.value).toBe(10)
        expect(proxyUser.age).toBe(10)
        

    })
})