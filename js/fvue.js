class FVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    this.observer(this.$data)
    new Compiler(this.$options.el, this)
  }
  observer(data) {
    if (!data || typeof data !== 'object') {
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReceiver(data, key, data[key])
      // 代理
      this.proxyData(key)
    })
  }
  defineReceiver(obj, name, val) {
    this.observer(val) // 递归循环嵌套对象
    const dep = new Dep()
    Object.defineProperty(obj, name, {
      get() {
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set(newValue) {
        if (newValue !== val) {
          val = newValue
          dep.notify()
        }

      }
    })
  }
  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(newValue) {
        this.$data[key] = newValue
      }
    })
  }
}

// 依赖收集
class Dep {
  constructor() {
    this.watchers = []
  }
  addDep(watcher) {
    this.watchers.push(watcher)
  }
  notify() {
    this.watchers.forEach(watcher => {
      watcher.update()
    })
  }
}
class Watcher {
  constructor(vm, key) {
    Dep.target = this
    this.vm = vm
    this.key = key
  }
  update() {
    console.log(this.key + '更新了')
  }
}