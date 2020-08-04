class FVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = options.el
    if (this.$el) {
      new Compiler(this.$el, this)
    }
  }
}