//! 3.默认Promise三个状态: pendding,fulfiled,reject
const PENDDING = 'pendding';  // 等待
const FULFILLED = 'fulfilled';  // 成功
const REJECT = 'reject';  // 失败
//* promise的处理函数
//! 10.x可能是个普通值,可能是个promise
const resolvePromise = (promise2, x, resolve, reject) => {
  //* 处理x的类型,来决定是调用resolve还是reject
  resolve(x) //如果返回值是个数值,直接返回此值
}
class Promise {
  constructor(executor) {

    this.value = undefined;  //成功的信息
    this.reason = undefined; //失败的信息
    this.status = PENDDING;  //状态值
    //! 6.一个promise中可以执行多次then(异步执行,相当于发布订阅模式)
    this.onResolvedCallbacks = [];
    this.onRejectCallbacks = [];
    //! 2.执行器中有两个参数 resolve,reject
    let resolve = (value) => {
      //! 4.只有当前状态是pendding时才可以更改状态
      if (this.status === PENDDING) {
        this.value = value;
        this.status = FULFILLED
        this.onResolvedCallbacks.forEach(fn => fn())  //发布, 有可能resolve在then的后面执行,此时先将方法存起来,到时候成功了,依次执行这些函数
      }
    }
    let reject = (reason) => {
      if (this.status === PENDDING) {
        this.reason = reason;
        this.status = REJECT
        this.onRejectCallbacks.forEach(fn => fn())
      }
    }

    //* 这里可能会发生一个异常(throw new Error)
    try {
      //! 1. 创建一个promise executor会立即执行
      executor(resolve, reject);
    } catch (e) {
      reject(e)
    }

  }
  //! 5.每个Promise都有一个then方法, then方法会判断当前的状态,去执行相应的方法
  then(onFulfilled, onReject) {
    //* then中有两个方法,成功(onFulfilled),失败(onReject)
    //! 7.返回promise才会有then方法,then方法调用后应该返还一个新的promise,以供连续调用
    //* 执行完new Promise里面之后才返回promise2,执行过程中,promise2是undefined,需要加一个定时器
    let promise2 = new Promise((resolve, reject) => {
      //! 8.应该在返回的promise中 取到上一次的状态, 来决定这个promise2是成功还是失败
      if (this.status === FULFILLED) {
        //! 9.捕获异常 (如果链式调用中抛出异常throw new Error('err'))
        //! 11.当前onFulfilled,onRejected不能在当前的上下文执行,为了确保promise2存在,需要异步一下
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            //! 10.在外部处理x的值
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === REJECT) {
        setTimeout(() => {
          try {
            let x = onReject(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDDING) {
        this.onResolvedCallbacks.push(() => {  //* 订阅
          //* 使用箭头函数是因为在这个函数中还可以做一些其他的事情
          // todo...
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onReject(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return promise2

  }
}

// 导出当前类 commonjs定义方式
module.exports = Promise