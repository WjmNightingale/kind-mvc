class ButtonComponent {
    constructor() {
        console.log('这是类的构造函数')
    }
    //创建组件容器
    createWrapper(string) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = string
        return wrapper
    }
    //根据数据变化更改组件状态
    setState(newState) {
        let oldView = this.wrapper
        this.state = {...newState}
        this.wrapper = this.renderElement()
        if (this.update) {
            this.update(this.wrapper,oldView)
        }
    }
    //组件初始化以及组件因数据变动再次渲染
    renderElement() {
        this.wrapper = this.createWrapper(this.rendder())
        const plus = this.wrapper.querySelector('.plus')
        const minus = this.wrapper.querySelector('.minus')
        const clean = this.wrapper.querySelector('.clean')
        if (this.onClick) {
            plus.addEventListener('click',this.onClick.bind(this,'plus'),false)
            minus.addEventListener('click',this.onClick.bind(this,'minus'),false)
            clean.addEventListener('click',this.onClick.bind(this,'clean'),false)
        }
        return this.wrapper
    }
    render() {
        //返回一个模板字符串
        //可被子类覆盖重写
    }
}