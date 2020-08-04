class Compiler {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 把节点保存为文档碎片
    this.fragment = this.node2fragment(this.el)
    // 编译文档
    this.compiler(this.fragment)
    // 把编译好的节点放回到根节点
    this.el.appendChild(this.fragment)
  }
  isElementNode(el) {
    return el.nodeType === 1
  }
  node2fragment(el) {
    let f = document.createDocumentFragment();
    let childNodes;
    while (childNodes = el.firstChild) {
      f.appendChild(childNodes)
    }
    return f
  }
  compiler(el) {
    let children = el.childNodes;
    [...children].forEach(child => {
      if (child.nodeType == 1) {  // 元素节点
        this.compilerElement(child)
      } else if (this.isInter(child)) {
        this.compilerText(child)
      }
      // 递归循环子节点
      if (child.children && child.childNodes.length > 0) {
        this.compiler(child)
      }
    })
  }
  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/g.test(node.textContent)
  }
  compilerText(node) {
    compilerUtil.text(node, RegExp.$1, this.vm)
  }
  compilerElement(node) {
    let attributes = node.attributes;
    [...attributes].forEach((attr) => {
      let { name, value } = attr
      if (this.isDirective(name)) {
        let [, directive] = name.split('-');
        let [dirName, eventName] = directive.split(':');
        compilerUtil[dirName](node, value, this.vm, eventName)
        // 操作完成后删除属性
        node.removeAttribute(name)
      } else if (this.isSimpleEvent(name)) {
        let eventName = name.substring(1)
        compilerUtil.on(node, value, this.vm, eventName)
        // 操作完成后删除属性
        node.removeAttribute(name)
      }


    })
  }
  isDirective(str) {
    return str.startsWith('v-');
  }
  isSimpleEvent(str) {
    return str.startsWith('@')
  }
}
const compilerUtil = {
  getValue(val, vm) {
    return val.split('.').reduce((data, cur) => {
      return data[cur]
    }, vm.$data)
  },
  setValue(val, vm, target) {
    let arr = val.split('.')
    let len = arr.length - 1
    arr.reduce((data, cur, currentIndex) => {
      if (currentIndex == len) {
        data[cur] = target
      }
      return data[cur]
    }, vm.$data)
  },
  text(node, expr, vm) {
    node.textContent = this.getValue(expr, vm)
  },
  html(node, expr, vm) {
    node.innerHTML = vm.$data[expr]
  },
  model(node, expr, vm) {
    node.value = this.getValue(expr, vm)
    node.addEventListener('input', (e) => {
      this.setValue(expr, vm, e.target.value)
      console.log(vm)
    })
  },
  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr]
    node.addEventListener(eventName, fn.bind(vm), false)
  }
}