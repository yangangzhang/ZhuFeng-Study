let Promise = require('./promise')

Promise.resolve('resolve').finally(()=> {
  console.log(2);
  return new Promise((resolve,reject) => {
    resolve('1')
  })
}).then(data=> {
  console.log(data);
},err=> {
  console.log(err);
})

