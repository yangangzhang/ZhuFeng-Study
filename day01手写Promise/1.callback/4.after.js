// after
// after可以生成新的函数,等待函数执行达到我的预期时执行
// 方法会在调用n次之后触发一次func
/* const after = (times,fn) => {
  return () => {
    if(--times === 0) {
      fn();
    }
  }
}

let newAfter = after(3,() => {
  console.log('三次后调用');
})

newAfter();
newAfter();
newAfter();
// lodash after' */

const after = (times,callback) => {
  return () => {
    if(--times === 0) {
       callback();
    }
  }
}


let newAfter = after(3, ()=> {
  console.log('被调用三次之后执行');
})

newAfter();
newAfter();
newAfter();
