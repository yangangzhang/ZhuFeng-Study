// 观察者模式 基于 发布订阅 模式

/* class Sbuject {  // 1.被观察者  小宝宝
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
s.setState('不开心了')  // 4.被观察者修改状态 */

class Subject {  //被观察者
  constructor () {
    this.arr = [];
    this.state = '我很开心'
  }
  attach(o) {
    this.arr.push(o);
  }
  setState(newState) {
    this.state = newState;
    this.arr.forEach(o => o.update(newState));
  }
}

class Observer { //观察者
  constructor(name) {
    this.name = name;
  }
  update(newState) {
    console.log(this.name + '小宝宝:' + newState);
    
  }
}


let s = new Subject('小宝宝');
let o1 = new Observer('我');
let o2 = new Observer('我媳妇');
s.attach(o1)
s.attach(o2)
s.setState('我不开心了')