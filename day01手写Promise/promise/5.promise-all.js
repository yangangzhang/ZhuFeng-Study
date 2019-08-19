const Promise = require('./promise.js')
let fs = require('fs').promises
/**
 * promise.all
 * 1. 全部完成才算完成,如果有一个失败了就失败了
 * 2. 处理多个异步的并发问题
 * 3. 是按照顺序执行的
 */
const isPromise = value => {
  if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
    return typeof value.then === 'function'
  }
  return false
}
// Promise.all = function (promises) {
//   return new Promise((resolve, reject) => {
//     let arr = [];  //存放最终结果的
//     let i=0;
//     let processData = (index, data) => { //处理数据
//       arr[index] = data; //将数据放到数组中,成功的数量和传入的数量相等的时候将结果抛出去即可
//       if (++i === promises.length) {
//         resolve(arr)
//       }
//     }
//     for (let i = 0; i < promises.length; i++) {
//       const current = promises[i];  //获取当前的每一项
//       if (isPromise(current)) { //如果是promise .. 
//         current.then(data => {
//           processData(i, data)
//         }, err => reject)
//       } else {
//         processData(i, current)
//       }
//     }
//   })
// }
Promise.all(
  [fs.readFile('./name.txt', 'utf8'),

  fs.readFile('./age.txt', 'utf8'),1, 2, 3,]
).then(data => {
  console.log(data);
})
//race 有一个成功就成功 有一个失败就失败