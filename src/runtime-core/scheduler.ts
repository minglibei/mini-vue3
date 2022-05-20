const queue: any = []
let flushPending = false
const p = Promise.resolve()

export function queueJobs(job: any) {
    if (!queue.includes(job)) {
        queue.push(job)
    }
    flushQueue()
}

export function nextTick(fn) {
    return fn ? p.then(fn) : p
}

function flushQueue() {
    if (flushPending) return
    flushPending = true

    nextTick(flushJobs)

}

function flushJobs() {
    flushPending = false
    let job: any;
    while ((job = queue.shift())) {
        job && job()
    }
}