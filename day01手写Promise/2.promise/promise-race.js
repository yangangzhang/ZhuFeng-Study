let Promise = require('./promise')

let p1 = new Promise((resolve,reject)=> {
  setTimeout(() => {
    reject('ok1')
  }, 1000);
})

let p2 = new Promise((resolve,reject)=> {
  setTimeout(() => {
    resolve('ok2')
  }, 2000);
})

Promise.race([p1,p2,2]).then(data=>{
  console.log(data);
  
},err=> {
  console.log('---'+err);
})

//如何放弃某个promise的执行结果
function warp(p1){
  let fail = null;
  let p2 = new Promise((resolve,reject)=> {
    fail = reject
  })
  let p3 = Promise.race([p1,p2])
  p3.abort = fail
  return p3
}
let p = warp(new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 2000);
}))
p.abort('err')
p.then(data=> {
  console.log(data);
},err=> {
  console.log(err);
})