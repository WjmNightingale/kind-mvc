class Add extends ButtonComponent {
    constructor() {
        super()
        this.state = {
            name: 'JavaScript高级程序设计',
            price: 99.99,
            number: 0
        }
    }
    onClick(type) {
        switch (type) {
            case 'plus':
                let newNumber = this.state.number + 1
                this.setState({
                    number: newNumber
                })
                break;
            case 'minus':
                let newNumber = this.state.number - 1
                this.setState({
                    number: newNumber
                })
                break;
            case 'clean':
                this.setState({
                    number: 0
                })
                break;
            default:
                break;
        }
    }
    render() {
        return `
        <div class="text_1">书名：${this.state.name}</div>
        <div class="text_2">价格：${this.state.price}</div>
        <div class="text_3">数量：${this.state.number}</div>
        <button class="plus">数量加1</button>
        <button class="minus">数量减1</button>
        <button class="clean">数量清零</button>
        `
    }
}