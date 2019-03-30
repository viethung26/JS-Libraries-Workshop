class PromiseX extends Array {
    constructor(executor) {
        super()
        this.status = "pending"
        executor(this.resolve, this.reject)
    }
    reject (rejected) {
        if(this.error) {
            this.error(rejected)
            this.status = "resolved"
        }
    }
    resolve = fulfilled => {
        if(this.length > 0) {
            const cb = this.shift()
            this.resolve(cb(fulfilled))
            this.status = "resolved"
        }
    }
    then(callback) {
        this.push(callback)
        return this
    }
    catch(callback) {
        this.error = callback
        return this
    }
}

const example = new PromiseX((resolve, reject) => {
    setTimeout(() => {
        resolve("first")
    }, 3000)
})
console.log(example)
example.then(value => {
    console.log("value: ", value)
    return value + "2"
}).then(value2 => {
    console.log("value-2: ", value2)
    return "adfd"
}).then(value3 => {
    console.log("value-3: ", value3)
}).catch(error => {
    console.log("error", error)
})