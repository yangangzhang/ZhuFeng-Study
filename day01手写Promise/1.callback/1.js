// 高阶函数
// 1. 一个函数的参数 是一个函数(回调)
// 2. 一个函数返回一个函数(拆分函数)


// 函数的before
// 希望将核心的逻辑提取出来,在外面增加功能

// // 重写原型上的方法
// Function.prototype.before = function(beforeFn) {
//   return (...args) => {  //箭头函数中没有this指向,没有arguments会向上级作用域查找,
//     beforeFn();
//     this(...args);
//   }
// }
// Function.prototype.after = function(afterFn) {
//   return (...args) => {
//     this(...args);
//     afterFn();
//   }
// }
// // AOP 切片 装饰
// const say = (...args)=> {
//   console.log('说话',args);
// }
// let newSay = say.before(() => {
//   console.log('您好');
// })
// let newSayAfter = say.after(() => {
//   console.log('天气很好');
// })
// newSay(1,2,3)
// newSayAfter()


// Function.prototype.aop = function (beforeFn,afterFn) {
//   return (...args) => {
//     beforeFn();
//     this(...args);
//     afterFn();
//   }
// }
// const origin = (...args) => {
//   console.log('我是目标函数',args);
// }

// const originBefore = origin.aop(()=>{
//   console.log('我是before方法');
// },()=> {
//   console.log('我是after方法');

// })
// originBefore(1,2,3)

function aopFun(orginFn, beforeFn, afterFn) {
  return (...args) => {
    beforeFn(...args);
    orginFn(...args);
    afterFn();
  }
}

const orgin = (...args) => {
  console.log('我是目标函数', ...args);
}
const newOrgin = aopFun(orgin, () => {
  console.log('我是在函数前执行');
}, () => {
  console.log('我在函数后执行');
})

newOrgin(1, 2, 3)