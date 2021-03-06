# 从0到1完美诠释异步编程

* 掌握高阶函数的使用,使用高阶函数解决异步问题

* 掌握发布订阅模式和观察者模式

* 掌握promise核心应用,使用promise解决异步编程问题
* 实现一个完整的promise库
* 扩展promise中常见方法,all,race,finally...
* 掌握generator的使用以及co库的应用
* 异步终极解决方案async+await

# 关于函数

## 什么是高阶函数

1. 一个函数的参数,是一个函数(回调)
2. 一个函数返回一个函数(拆分/匿名函数)

## before函数

把核心代码提取出来,在外面增加功能

```js
// 重写原型上的方法
Function.prototype.before = function(beforeFn) {
  return (...args) => {  //箭头函数中没有this指向,没有arguments,所以会向上级作用域查找,
    beforeFn();
    this(...args);
  }
}

// AOP 切片 装饰
const say = (...args)=> {
  console.log('说话',args);
}

let newSay = say.before(() => {
  console.log('您好');
})
let newSay1 = say.before(() => {
  console.log('天气很好');
})
newSay(1,2,3)
newSay1()
```

- `say`函数是核心函数,在函数的原型上添加的方法,所有的函数都会共有这个方法.
- `beforeFn`是调用中`say.before(()=>{})`箭头函数,也就是`一个函数的参数,是一个函数`
- 函数原型上的`before`方法`return`一个函数,也就是一个函数返回一个函数.
- 因为箭头函数没有this指向,所以say调用before方法时,this指向say,
- 因为箭头函数没有`arguments`参数,所有所传参数向上查找也就是`say`函数上的参数`...args`

## React事务

开始的时候 做某件事 结束的时候再做某件事

```
/**
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 */
```

对当前核心函数,做包装,核心函数是`anyMethod`,在它的外层可以嵌套无限层包装的函数,一层包装中包括

`initialize`初始化方法和`close`方法,函数执行时,先执行初始化方法,再执行核心函数方法,最后执行关闭方法.

```js
const perform= (anymethod,wrappers) => {
  wrappers.forEach(wrap => { //wrappers是一个数组
    wrap.initilizae();
  });
  anymethod();
  wrappers.forEach(wrap => {
    wrap.close();
  });
}

perform(() => {
  console.log('说话');
},[
  {  // wrapper
    initilizae(){
      console.log('您好');
    },
    close() {
      console.log('再见');
    }
  },
  {  // wrapper2
    initilizae(){
      console.log('您好2');
    },
    close() {
      console.log('再见2');
    }
  }
])
```

## 柯里化函数

 柯里化: 就是将一个函数拆分成多个函数

高阶函数中包含 柯里化  可以保留参数

1. 判断类型` Object.prototype.toString.call()` 

```js
const checkType = (type,content) => {
    return Object.prototype.toString.call(content) === `[object ${type}]`
}
console.log(checkType('String','123'));
```

判断类型实现

```js

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
```

2. 函数柯里化怎么实现

通用的柯里化函数

```js
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
let r = curring(add)(1)(2)(3,4)(5)
console.log(r);
```

3. 对判断类型的方法进行改造

```js
const checkType = (type,content) => {
  return Object.prototype.toString.call(content) === `[object ${type}]`
}
let types = ['Number','String','Boolean']
let utils = {}  
types.forEach(type => {
  utils['is' + type] = curring(checkType)(type)  //这里使用上一步中的curring方法,先传入一个参数
})
console.log(utils.isString('123')); //再传入一个参数
```

## after函数

after可以生成新的函数,等待函数执行达到我的预期时执行

```js
const after = (times,fn) => {
  return () => {
    if(--times === 0) {  //函数调用三次才会执行回调
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
// lodash after
```

## 并发问题

我们希望 读取数据 node 异步 会等待同步代码都执行完成后再执行

node中,同步读取两个文件,由于不知道哪个先读取完,哪个后读取完,同步执行时代码未运行完成,存储对象`school`不能获取到读取的文件,如下:

```js
const fs = require('fs');

let school = {}
// 并发的问题 如何解决 计数器
fs.readFile('name.txt','utf8',(err,data)=> {
  school['name'] = data
})
fs.readFile('age.txt','utf8',(err,data)=> {
  school['age'] = data
})
console.log(school);  // {}
```

解决并发问题方法: 

1. 计数器

通过上面的`after`函数,定义执行次数,执行两次以后,读取`school`对象.

```js
const after = (times,fn) => () => --times === 0 &&  fn();

let newAfter = after(2,() => {
  console.log(school);
  
})

fs.readFile('name.txt','utf8',(err,data)=> {
  school['name'] = data;
  newAfter();
})
fs.readFile('age.txt','utf8',(err,data)=> {
  school['age'] = data;
  newAfter();
})
```

2. 使用发布订阅模式

## 发布订阅模式

把订阅的事件存储到数组中可以订阅多个事件,只要发布者触发事件,执行函数,订阅者就会接收到

* 发布和订阅直接是没有关系的,订阅将要订阅的事件存储在一个空间中(数组),发布者在存储空间中发布事件.

```js
const fs = require('fs');

let school = {}
let e = {
  arr: [],
  on(fn) {
    this.arr.push(fn)
  },
  emit() {
    this.arr.forEach(fn => fn())
  }
}
e.on(() => {  // 订阅
  console.log('ok');
})
e.on(() => {
  if(Object.keys(school).length ===2){
    console.log(school);
  }
})

fs.readFile('name.txt','utf8',(err,data)=> {
  school['name'] = data;
  e.emit(); //发布
})
fs.readFile('age.txt','utf8',(err,data)=> {
  school['age'] = data;
  e.emit();
})
```

订阅者订阅一个事件->只要`school`中的长度等于2,那么就输出数据.

发布者遍历事件数量,发布一次就将遍历的事件执行一次,供订阅者订阅.

## 观察者模式

 观察者模式 基于 发布订阅 模式

例如:我和我媳妇要观察小宝宝,小宝宝一发生情绪变化就会立即通知给我和我媳妇他有情绪了.

```js
class Sbuject {  // 1.被观察者  小宝宝
  constructor() {
    this.arr = [];  // 存储空间  [o1,o2]
    this.state = '我很开心'  // 被观察者的一个状态
  }
  attach(o) {  // 3.接收观察者,存储在一个数组空间
    this.arr.push(o)
  }
  setState(newState) {  // 4.修改被观察者状态,通知所有观察者更新状态
    this.state = newState
    this.arr.forEach(o => o.updata(newState))
  }
}

class Observer {  // 1.观察者   我 我媳妇
  constructor(name) {
    this.name = name
  }
  updata(newState) {  // 5.观察者订阅更新状态
    console.log(this.name + '小宝宝' +newState);
    
  }
}

// 2. 实例化
let s = new Sbuject('小宝宝');  //小宝宝
let o1 = new Observer('我');
let o2 = new Observer('我媳妇')

s.attach(o1);  // 3.被观察者中添加观察者对象
s.attach(o2);
s.setState('不开心了')  // 4.被观察者修改状态
```

## 手写Promise

* [Promises/A+](https://promisesaplus.com/)

* [Promise A+中文翻译](https://juejin.im/post/5b6161e6f265da0f8145fb72)

### 什么是Promise
写一个普通的Promise前要先知道什么是Promise:

* Promise是一个类
  1. 每次new 一个Promise 都要传递一个执行器,执行器是立即执行的(只要new Promise就执行)
  2. 执行器函数中有两个参数 resolve,reject
  3. 默认Promise 三个状态 pendding => resolve 表示成功了;reject 表示失败了
  4. 如果一旦成功了 不能改变成失败;一旦失败了,不能再成功了;只有当前状态是pendding时才可以更改状态
  5. 每个Promise都有一个then方法

```js
//! 3.默认Promise三个状态: pendding,fulfiled,reject
const PENDDING = 'pendding';  // 等待
const FULFILLED = 'fulfilled';  // 成功
const REJECT = 'reject';  // 失败

class Promise {
  constructor(executor) {
    
    this.value = undefined;  //成功的信息
    this.reason = undefined; //失败的信息
    this.status = PENDDING;  //状态值
    //! 2.执行器中有两个参数 resolve,reject
    let resolve = (value) => { 
      //! 4.只有当前状态是pendding时才可以更改状态
      if (this.status === PENDDING) {
        this.value = value;
        this.status = FULFILLED
      }
    }
    let reject = (reason) => {
      if (this.status === PENDDING) {
        this.reason = reason;
        this.status = REJECT
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
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECT) {
      onReject(this.reason)
    }
    if (this.status === PENDDING) {

    }
  }
}

// 导出当前类 commonjs定义方式
module.exports = Promise
```

使用:

```js
let Promise = require('./promise')
let p = new Promise((resolve, reject) => {
    resolve('我有钱')
    // reject('我没钱')
    // throw new Error('失败');  //如果抛出异常,也会执行失败
})
// 没有完全解决回调问题
p.then(data => {  //成功的回调
  console.log('success' + data);
}, err => {  // 失败的回调
  console.log('err' + err);
})
```
### Promise的异步调用问题
* 此时的Promise类是一个同步执行函数,当进行一步执行时就无法执行了,而且根据规范中**一个promise中可以执行多个then方法**.

```js
let Promise = require('./promise')
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('我有钱')
    // reject('我没钱')
    // throw new Error('失败');  //如果抛出异常,也会执行失败
  }, 1000);
})
// 没有完全解决回调问题
p.then(data => {  //成功的回调
  console.log('success' + data);
}, err => {  // 失败的回调
  console.log('err' + err);
})
p.then(data => {  //成功的回调
  console.log('success' + data);
}, err => {  // 失败的回调
  console.log('err' + err);
})
p.then(data => {  //成功的回调
  console.log('success' + data);
}, err => {  // 失败的回调
  console.log('err' + err);
})
```

执行结果:没有执行结果

原因:是因为setTimeout是异步执行,Premise处于pendding状态,无法返回结果,通过发布订阅模式,定义当结果为成功` this.onResolvedCallbacks = [];`的存储空间,和当结果为失败`this.onRejectCallbacks = [];`的存储空间,存储多次then方法中的执行函数(也就是订阅),当异步函数执行时也就是发布者发布时,立即执行订阅的方法.

```js
//! 3.默认Promise三个状态: pendding,fulfiled,reject
const PENDDING = 'pendding';  // 等待
const FULFILLED = 'fulfilled';  // 成功
const REJECT = 'reject';  // 失败

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
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECT) {
      onReject(this.reason)
    }
      //* 判断状态为等待状态时,也就是异步执行发布订阅
    if (this.status === PENDDING) {
      this.onResolvedCallbacks.push(() => {  //* 订阅
        //* 使用箭头函数是因为在这个函数中还可以做一些其他的事情
        // todo...
        onFulfilled(this.value)
      })
      this.onRejectCallbacks.push(() => {
        onReject(this.reason)
      })
    }
  }
}

// 导出当前类 commonjs定义方式
module.exports = Promise
```

### Promise的链式调用
* 原理
1. 如果返回一个普通值,会走下一个then的成功
2. 如果抛出错误  会走then失败的方法
3. 如果是promise 就让promise执行采用他的状态
4. 是返回了一个新的Promise 来实现链式调用

* node中读取多个文件,原生的方法 都是通过函数的第一个参数来控制

```js
let fs = require('fs');
fs.readFile('./name.txt','utf8',(err,data)=> {
  if(err) {
    return console.log(err);
  }
  fs.readFile(data,'utf8',(err,data)=> {
    if(err) {
      return console.log(err);
    }
    console.log(data);

  })
})
```

* 改造成promise

如果需要改造成promise,就先将回调的方法,改造成promise

```js
function readFile(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
//链式调用 
readFile('./name.txt', 'utf8').then(data => {
 return readFile(data,'utf8')
}).then(data=> {
  console.log(data);
},err=> {
  console.log(err);
})
```

* 手写实现其原理

1. 如果返回一个普通值,会走下一个then的成功
2. 如果抛出错误  会走then失败的方法
3. 如果是promise 就让promise执行采用他的状态
4. 是返回了一个新的Promise 来实现链式调用

基于上面的第6步继续写

```js
//! 3.默认Promise三个状态: pendding,fulfiled,reject
const PENDDING = 'pendding';  // 等待
const FULFILLED = 'fulfilled';  // 成功
const REJECT = 'reject';  // 失败
//* promise的处理函数
//! 10.x可能是个普通值,可能是个promise
const resolvePromise = (promise2, x, resolve, reject) => {
  //* 处理x的类型,来决定是调用resolve还是reject
  //! 12.自己等待自己,会进入死循环,报错,进行判断
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  //! 13.判断x 是不是一个普通值, 先认为你是一个promise
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    //! 14.可能是promise 如何判断是不是promise ,通过then判断
    try { //! 16.取then的时候有可能抛出异常,Objec.defineProperty()
      let then = x.then; //! 15.看一看有没有then方法
      let called; //! 18.默认没有调用成功和 失败,如果调用了就返回,防止多次调用
      //* 判断then是不是一个方法
      if(typeof then === 'function') { // {then:function(){}}
        // 是promise
        // x.then(()=>{},()=>{}) //* 不能这样写
        then.call(x,y=> {  // 如果是一个promise,就采用这个promise的结果
          if(called) return
          called = true;
          //! 17.y 有可能还是一个promise  实现递归解析
          resolvePromise(promise2,y,resolve,reject)  
        },r=>{
          if(called) return
          called = true;
          reject(r)
        })
      }else {
        resolve(x)// 常量直接抛出去即可
      }
    } catch (e) {
      if(called) return
      called = true;
      reject(e);  //取then抛出异常,就报错
    }

  } else {
    resolve(x) //! 13.不是promise,就是普通值了,直接返回
  }
    
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
	//! 19.可选参数,如果没有传onFulfilled,onReject就给一个默认参数即可
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val=>val;
    onReject = typeof onReject === 'function' ? onReject : err=>{throw err};

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
```

使用

```js

let Promise = require('./promise')
/**
 * 链式调用 
 * 1. 如果返回一个普通值,会走下一个then的成功
 * 2. 如果抛出错误  会走then失败的方法
 * 3. 如果是promise 就让promise执行采用他的状态
 * 4. 是返回了一个新的Promise 来实现链式调用
 */
const p = new Promise((resolve,reject)=>{
    // resolve(new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('hello')
            // reject('hello')
        },1000)
    // }))
    
})
// let obj = {}
// Object.defineProperty(obj,'then', {
//     get() {
//         throw new Error('失败')
//     }
// })
let promise2 = p.then(data=> {
    return new Promise((resolve,reject)=> {
        setTimeout(() => {
            resolve('222')
        }, 1000);
    })
})
promise2.then(data => {
    console.log(data);
},err=> {
    console.log(err);
})
```

### 测试写的Promise是否符合规范

全局安装测试插件

```js
npm i promises-aplus-tests -g
```

在要测试的代码中加入如下代码:

```js
//! 20.测试Promise是否符合规范
Promise.deferred = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject
  })
  return dfd;
}
```

开始测试:

```js
promises-aplus-tests promise.js
```

![测试成功.png](https://upload-images.jianshu.io/upload_images/13505073-3e3a867d88d48b2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### resolve了一个新的promise问题

```js
const Promise = require('./promise.js')
const p = new Promise((resolve,reject)=> {
  resolve(new Promise((resolve,reject)=> {
    setTimeout(() => {
      resolve('data')
    }, 1000);
  }))
})
p.then(data=> {
  console.log(data);
},err=> {
  console.log(err);
})
```

返回的结果是一个promise等待对象,也就是resolve的值是一个新的promise,会等到这个内部的promise完成

需要给value值加一个判断是否是Promise实现递归解析

```js
let resolve = value => {
//! 21.如果一个promise resolve了一个新的promise 会等到这个内部的promise完成
  if(value instanceof Promise) {
    return value.then(resolve,reject)  //和resolvePromise功能是一样的
  }
  ...
 }
```

### catch方法

```js
const Promise = require('./promise.js')
const p = new Promise((resolve,reject)=> {
  resolve(new Promise((resolve,reject)=> {
    setTimeout(() => {
      resolve('data')
    }, 1000);
  }))
})
p.then(data=> {
  throw new Error('err')
},err=> {
  console.log(err);
}).catch(err=> {
  console.log(err);
}).then(data=> {
  console.log(data);
})
```

catch方法其实就是一个没有成功的then,并不会影响后续then方法的执行

在我们的库中加入catch方法

```js
catch(errCallback) {  //! 22.没有成功的then
    return this.then(null,errCallback)
  }
```

### Promise的静态方法

有的时候我们为了方便调用,可以直接调用类上的成功失败方法

```js
Promise.resolve(123).then(data=> {
  console.log(123);
})
```

```js
Promise.reject(123).then(null,err=> {
  console.log(err);
})
```

实现:在执行方法时返回了一个新的promise

```js
  static resolve(value) {  //! 23. 创建了一个成功的promise
    return new Promise((resolve,reject)=> {
      resolve(value);
    })
  }
  static reject(value) { //! 24.创建了一个失败的promise
    return new Promise((resolve,reject)=> {
      reject(value);
    })
  }
```

### all方法

1. 全部完成才算完成,如果有一个失败了就失败了
2. 处理多个异步的并发问题
3. 是按照顺序执行的

```js
//* 判断是不是Promise
const isPromise = value => {
  if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
    return typeof value.then === 'function'
  }
  return false
}
Class Promise {
    ...
static all(promises) {  //! 25.实现all方法
    return new Promise((resolve, reject) => {
      let arr = [];  //存放最终结果的
      let i = 0;
      let processData = (index, data) => { //处理数据
        arr[index] = data; //将数据放到数组中,成功的数量和传入的数量相等的时候将结果抛出去即可
        if (++i === promises.length) {
          resolve(arr)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        const current = promises[i];  //获取当前的每一项
        if (isPromise(current)) { //如果是promise .. 
          current.then(data => {
            processData(i, data)
          }, err => reject)
        } else {
          processData(i, current)
        }
      }
    })
  }
}
```

使用:

```js
const Promise = require('./promise.js')
let fs = require('fs').promises
/**
 * promise.all
 * 1. 全部完成才算完成,如果有一个失败了就失败了
 * 2. 处理多个异步的并发问题
 * 3. 是按照顺序执行的
 */
Promise.all(
  [fs.readFile('./name.txt', 'utf8'),

  fs.readFile('./age.txt', 'utf8'),1, 2, 3,]
).then(data => {
  console.log(data);
})
```

