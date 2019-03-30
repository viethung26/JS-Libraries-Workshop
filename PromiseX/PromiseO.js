class PromiseX {
    constructor(executor) {
        const STATUS = Symbol('PromiseXStatus')
        const VALUE = Symbol('PromiseXValue')
        const callers = []
        let error = null
        let flag = null
        let final = null
        function debounce(fn, ms, context, value) {
            clearTimeout(flag)
            flag = setTimeout(() => {
                fn.call(context, arguments[3])
            }, ms)
        }
        
        Object.defineProperties(this, {
            [STATUS]: {
                value: "pending",
                writable: true,
                configurable: false,
            },
            [VALUE]: {
                writable: true,
                configurable: false,
            }
        })
        Object.defineProperties(this.__proto__, {
            "reject": {
                value: function(rejected) {
                    if(error) {
                        error(rejected)
                        this[STATUS] = "rejected"
                    } else if(final != null) final(fulfilled)      
                },
                configurable: true,

            },
            "resolve": {
                value: function(fulfilled) {
                    if(callers.length > 0) {
                        const cb = callers.shift()
                        if(!this[VALUE]) this[VALUE] = fulfilled
                        this.resolve(cb(fulfilled))
                    } else if(final != null) final(fulfilled)
                    this[STATUS] = "resolved"   
                },
                configurable: true,                    
            },
            "then": {
                value: function(callback) {
                    if(["resolved", "rejected"].includes(this[STATUS])) {
                        this[STATUS] = 'pending'
                        const value = callback(this[VALUE])
                        debounce(this.resolve, 10, this, value)
                    } else {
                        callers.push(callback)
                    }
                    return this
                },
                configurable: true,
            },
            "catch": {
                value: function(callback) {
                    error = callback
                    return this
                },
                configurable: true,
            },
            "finally": {
                value: function(callback) {
                    final = callback
                },
                configurable: true
            }
        })
        executor(this.resolve.bind(this), this.reject.bind(this))
    }
}
window.PromiseX = PromiseX
//// For Example
const example = new PromiseX((resolve, reject) => {
    setTimeout(() => {
        resolve("first")
    }, 1)
})
console.log(example)
example.then(value => {
    return value + "22"
}).then(value2 => {
    console.log("value-2: ", value2)
    return "asdfd"
}).then(value3 => {
    console.log("value-3: ", value3)
    return value3
}).catch(error => {
    console.log("error", error)
}).finally(final => {
    console.log("finally", final)
})
// After resolved
setTimeout(() => {
    example.then((r) =>{
        console.log('after resolve', r)
        return 'kjgjgj'
    }).then((r) =>{
        console.log('after resolve 2', r)
        return "xxx"
    })
    .then((r) =>{
        console.log('after resolve 3', r)
    })
}, 4000)