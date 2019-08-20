let fs = require('fs');

// 如果需要改造成promise,就先将回调的方法,改造成promise
function readFile(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
/**
 * 链式调用 
 * 1. 如果返回一个普通值,会走下一个then的成功
 * 2. 如果抛出错误  会走then失败的方法
 * 3. 如果是promise 就让promise执行采用他的状态
 * 4. 是返回了一个新的Promise 来实现链式调用
 */
readFile('./name.txt', 'utf8').then(data => {
 return readFile(data,'utf8')
}).then(data=> {
  console.log(data);
},err=> {
  console.log(err);
  
})

/**
 * promise的链式调用
 * 1. 普通值表示bushipromise,也不是错误
 * 2. 如果返回的是一个promise name这个promise会执行,并且采用他的状态
 */
// readFile('./name.txt','utf8').then(data=> {
//   return data
// },err => {
//   console.log('e'+err);

// }).then(data => { //想让下一个then 走失败 ,需要1)返回一个失败的promise,抛出一个异常.
//   console.log(data);
//   return new Promise((resolve,reject)=> {
//     resolve('success')  
//   })
//   // throw new Error('err');
// }).then(data=> {
//   console.log(data);

// },err=> {
//   console.log('err--'+err);

// })






// 原生的方法 都是通过函数的第一个参数来控制
// fs.readFile('./name.txt','utf8',(err,data)=> {
//   if(err) {
//     return console.log(err);
//   }
//   fs.readFile(data,'utf8',(err,data)=> {
//     if(err) {
//       return console.log(err);
//     }
//     console.log(data);

//   })
// })