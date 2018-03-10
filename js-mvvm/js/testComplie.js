// compile主要做的事情是模版指令解析，将模板中的变量替换成相应的数据，进而初始化渲染页面
// 并且将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据发生改动，收到通知，更新视图
// 因为遍历解析的过程有多次操作dom节点，为提高性能和效率，
// 会先将根节点el转换成文档碎片fragment进行解析编译操作，
// 解析完成，再将fragment添加回原来的真实dom节点中
function Compile(el) {
    this.$el = this.isElementNode(el)?el:document.querySelector(el)
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
        this.$el.appendChild(this.$fragment)
    }
}
Compile.prototype = {
    init: function() {this.compileElement(this.$fragment)},
    node2Fragment: function(el) {
        var fragment = document.createDocumentFragment()
        var child
    }
}