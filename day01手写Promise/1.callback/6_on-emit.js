// 发布订阅模式
const fs = require('fs');

let school = {}

/* 
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
*/

let e = {
  arr: [],
  on(fn) {  //订阅
    this.arr.push(fn)
  },
  emit() {  //发布
    this.arr.forEach(fn => fn());
  }
}

e.on(()=> {
  console.log('我订阅了');
})
e.on(()=> {
  if(Object.keys(school).length === 2) {
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


// 观察者模式 基于 发布订阅 模式

/**
 * 发布订阅之间并没有关系,
 * 发布者和订阅者是借助第三方空间(arr)存储事件,
 * 订阅的时候就往第三方空间里存放函数
 * 发布的时候就让第三方空间中的函数依次执行
 */


