const Promise = require('./promise.js')
const p = new Promise((resolve,reject)=> {
  resolve(new Promise((resolve,reject)=> {
    setTimeout(() => {
      resolve('data')
    }, 1000);
  }))
})
p.then(data=> {
  throw new Error('err')
},err=> {
  console.log(err);
}).catch(err=> {
  console.log(err);
}).then(data=> {
  console.log(data);
})

/**
 * promise.finally 
 * 1. 最终无论如何都会执行
 * 2. 如果返回一个promise,会等待这个promise执行完成
 */
// Promise.resolve(123).finally(()=> {
//   console.log('finally');
//   return new Promise((resolve,reject)=> {
//     setTimeout(() => {
//       resolve()
//     }, 2000);
//   }) 
// }).then(data=> {
//   console.log(data);
// })

/**
 * Promise.try
 * 可以捕获同步异常和异步异常
 */

