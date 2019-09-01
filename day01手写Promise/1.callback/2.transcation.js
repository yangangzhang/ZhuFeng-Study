// React 事务
// 开始的时候 做某件事 结束的时候再做某件事
// 对当前核心函数,做包装
/* const perform= (anymethod,wrappers) => {
  wrappers.forEach(wrap => {
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
]) */

const perform = (anyMethod,wrappers) => {
  wrappers.forEach(wrap => {
    wrap.initialize();
  });
  anyMethod();
  wrappers.forEach(wrap => {
    wrap.close();
  });
}

perform(()=> {
  console.log('核心方法');
},[
  {
    initialize() {
      console.log('初始化');
    },
    close() {
      console.log('关闭');
    }
  }
])