let Promise = require('./promise')
function fn() {
  // throw new Error('err')
  return new Promise((resolve,reject)=> {
    reject('err')
  })
}

Promise.try(fn).catch(err=> {
  console.log(err);
})