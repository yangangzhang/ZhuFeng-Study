const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
// promise处理函数
const resolvePromise = (promise2, x, resolve, reject) => {
  //处理x的类型,来决定是调用resolve还是reject
  console.log(promise2,x,resolve,reject);
  
  resolve(x) //如果返回值是个数值,直接返回此值
}
class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // 1. then方法调用后应该返还一个新的promise
    let promise2 = new Promise((resolve, reject) => {
      // 2. 应该在返回的promise中 取到上一次的状态, 来决定这个promise2是成功还是失败
      if (this.status === FULFILLED) {
        // 让then中的方法执行,拿到他的返回值
        // 4. 当前onFulfilled,onRejected不能在当前的上下文执行,为了确保promise2存在
        setTimeout(() => {
          try { //3. 捕获异常 (如果链式调用中抛出异常throw new Error('err'))
            let x = onFulfilled(this.value);
            //  console.log(promise2); // 5.在当前作用域下拿不到promise2,编程异步可以等待new完之后拿到promise2
            // 4.在外部处理x返回值是什么
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
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

module.exports = Promise;