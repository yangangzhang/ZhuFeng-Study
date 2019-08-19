// 柯里化: 就是将一个函数拆分成多个函数
// 高阶函数中包含 柯里化  可以保留参数
// 判断类型 Object.prototype.toString.call()

const checkType = (type,content) => {
  return Object.prototype.toString.call(content) === `[object ${type}]`
}

console.log(checkType('String','123'));

const checkType = (type) => {
  return (content) => {
    return Object.prototype.toString.call(content) === `[object ${type}]`
  }
}
// 闭包
let types = ['Number','String','Boolean']
let utils = {}  //工具类
types.forEach(type => {
  utils['is' + type] = checkType(type)
})

console.log(utils.isString('123'));


// 函数柯里化怎么实现

const add = (a,b,c,d,e) => {
  return a + b + c + d + e
}
const curring = (fn,arr = []) => {  //空数组接收传递过来的参数合成新数组
  let len = fn.length
  return (...args) => {  //args传进来的参数
    arr = arr.concat(args);
    if(arr.length < len) {  //如果arr的长度小于函数参数的长度,则返回这个方法和arr继续等待传参
      return curring(fn,arr)
    }  
    return fn(...arr)
  }
}
// let r = curring(add)(1)(2)(3,4)(5)
// console.log(r);



//对判断类型的方法进行改造
const checkType = (type,content) => {
  return Object.prototype.toString.call(content) === `[object ${type}]`
}
let types = ['Number','String','Boolean']
let utils = {}  //工具类
types.forEach(type => {
  utils['is' + type] = curring(checkType)(type)
})
console.log(utils.isString('123'));
