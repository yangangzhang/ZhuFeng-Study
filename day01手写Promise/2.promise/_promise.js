const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const isPromise = value => {
  if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
    return typeof value.then === 'function'
  }
  return false
}
const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    return reject(new TypeError(`Chaining cycle detected for promise #<Promise>`));
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return;
          called = true
          reject(r)
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true
      reject(e);
    }
  } else {
    resolve(x);
  }
};
class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
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
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2;
  }
  catch (errCallback) {
    return this.then(null, errCallback)
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  all(promises) {
    return new Promise((resolve, reject) => {
      let arr = []
      let i = 0;
      let processData = (index, data) => {
        arr[index] = data;
        if (++i === promises.length) {
          resolve(arr)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        let current = promises[i];
        if (isPromise(current)) {
          current.then(data => {
            processData(i, data)
          }, reject)
        } else {
          processData(i, current)
        }
      }
    })
  }
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const current = promises[i];
        if (isPromise(current)) {
          current.then(() => {
            resolve(current)
          }, err => {
            reject(err)
          })
        } else {
          resolve(current)
        }
      }
    })
  }
  finally(callback) {
    return this.then(val => {
      return Promise.resolve(callback()).then((value) => {
        return val
      })
    }, err => {
      return Promise.resolve(callback()).then(() => {
        throw err
      })
    })
  }
  
}



Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject
  })
  return dfd;
}
module.exports = Promise;