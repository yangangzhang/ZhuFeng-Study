
let Promise = require('./promise')

// 如果一个promise then的方法中返回了一个普通值

const p = new Promise((resolve,reject)=>{
    // resolve(new Promise((resolve,reject)=>{
        // setTimeout(()=>{
            resolve('hello')
            // reject('hello')
        // },1000)
    // }))
    
})
let promise2 = p.then(data=> {
    return 1000
})
promise2.then(data => {
    console.log(data);
},err=> {
    console.log(err);
})
// promise.finally 最终的 无路如何都执行 如果返回一个promise  会等待这个promise执行完成
// Promise.try() ? 可以捕获同步异常和异步异常 
// Promise.resolve(123).finally(()=>{
//     console.log('finally');
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{resolve()},3000)
//     })
// }).then(err=>{
//     console.log(err)
// })

