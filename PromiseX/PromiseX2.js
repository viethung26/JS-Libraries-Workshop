class PromiseX extends Object {
    constructor(executor) {
        super()
        Object.defineProperty(this.__proto__, "all", {
            value: [],
            enumerable: false,
            configurable: false,
        })
        this.status = "pending"
        executor(this.resolve, this.reject)
    }
    reject = rejected => {
        if(this.error) {
            this.error(rejected)
            this.status = "resolved"
        }
    }
    resolve = fulfilled => {
        if(this.all.length > 0) {
            const cb = this.all.shift()
            this.resolve(cb(fulfilled))
            this.status = "resolved"
        }
    }
    then(callback) {
        this.all.push(callback)
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
    setTimeout(()=> {
        return "asdfad"
    }, 3000)
    
}).then(value3 => {
    console.log("value-3: ", value3)
}).catch(error => {
    console.log("error", error)
})