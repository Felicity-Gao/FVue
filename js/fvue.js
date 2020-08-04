class FVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = options.el
    if (this.$el) {
      this.proxyData(this.$data)
      // 监听器
      new Observer(this.$data, this)
      // 编译器
      new Compiler(this.$el, this)
    }
  }
  proxyData(data) {
    for (const key in data) {
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
}