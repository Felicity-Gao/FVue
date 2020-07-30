class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm
    this.$fragment = this.node2Fragment(this.$el)
    this.compiler(this.$fragment)
    this.$el.appendChild(this.$fragment)
  }
  node2Fragment(el) {
    let fragment = document.createDocumentFragment()
    let child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compiler(node) {
    Array.from(node.childNodes).forEach(node => {
      if (node.nodeType == 1) {
      } else if (this.isInter(node)) {
        this.compilerText(node)
      }
      if (node.children && node.childNodes.length > 0) {
        this.compiler(node)
      }
    })
  }
  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/g.test(node.textContent)
  }
  compilerText(node) {
    node.nodeValue = this.getValue(RegExp.$1)
  }
  getValue(val) {
    return val.split('.').reduce((a, c) => {
      return a[c]
    }, this.$vm.$data)
  }
}