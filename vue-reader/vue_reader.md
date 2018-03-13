# vue文档阅读笔记

## 介绍

Vue.js是一套用于构建用户界面的渐进式框架，vue被设计成可以自底向上逐层应用的组件系统.

Vue核心注重于视图层，配合现代化的工具链以及各种支持类库的使用，Vue也完全能够为复杂的单页应用提供驱动。

## 声明式渲染

Vue.js的核心是允许一个允许采用简洁的模版语法来声明式地将数据渲染进DOM系统。

## 数据与方法

当一个vue实例被创建时，它向Vue的响应式系统中加入了其data对象中能找到的所有属性，当这些属性的值发生改变时，视图就会产生“响应”,即匹配更新为新的值。

值得注意的是，只有当实例被创建时的data中存在的属性才是响应的，也就是如果一开始，你所需要的某些为空或者不存在，你设置一些初始值。

除了数据属性，Vue实例还提供了某些实例属性和方法，它们都有前缀`$`，方便和用户自定义的属性区分开来,例如：

```js
var data = {test: 'test'}
var vm = new Vue({
    el: '#example',
    data: data
})
vm.$data === data //true
vm.$el === document.getElementById('example') //true
//$watch是一个实例方法，它会监听属性的变化然后执行相应的处理函数
vm.$watch('a',function(newValue,oldValue) {
    //这个处理函数将在`a`属性发生改变时执行
})
```

## 实例生命周期钩子 === 类比小程序页面生命周期函数

每个Vue实例在创建时都要经过一系列的初始化过程--例如,需要设置数据监听、编译模版、将实例挂载到DOM并在数据发生变化时更新DOM等，在这系列过程中Vue实例也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己代码的机会。

比如最常见的`created`钩子可以用来在一个实例被创建后执行的代码

```js
new Vue({
    el: '#example',
    data: {
        test: '1'
    },
    created: function() {
        //此处的this指向vm实例
        console.log('a is:' + this.test) // a is 1
    }
})
```

另外也存在其他的生命周期钩子，如`mounted`、`updated`、`destroyed`，要注意，生命周期钩子的`this`的上下文指向调用它的Vue实例,所以不建议在选项属性或回调函数上使用箭头函数，比如`created: () => {console.log(this.a)}`or`vm.$watch('a',newValue => this.myMethod())`。因为箭头函数本身不存在this，所以箭头函数的上下文属性是和父级上下文绑定在一起的，那么`this`不会是如你预期的Vue实例,经常会导致`Uncaught TypeError: Cannot read property of undefined`or`Uncaught TypeError: this.myMetheod is not a function`

## Vue生命周期图示

![Vue生命周期图示](https://cn.vuejs.org/images/lifecycle.png)

## 模板语法

Vue.js使用了基于HTML的模板语法，允许开发者声明式地将DOM绑定至底层的Vue实例的数据，所有的Vue.js的模板都是合法的HTML。

在底层的实现上，Vue能够将模板编译成虚拟DOM渲染函数，结合响应式系统，Vue能够智能地计算出最少需要重新渲染多少组件，并把DOM操作次数减少到最少。

如果熟悉虚拟DOM并且偏爱JavaScript的原始力量，你也可以不用模板，直接写渲染render函数,使用可选的JSX语法

## 插值

文本：

1. {{}}一般用来做数据绑定：`<span>Message:{{msg}}</span>`
2. v-once指令，可只执行一次插值，后续数据发生变化时，插值处的内容不再变化:`<span v-once>这个将不会改变：{{msg}}</span>`。但是请留意，这可能会影响到该节点上其他的数据绑定。

原始HTMl：

1. 双大括号`{{}}`会将数据解释为普通文本，而非HTML代码,为了输出真正的HTML，需要使用`v-html`指令.
2. for example:

```js
//html: <p>Using v-html directive: <span v-html="rawHtml"></span></p>
var vm = new Vue({
    data: {
            ramHtml: '<span style="color:red">red</span>'
          }
})
```

特性：

1. Vue.js使用`v-bind`的指令来指定HTMl元素属性,`<div v-bind:id="dynamicId"></div>`
2. 在布尔特性的情况下，`v-bind`的作用略微不同，比如`<button v-bind:disabled="isDisabled"></button>`，如果isDisabled的值为`null、undefined、false`,则disabled这个属性不会渲染在button元素中

## JavaScript表达式

Vue.js支持JavaScript表达式,如`<div v-bind:id="'list-'+id"></div>`,or

```js
{{number + 1}}
{{ok ? 'yes':'no'}}
{{message.split('').reverse().join('')}}
```

语句和控制流不能生效，如`{{ var a = 1 }}`or`{{ if (ok) { return message } }}`

而模板中的表达式应该被放在沙盒中，只能访问一个全局变量的一个白名单，如`Math`、`Date`，不应该在模板表达式中访问全局变量

## 指令

指令（Directives）是带有`v-`前缀的特殊属性，指令属性的预期值是一个JavaScript表达式，当表达式的值发生改变时，将其产生的连带影响，响应式地作用于DOM。

### 指令参数

一些指令能够接收一个参数，在指令名称冒号后的位置上，举个栗子，`v-bind`指令可用于响应式地更新HTML属性==>`<a v-bind:href=""url>...</a>`

`v-on`指令，则用来监听DOM事件,冒号后的参数表示所监听的事件名==》`<a v-on:click="doSomething">...</a>`

### 修饰符

修饰符（Modifiers）是以半角符号`.`指明的特殊后缀，用于标明一个指令应该以特殊的方式绑定，例如，`.prevent`修饰符告诉`v-on`指令对于触发的事件调用`event.preventDefault`

## 指令缩写

`v-`前缀作为一种视觉提示，用来识别模板中`Vue`特定的特性。当你在使用`Vue.js`为现有标签添加动态行为 (dynamic behavior) 时，`v-`前缀很有帮助，然而，对于一些频繁用到的指令来说，就会感到使用繁琐。同时，在构建由`Vue.js`管理所有模板的单页面应用程序 (SPA - single page application) 时,`v-`前缀也变得没那么重要了。

### v-bind缩写 and v-on缩写

```html
<a v-bind:href="url"></a>
<a :href="url"></a>
<a v-on:click="doSomething"></a>
<a @click="doSomething"></a>
```

## 计算属性

模板内的JavaScript表达式非常便利，但是设计他们的初衷是用于简单运算的，但是在模板内放入太多的逻辑会让模板过重而且难以维护,所以对于任何复杂的逻辑，都应当使用计算属性

### 计算属性---基础例子

```html
<div id="example">
    <p>{{message}}</p>
    <p>{{computedReverseMessage}}</p>
</div>
```

```js
var vm = new Vue({
    el: '#example',
    data: {
        message: 'World',
    },
    computed: {
        computedReverseMessage: function() {
            //this指向vm实例
            return this.message.split('').reverse().join('')
        }
    }
})
```

### 计算属性缓存vs方法

计算(computed)属性是基于它们的依赖进行缓存的，计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要`message`还没有发生改变，多次访问 `computedReverseMessage` 计算属性会立即返回之前的计算结果，而不必像方法一样再次执行函数.

这就是意味着类似下面这样不存在依赖的属性值不会得到更新：

```js
computed: {
    now: function() {
        return Date.now()
    }
}
```

我们为什么需要缓存？假设我们有一个性能开销比较大的的计算属性 A，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 A 。如果没有缓存，我们将不可避免的多次执行 A 的 getter,而有了缓存的话，其他依赖于A的计算属性则可轻易计算出来

### 计算属性VS侦听属性

`Vue.js`提供了一种更通用的的方式来观察和响应Vue实例上的数据变动：侦听属性（watch）.当你有一些数据需要随着其他数据变动而变动时，开发者很容易滥用`watch`--特别是如果之前有过angularJS的使用经验.然而，通常更好的做法应该是使用计算属性而不是命令式地`watch`回调。

```html
<div id="demo"></div>
```

```js
//  watch监听属性变化
var vm = new Vue({
    el: '#demo',
    data: {
        firstName: 'Tom',
        lastName: '.mot',
        fullName: 'Tom.mot'
    },
    watch: {
        firstName: function(val) {
            this.fullName = val + '--' + this.lastName
        },
        lastName: function(val) {
            this.fullName = this.firstName + '--' + val
        }
    }
})
```

上面代码是命令式且重复的。将它与计算属性的版本进行比较：

```js
var vm = new Vue({
    el: '#demo',
    data: {
        firstName: 'Tom',
        lastName: '.mot',
    },
    computed: {
        fullName: function() {
            return this.firstName + '--' + this.lastName
        }
    }
})
```

### 计算属性的setter

计算属性默认只有getter，不过如果有必要的话你也可以自行设置setter

```js
computed: {
    fullName: {
        //getter
        get: function() {
            return this.firstName + '**' + this.lastName
        },
        set: function(val) {
            val = val.split('').join('*-*')
            this.firstName = val
            this.lastName = val
        }
    }
}
```

## 侦听器--watch

虽然通过之前的一个例子知道，在大部分情况下，能够缓存的计算属性相比侦听器是更合适的，但如果需要在数据变化时执行异步操作或者开销较大的操作时，给属性通过`watch`增添一个监听器则是更好的选择

```html
<div id="watch-demo">
<p>
Ask a yes/no question:
<input v-model="question">
</p>
<p>{{answer}}</p>
</div>
```

```js
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
var watch = new Vue({
    el: 'watch-demo',
    data: {
        question: '',
        answer: 'I cannot give you an answer until you ask a question!'
    },
    watch: {
        //如果'question'发生改变,这个函数就会运行
        question: function(newQuestion,oldQuestion) {
            this.answer = 'Waiting for you to stop typing...'
            this.getAnswer()
        }
    },
    methods: {
        getAnswer: _.debounce(
            function() {
                if(this.question.indexOf('?' === -1) {
                    this.answer = 'Questions usually contain a question mark.'
                })
            }
        )
    }
})
```