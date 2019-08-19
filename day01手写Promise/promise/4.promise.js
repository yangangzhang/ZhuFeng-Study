const Promise = require('./promise.js')
const p = new Promise((resolve,reject)=> {
  setTimeout(() => {
    resolve('data')
  }, 1000);
})
p.then(data=> {
  return data
},(err)=> {
  throw err
}).then(data=> {
  console.log(data);
},err=> {
  console.log(err);
  
})