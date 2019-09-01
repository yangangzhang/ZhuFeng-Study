// 生成器 生成迭代器 es6语法
// async + await
// redux-saga

//生成器函数  返回值叫迭代器 
// function* read() { 
//   yield 1; //产出
//   yield 2;
//   yield 3;
// }
// iterator 迭代器
// let it = read();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

// 将类数组转化成数组
// 类数组的定义: 1.索引 2.长度
// function add() { // ... for of 必须要给当前对象,提供一个生成器方法
  // console.log(...arguments);
  //*  ...{0:1,1:2}  对象展开Es7
  console.log([...{
    0: 1,
    1: 2,
    length: 2,
    [Symbol.iterator]:function* () {
      let index = 0;
      while(index !== this.length) {
        yield this[index++]
      }
    }
    // [Symbol.iterator]() {
    //   let len = this.length;
    //   let index = 0;
    //   // 迭代器 是有next方法,而且方法执行后需要返回value,done
    //   return {
    //     next: ()=> {
    //       return {value:this[index++],done:index===len+1}
    //     }
    //   }
    // }
  }]);


// }

// add(1, 2, 3, 4, 5)

const fs = require('fs').promises;
function* read() {
  let content = yield fs.readFile('./name.txt','utf8')
  let age = yield fs.readFile(content,'utf8')
  return age
}

// let it = read();
// it.next().value.then(data=> {
//   it.next(data).value.then(data=> {
//     let r = it.next(data)
//     console.log(r);
    
//   });
// })
function co(it) {
  return new Promise((resolve,reject) => {
    // 异步迭代需要先提供一个next方法
    function next(data) {
      let {value,done} = it.next(data);
      if(!done) {
        // 不管value是有还是没有都封装成Promise
        Promise.resolve(value).then(data=> {
          next(data)
        },err=> {
          reject(err);
        })
      }else {
        resolve(value)
      }
    }
    next();
  })
}
// let co = require('co')
co(read()).then(data=> {
  console.log(data);
})


const fs = require('fs').promises;
async function read() {
  let content = await fs.readFile('./name.txt','utf8')
  let age = await fs.readFile(content,'utf8')
  return age
}
read().then(data=> {
  console.log(data);
})