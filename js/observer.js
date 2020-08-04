class Observer {
  constructor(data) {
    this.data = data;
    this.observer(this.data)
  }
  observer(data) {
    if (data && typeof data == 'object') {
      Object.keys(data).forEach((key, index) => {
        this.defineReciver(data, key, data[key])
      })
    }
  }
  defineReciver(data, key, val) {
    // 循环递归对象
    this.observer(val)
    let dep = new Dep()

    Object.defineProperty(data, key, {
      get() {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set: (newVal) => {
        // 给新设置的值添加get,set方法
        this.observer(newVal)
        if (newVal != val) {
          val = newVal
          dep.notify()
        }
      }
    })
  }
}
// 管理watcher
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(w => w.update())
  }
}

class Watcher {
  constructor(vm, key, cb) {
    this.cb = cb
    this.vm = vm
    this.key = key
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }
  update() {
    this.cb.call(this.vm, this.vm[this.key])
  }
}