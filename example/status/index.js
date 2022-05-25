// 模拟有限状态机实现
// 定义： 读取一组输入，然后根据这些输入来更改为不同的状态
// 如解析 <div>hi,{{message}}</div> 成为ast树
function test(string) {
    let startIndex, endIndex, i
    function waitForA(char) {
        if (char === 'a') {
            startIndex = i
            return waitForB
        }
        return waitForA
    }

    function waitForB(char) {
        if (char === 'b' || char === 'd') {
            return waitForC
        }
        return waitForA(char)
    }

    function waitForC(char) {
        if (char === 'c') {
            endIndex = i
            return end
        }
        return waitForA(char)
    }

    function end() {
        return end
    }

    let statusFn = waitForA
    for (i = 0; i < string.length; i++) {
        let c = string[i]
        statusFn = statusFn(c)
        if (statusFn === end) {
            console.log(startIndex, endIndex)
            statusFn = waitForA
        }
    }

}
test('aabcsdaaadcsda')


