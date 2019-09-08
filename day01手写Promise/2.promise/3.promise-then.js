let Promise = require('./_promise')


/**
 * 链式调用 
 * 1. 如果返回一个普通值,会走下一个then的成功
 * 2. 如果抛出错误  会走then失败的方法
 * 3. 如果是promise 就让promise执行采用他的状态
 * 4. 是返回了一个新的Promise 来实现链式调用
 */
const p = new Promise((resolve, reject) => {
    // resolve(new Promise((resolve,reject)=>{
    // setTimeout(() => {
        resolve('hello')
        // reject('hello')
    // }, 1000)
    // }))

})

let promise2 = p.then(data => {
   return 1000
},err => {
  return 'error'
})

promise2.then(data => {
    console.log(data);
}, err => {
    console.log('e:'+err);
    
})



// let obj = {}
// Object.defineProperty(obj,'then', {
//     get() {
//         throw new Error('失败')
//     }
// })
/* let promise2 = p.then(data=> {
    return new Promise((resolve,reject)=> {
       
    })
})
promise2.then(data => {
    console.log(data);
},err=> {
    console.log(err);
}) */