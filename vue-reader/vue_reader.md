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

## Class绑定

操作元素的class列表和内联样式是数据绑定的一个常见需求，因为它们都是属性，所以我们可以用`v-bind`处理它们，只需要通过表达式计算出字符串结果即可，不过字符串拼接麻烦而且容易出错。因此在将`v-bind`作用于class和style时，Vue.js做了专门的增强，表达式的结果类型除了字符串以外，还可以是数组和对象。

### 对象语法

可以传给`v-bind:class`一个对象，用以动态地切换class:`<div v-bind:class="{active:isActive}"></div>`。当`isActive`为真时，div的class便是`<div class="active"></div>`

除此之外，还可以在对象中传入更多的属性来动态地切换class，甚至`v-bind:class`还可以与普通的class属性共存

```html
<div class="static" v-bind:class="{active:isActive,''text-danger':hasError}"></div>
```

```js
data: {
    isActive: true,
    hasError: false
}
```

以上结果渲染为：`<div class="static active">`。如果`hasError`为`true`的话，那么将再增加一个class: `<div class="static active text-danger"></div>`

绑定的数据对象不必内联定义在模板里,比如：

```html
<div class="static" v-bind:class="classObject"></div>
```

```js
data: {
    classObject: {
        active: true,
        'text-danger': false
    }
}
```

渲染结果同样是：`<div class="static active">`

当然，或许还会有种更合适的方式，那就是绑定一个返回对象的计算属性

```js
data: {
    isActive: true,
    error: null
},
computed: {
    classObject: function() {
        return {
            active: this.isActive && !this.error,
            'text-danger': this.error && this.error.type === 'fatal'
        }
    }
}
```

### 数组语法

同样的，我们可以把一个数组传给`v-bind:class`，以应用一个class列表

```html
<div v-bind:class="[activeClass,errorClass]"></div>
```

```js
data: {
    activeClass: 'active',
    errorClass: 'text-danger'
}
```

渲染结果为：`<div class="active text-danger"></div>`

我们还可以写三元表达式，根据条件切换`class`：`div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>`

不过，当有多个条件 class 时这样写有些繁琐。所以在数组语法中也可以使用对象语法：`<div v-bind:class="[{ active: isActive }, errorClass]"></div>`

### 用在组件上

当在一个自定义组件上使用`class`属性时，这些类将被添加到该组件的根元素上面，这个元素上已经存在的类不会被覆盖。

例如，你声明了这个组件

```js
Vue.component('my-component',{
    template: `<p class="test1 test2"></p>`
})
```

然后在使用它的时候添加一些class:`<my-component class="test3 test4"></my-component>`

最终的HTML:`<p class="test1 test2 test3 test4"></p>`

对于带数据绑定 class 也同样适用：`<my-component v-bind:class="{ active: isActive }"></my-component>`

当`isActive`为true时，HTML终将被渲染为：`<p class="test1 test2 active"></p>`

## Style(内联样式)绑定

### style对象语法

`v-bind:style`的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。css属性名可以用驼峰式（camelCase）或短横线分割（'kebab-case'，需要单引号括起来）来命名：

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div v-bind:style="{'backgrond-color': avtiveColor,'font-size': fontSize + 'px'}"></div>
```

当然，更好的写法是直接绑定一个style对象，这样代码更具备可读性

```html
<div v-bind:style="{styleObject}"></div>
```

```js
data: {
    styleObject: {
        color: 'red',
        backgroundColor: 'skyblue'
    }
}
```

### style数组语法

v-bind:style 的数组语法可以将多个样式对象应用到同一个元素上：`<div v-bind:style="[baseStyles, overridingStyles]"></div>`

### 自动添加前缀

当`v-bind:style`使用需要添加浏览器引擎前缀的 CSS 属性时，如`transform`，Vue.js 会自动侦测并添加相应的前缀。

### 多重值

从 Vue.js 2.3.0 起你可以为 `style` 绑定中的属性提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：
`<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>`
这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的`flexbox`，那么就只会渲染`display: flex`。

## 条件渲染

### v-if

在字符串模板中，比如 Handlebars，我们得像这样写一个条件块：

```html
<!-- Handlebars 模板 -->
{{#if ok}}
  <h1>Yes</h1>
{{/if}}
```

在 Vue 中，我们使用 v-if 指令实现同样的功能：`<h1 v-if="ok"></h1>`.而使用`v-else`则可以添加一个else块：`<h1 v-else>No</h1>`,Vue.js 2.1.0还新增了`vue-else-if`指令，用法参考js语法

### 在template元素上使用v-if条件渲染分组

因为`v-if`是一个指令，所以必须将它添加到一个元素上，但是如果想要切换多个元素，就需要配合`<template></template>`来使用了。

可以把一个`<template>` 元素当做不可见的包裹元素，并在上面使用 v-if。最终的渲染结果将不包含 `<template>`元素

```html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### 用key管理可复用的元素

Vue.js会尽可能高效地渲染元素，通常会复用已有的元素而不是从头开始渲染，比如，你可以允许用户再不同的登陆方式之间来回切换

```html
<template v-if="loginType === 'username'">
    <label>Username</label>
    <input placeholder="Enter your name">
</template>
<template v-else>
    <label>Email</label>
    <input placeholder="Enter your email address"></input>
</template>
```

在以上页面中，切换loginType不会清除用户已经输入的内容，因为两个模板使用了相同的元素，`<input>`不会被替换--仅仅是替换了它的`placeholder`。

但是实际上有些时候，这样的做法是不符合实际需求的，我们并不需要复用这两个元素，Vue.js提供了一种方式来表达“这两个元素是完全独立的，请不要复用它们”,为不想被复用的元素添加一个唯一值得key属性即可

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

### v-show

Vue.js另一个用于条件展示元素的选项是`v-show`命令，用法：`<h1 v-show="ok"></h1>`

相比于`v-if`，带有`v-show`的元素始终会被渲染并被保留在DOM中，`v-show`是切换元素的css属性`display`,而且要注意的是,`v-show`不支持template元素，也不支持`v-else`

### v-show VS v-if

`v-if`是真正的条件来渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

`v-if`也是惰性的，如果在初始渲染条件为假时，则什么也不做，直到条件第一次变为真时，才会开始渲染条件块；而`v-show`则是不管初始条件是什么，元素总会被渲染，并且知识简单地基于css进行切换。

一般来说，`v-if`有着更高的切换开销，而`v-show`有着更高的渲染开销，所以对于需要频繁切换的应选用`v-show`，而初始渲染开销较大的而运行时条件很少改变的，应该选用`v-if`

## 列表渲染

### v-for 数组

我们使用`v-for`指令根据一组数组的选项列表进行渲染，使用`item in items`的语法，items是源数据数组，item是数组元素迭代的别名

```html
<ul id=""test>
    <li v-for="item in items">
        {{item.message}}
    </li>
</ul>
```

```js
var vm = new Vue({
    el: 'test',
    data: {
        items: [
            {message: 'test1'},
            {message: 'test2'}
        ]
    }
})
```

渲染结果：

```html
<ul id=""test>
    <li>test1</li>
    <li>test2</li>
</ul>
```

在`v-for`块中，我们拥有对父作用域属性的完全访问权限，`v-for`还支持一个可选的第二个参数为当前的索引

```html
<ul id="test">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```js
var vm = new Vue({
    el: 'test',
    data: {
        parentMessage: 'Parent',
        items : [
            {message: 'test1'},
            {message: 'test2'}
        ]
    }
})
```

渲染结果:

```html
<ul>
    <li>Parent-0-test1</li>
    <li>Parent-1-test2</li>
</ul>
```

### v-for 对象

`v-for`指令也可以用来迭代对象属性,如：

```html
<ul id="test">
    <li v-for="(value,key,index) in object">
        {{index}}--{{key}}：{{value}}
    </li>
</ul>
```

```js
var vm = new Vue({
    el: 'test',
    data: {
        object: {
            name: 'wjm',
            gender: 'male',
            age: 24
        }
    }
})
```

渲染结果

```html
<ul id="test">
    <li>0--name:wjm</li>
    <li>1--gender:male</li>
    <li>2--age:24</li>
</ul>
```

`v-for`在遍历对象时，是按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下是一致的。

### key

当Vue.js用`v-for`正在更新已渲染过的元素列表时，它默认用"就地复用"策略，如果数据项的顺序被改变，Vue将不会移动DOM元素来匹配数据项的顺序，而是简单的复用此处的每个元素，并且确保它在特定索引下显示已经被渲染过的每个元素

这个默认模式是高效的，但是只是适用于不依赖子组件状态或临时DOM状态（例如：表单的输入值）的列表渲染输出。

为了给Vue一个提示，以便于它能够追踪每个节点的身份，从而重用和重新排序现有的元素，你需要为每项提供一个唯一的Key属性，理想的key是每项都有的且唯一的id，但它的工作方式类似于一个属性，所以你需要用 v-bind 来绑定动态值 (在这里使用简写)：

```html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

建议尽可能在使用`v-for`时提供 key，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。

因为它是 Vue 识别节点的一个通用机制，key 并不与`v-for`特别关联，key 还具有其他用途，我们将在后面的指南中看到其他用途。

## 数组更新检测

### 变异方法

Vue包含一组观察数组的方法，所以它们也将会触发视图更新，这些方法如下：

1. push()
2. pop()
3. shift()
4. unshift()
5. splice()
6. sort()
7. reverse()

### 替换数组

变异方法（mutation method），顾名思义，会改变被这些方法调用的原始数组。相比之下，也有非变异 (non-mutating method) 方法，例如：`filter()`，`concat()`，`slice()`。这些不会改变原始数组，但是总是返回一个新值，当使用非变异方法时，可以用新数组替换旧数组:

```js
example.itmes = example.items.filter(function(item) {
    return item.message.match(/Foo/)
})
```

### 注意事项

由于JavaScript的限制，Vue不能检测以下变动的数组：

1、利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
2、修改数组长度时，例如：vm.items.length = newlength

举个例子：

```js
var vm = new Vue({
    data: {
        itmes: ['a','b','c']
    }
})
vm.items[1] = 'x' //非响应式
vm.ites.length = 2 //非响应式
```

第一类问题，可以用以下两种方式实现`vm.items[indexOfItem] = newValue`的相同效果，同时触发状态更新：

```js
//Vue.set
Vue.set(vm.items,indexOfItem,newValue)
//set方法的别名（alian）是$set
vm.$set(vm.items,indexOfItem,newValue)
//Array.prototype.splice()
vm.items.splice(indexOfItem,1,newValue)
```

第二类问题，就是`splice()`来解决：`vm.items.splice(newLenght)`

同样由于JavaScript设计，Vue不能检测对象属性的添加或者删除

```js
var vm = new Vue({
    data: {
        a: 1
    }
})
//vm.a 是响应的
vm.b = 2
//vm.b 不是响应的
```

对于已经创建的Vue实例，Vue.js不能动态添加根级别的响应式属性，但是可以使用`Vue.set(object,key,value)`方法向嵌套对象添加响应式属性，如：

```js
var vm = new Vue({
    data: {
        userProfile: {
            name: 'wjm'
        }
    }
})
//通过Vue.set(object,key,value)方法添加一个新的`age`属性到嵌套的`userProfile`
Vue.set(vm.userProfile,'age',27)
//等价于
vm.$set(vm.userProfile,'age',27)
```

有时你可能需要为已有的对象赋予多个新属性，比如使用`Object.assign()`或者`_.extend()`。在这种情况下，你应该用两个对象的属性创建一个新的对象，所以当需要为已有对象添加多个响应式属性时，不要像这样：

```js
Object.assign(vm.userProfile,{
    age: 27,
    favoriteColor: 'Vue Green'
})
```

你应该这样做：

```js
vm.userProfile = Object.assign({},vm.userProfile,{
    age: 27,
    favoriteColor: 'Vue Green'
})
```

### 显示过滤/排序结果

有时，我们想要显示一个数组的过滤或者排序副本，而不实际改变或者重置原始数据，在这种情况下，可以创建返回过滤或排序数组的计算属性，比如：

```html
<ul>
    <li v-for="n in evenNumbers">
        {{n}}
    </li>
</ul>
```

```js
data: {
    numbers: [1,2,3,4,5,6]
},
computed: {
    evenNumbers: function() {
        return this.numbers.filter((number) => number % 2 === 0)
    }
}
```

在计算属性不适用的情况下（例如，在嵌套`v-for`循环中），你可以使用一个method方法：

```html
<ul>
    <li v-for="n in even(numbers)">
        {{n}}
    </li>
</ul>
```

```js
data: {
    numbers: [1,2,3,4,5]
},
methods: {
    even: function(numbers) {
        return number.filter(function(number) {
            return number % 2 === 0
        })
    }
}
```

### 一段取值范围的 v-for

`v-for`也可以用来取整数，在这种情况下，它将重复多次模板

```html
<div>
    <span v-for="n in 10">
        {{n}}
    </span>
</div>
```

### v-for搭配template使用

类似于`v-if`，你可以利用带有`v-for`的`<template>`来渲染多个元素，此时template会被循环渲染，比如：

```html
<ul>
    <template v-for="item in items">
        <li>{{item.msg}}</li>
        <li class="divider"></li>
    </template>
</ul>
```

### v-for 和 v-if

当这两个处于同一节点时，`v-for`的优先级比`v-if`要高，这就意味着`v-if`将会分别重复运行于每个`v-for`循环当中，如果你只是想为某一些节点渲染时，这种优先级机制将会非常有用：

```html
<ul>
    <li v-for="todo in todos" v-if="!todo.isComplete">
</ul>
```

上面的代码只会渲染显示未完成的todo

如果你的目的是有条件地跳过循环的话，那么可以将`v-if`置于外层元素上或者是`<template>`，如：

```html
<ul v-if="todos.length">
    <li v-for="todo in todos">
        {{todo}}
    </li>
</ul>
<p v-else>No todos left!</p>
```

### 组件的v-for

在自定义组件里，你可以像任何普通元素一样用`v-for`,值得注意的点是，在高版本的Vue.js里，key值是必须的,如

```html
<my-component v-for="item in items" :key="item.id"></my-component>
```

然而，任何数据不会自动传递到组件里，因为每个组件都有其自己的作用域，为了把迭代数据传递到组件里，我们需要使用`props`：

```html
<my-component
  v-for="(item,index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id">
</my-component>
```

不自动将`item`注入到组件里，是为了避免组件和`v-for`的紧密耦合，明确组件数据的来源能够使组件在其他场合复用。

下面是一个简单的todoList的完整例子：

```html
<div id="todo-list-example">
    <input v-model="newTodoText"
           v-on:keyup.enter="addNewTodo"
           placeholder="Add a todo"
    >
    <ul>
        <li is="todo-item"
            v-for="(todo,index) in todos"
            v-bind:key="todo.id"
            v-bind:title="todo.title"
            v-on:remove="todos.splice(index,1)"
        >
    </ul>
</div>
```

```js
Vue.component('todo-item',{
    template: `\
    <li>\
    {{title}}\
    <button @:click="$emit(\'remove'\)">X</button>\
    `,
    props: ['title']
})
var vm = new Vue({
    el: '#todo-list-example',
    data: {
        todos: [
            newTodoText: ''
            {
                id: 1,
                title: 'test1'
            },
            {
                id: 2,
                title: 'test2'
            },
            {
                id: 3,
                title: 'test3'
            }
        ],
        nextTodoId: 4
    },
    methods: {
        addNewTodo: function() {
            this.todos.push({
                id: this.nextTodoId++,
                title: this.newTodoTitle
            })
            this.newTodoTitle = ''
        }
    }
})
```

## 事件处理

在Vue.js中，可以用`v-on`监听DOM事件，并在触发时运行一些JavaScript代码，如：

```html
<div id="test">
    <button v-on:click="counter += 1">Add 1</button>
    <p>The button above has benn clicked{{counter}}times</p>
</div>
<script>
    var vm = new Vue({
        el: `#test`,
        data: {
            counter: 0
        }
    })
</script>
```

当然，更多时候事件处理逻辑会较为复杂，所以直接把JavaScript代码写在`v-on`指令中是不可行的，因此`v-on`还可以接受一个需要调用的方法的名称，如：

```html
<div id="test">
    <button v-on:click="greet">Greet</button>
</div>
<script>
    var vm = new Vue({
        el: 'test',
        data: {
            name: 'Vue.js'
        },
        methods: {
            greet: function(event) {
                alert('Hello'+this.name+'!')
                if(event) {
                    alert(event.target.tagName)
                }
            }
        }
    })
</script>
```

除了直接绑定到一个方法，也可以在内联JavaScript语句中调用

```html
<div id="test">
    <button v-on:click="say('hi')">Hi</button>
    <button @click="say('what')">What</button>
</div>
<script>
    var vm = new Vue({
        el: '#example-3',
        methods: {
            say: function(message) {
                alert(message)
            }
        }
    })
</script>
```

有时也需要在内联语句中处理访问器中的原始DOM事件，可以用特殊变量`$event`把它传入方法：

```html
<button @click="warn('Form cannot be submitted yet.',$event)">Submit</button>
```

```js
methods: {
    warn: function(message,event) {
        //现在我们可以访问原生事件对象
        if(event) event.preventDefault()
        alert(message)
    }
}
```

event.target 标识事件发生的元素
event.currentTarget 事件触发时事件处理程序所作用到的元素
event.prevenrDefault()用于取消事件默认动作，event.cancelable属性用来判断一个事件的默认动作是否可以被取消
event.stopPropagation用来阻止事件冒泡
target.addEventListener(type,listener,opttions)

```js
options = {
    //ture：表示listener(事件处理程序)会在事件发生后在捕获阶段传播到该EventTarget时触发
    capture: boolean,
    //true：表示listener在添加之后最多调用一次，且listener在调用后被自动移除
    once: boolean,
    //true：表示listener永远不会调用event.preventDefault，如果仍然试图调用客户端则会忽略它
    passive: boolean
}
target.addEventListener(type,listener,opttions)
```

### 事件修饰符

在事件处理程序中调用`event.preventDefault()`或是`event.stopPropagation()`是非成常见的需求，尽管我们可以在方法中轻松实现这一点，但是更优雅的处理方式：事件处理函数中只包含纯粹的逻辑，而不是去处理DOM事件细节。而Vue.js就为此提供了事件修饰符以解决这个问题，常见的事件修饰符(一般以`.`开头)如下：

1. `.stop` 阻止事件继续传播
2. `.prevent` 阻止默认事件行为
3. `capture` 添加事件监听器时先使用事件捕获模式，即元素自身触发的事件先在此处理，然后才交由内部元素处理
4. `.self` 只有当event.target===event.currentTarget时，才会触发事件处理函数
5. `.once` 事件处理函数只会触发一次，而且不同于其他修饰符只能对原生的DOM事件起作用，`.once`修饰符还可被用于组件事件上
6. 使用事件修饰符时，顺序异常重要，相应的代码会以同样的顺序产生，如：`v-on:click.prevent.self`会阻止所有元素的默认点击事件处理程序执行，而`v-on:click.self.prevent`只会阻止自身上触发的元素默认点击事件处理程序执行
7. Vue.js 2.3.0新增`.passive`修饰符

```html
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
<!-- 这个 .passive 修饰符尤其能够提升移动端的性能。-->
```

### 按键修饰符

在监听键盘事件时，我们经常需要检查常见的键值。Vue.js允许`v-on`在监听键盘事件时添加按键修饰符,如：

```html
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input v-on:keyup.13="submit">
```

然而，记住所有的`keyCode`是较为困难的，所以Vue为最常用的按键提供了别名：

```html
<input v-on:keyup.enter="submit">
```

常见的按键别名：

1. `.enter`
2. `.tab`
3. `delete` 删除和退格键
4. `.esc`
5. `.space`
6. `.up`
7. `.down`
8. `.left`
9. `right`

可以通过全局的 `config.keyCode` 对象自定义按键修饰符别名,比如：

```js
Vue.config.keyCode.f1=112
```

### 自动匹配按键修饰符

Vue.js 2.5.0新增，可以直接将`KeyboardEvent.key`暴露的任意有效按键名转换为kebab-base来作为修饰符

```html
<input @keyup.page-down="onPageDown">
```

在上面的例子中，处理函数`onPageDown()`仅在`$event.key === 'PageDown'`时被调用

### .exact修饰符

`.exact`允许你控制有精确的系统修饰符组合触发的事件

```html
<!-- 即使Alt或者Shift被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl:exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

### 为什么在HTML中监听事件

所有的Vue.js事件处理方法和表达式都严格绑定在当前的视图的`ViewModel`上，它不会导致任何维护上的困难。实际上，使用Vue.js的`v-on`有以下几个好处：

1. 扫一眼HTML模板便能轻松定位在JavaScript代码里对应的方法
2. 因为你无须在JavaScript里手动绑定事件，你的`ViewModel`代码可以是非常纯粹的逻辑，和DOM完全解耦，更加方便测试
3. 当一个`ViewModel`被销毁时，所有的事件处理器都会自动删除，你无须担心如何清理它们

## 表单输入绑定

你可以用`v-model`指令在表单`<input>`以及`<textarea>`元素上创建双向的数据绑定，它会根据控件类型自动选取正确的方法来更新元素，尽管有些神奇，但是`v-model`本质上不过是语法糖，它负责监听用户的输入事件以及更新数据，并对一些极端场景进行一些特殊的处理。

`v-model`会忽略所有表单元素的`value`、`checked`、`selected`特性的初始值，而总是将Vue实例的数据作为数据来源，你应该通过JS在组件的`data`选项中声明初始值

### 单行文本输入

```html
<input v-model="message" placeholder="单行文本编辑区域">
<p{{message}}></p>
```

### 多行文本

```html
<span>Multiline message is: </span>
<p style="white-space: pre-line;">{{message}}</p>
<br>
<textarea v-model="message" placeholder="多行文本显示区域"></textarea>
```

### 复选框

单个复选框，绑定到布尔值：

```html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{checked}}</label>
```

多个复选框，数值value绑定到同一个数组

```html
<div id='test'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
</div>
```

```js
new Vue({
  el: '#test',
  data: {
    checkedNames: []
  }
})
```

### 单选按钮

```html
<span>单选按钮值绑定</span>
<div>
    <label for="one">
        <input type="radio" id="one" value="1" v-model="picked">
    </label>
    <label for="two">
        <input type="radio" id="two" value="2" v-model="picked">
    </label>
    <label for="three">
        <input type="radio" id="three" value="3" v-model="picked">
    </label>
    <br>
    <span>picked:{{picked}}</span>
</div>
```

### 选择框

单选下拉框：

```html
<div>
    <select name="single" id="single" v-model="selected">
        <option disabled value="">请选择</option>
        <option value="apple">苹果</option>
        <option value="pear">梨子</option>
        <option value="orange">橘子</option>
    </select>
    <br>
    <span>单选值：{{selected}}</span>
</div>
```

多选下拉框：

```html
<span>动态渲染多选下拉框
<div>
    <select  multiple  >
        <option v-for="option in mselected" v-bind:value="option.value">
            {{option.text}}
        </option>
    </select>
    <br>
    <span>multi:{{mselected}}</span>
</div>
```

### 控件值绑定

```html
<!-- 当选中时，`picked` 为字符串 "a" -->
<input type="radio" v-model="picked" value="a">
<!-- `toggle` 为 true 或 false -->
<input type="checkbox" v-model="toggle">
<!-- 当选中第一个选项时，`selected` 为字符串 "abc" -->
<select v-model="selected">
    <option value="abc"></option>
</select>
```

### 表单控件修饰符

`.layz`在默认情况下，`v-model`在每次`input`事件触发后将输入框的值与数据进行同步，你可以添加`lazy`修饰符，从而转变为使用`change`事件进行同步：

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" >
```

`.number`修饰符会自动将用户输入值转换为数值类型

```html
<input v-model.number="age" type="number">
```

`.trim`用来过滤用户输入的首尾空白字符串

```html
<input v-model.trim="msg">
```

## Vue.js组件系统

组件(components)是Vue.js最强大的功能之一，组件可以拓展HTML元素，封装可重用的代码。在较高的层面上，组件是自定义的元素，Vue.js的编译器为其添加特殊的功能，在有些情况下，组件也可以表现为用`is`特性进行拓展的原生HTML元素

所有的Vue组件同时也都是Vue.js的实例，所以可以接受相同的选项对象（除了一些根级别特有的选项）并提供相同的生命周期钩子。

### 使用组件--全局注册

一般使用`Vue.component(tagName,options)`，例如：

```js
Vue.component('my-component',{
    //options
})
```

要注意的一点是，要确保在初始化根实例之前注册组件。组件在注册之后，便可以作为自定义元素`<my-component></my-component>`在一个实例模板中使用，如下：

```html
<div id="test">
    <my-component></my-component>
</div>
<script>
    Vue.component('my-component',{
        template:`<div>A custom component!</div>`
    })
    new Vue({
        el: '#test'
    })
</script>
```

### 使用组件--局部注册

更多时候，我们并不需要在全局注册组件，而是可以通过某个Vue实例/组件的实例选项`components`注册仅在其作用域中可用的组件：

```js
var Child = {
    child1: {template:`<h1>custom-h1</h1>`},
    child2: {template:`<span>custom-span</span>`}
}
new Vue({
    //...
    components: {
        //<my-component> 将只在父组件模板中可用
        '1-component': Child.child1,
        '2-component': Child.child2
    }
})
```

### DOM模板解析注意事项

当使用DOM作为模板时（例如，使用el选项来把Vue实例挂载到一个已有的内容的元素）,你会受到HTML本身的一些限制，因为Vue只有在浏览器解析、规范化模板之后才能获取其内容。尤其要注意，像`ul`、`ol`、`table`、`select`这样的元素里允许包含的元素有限制，而另外一些像`<option>`这样的元素只能出现在某些特定元素的内部，比如：

```html
<!-- 在table内部使用自定义组件my-row会导致无效 -->
<table>
  <my-row>...</my-row>
</table>

<!-- 变通的方案是使用特殊的 is 特性： -->
<table>
  <tr is="my-row"></tr>
</table>
```

但是，使用以下来源的字符串模板，则是没有这些限制：

1. `<script type="text/x-template">`
2. `JavaScript 内联模板字符串`
3. `.vue`组件

所以，请尽可能地使用模板字符串

### 组件里的data必须是函数

构造Vue实例时传入的各种选项大多数都也可以在组件里直接使用。只有一个例外：`data`选项必须是函数

```js
//以下方法注册组件时会报错,Vue会停止运行，并在控制台发出警告
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```

理解以上报错原因是很有用的，如果组件中的data是一个对象属性的话，那么该组件在实例化后所生成的所有组件data将共享一个对象的属性，以个组件修改了该对象的某个属性，其他组件所引用的这个对象的属性也会随之变化，这与每个组件拥有自己的独立状态是相违背的。

所以设置组件的`data`为返回某个对象的函数，这样每个组件所有的`data`数据都是各自独立的状态

### 组件组合

组件设计的初衷就是要配合使用的，最常见的就是形成父子组件的关系：组件A在它的模板中使用了组件B。它们之间必然互相通信，父组件通常要给子组件下发数据，子组件通常要将它内部发生的事情通知给父组件，而通过一个良好定义的接口尽可能将父子组件解耦也是非常重要的。这保证了每个组件的代码可以在相对隔离的环境中书写和理解，从而提高了组件的高复用性和可维护性。

在Vue中，父子组件的关系可以被总结为：prop数据向下传递，event事件向上传递。父组件通过prop接口给子组件下发数据，子组件通过事件给父组件发送消息

![Vue父组件与子组件关系](https://cn.vuejs.org/images/props-events.png)

### 使用Prop传递数据

组件实例的作用域是孤立的，这意味着不能(也不应该)在子组件的模板内直接引用父组件的数据。父组件的数据需要通过`prop`才能下发到子组件中

子组件需要显式地用`props选项`声明它期望的数据：

```js
Vue.component('child',{
    //声明 props
    props: ['message'],
    //就像data一样，prop也可以在模板中使用
    //同样也可以在vm实例通过this.message来使用
    template: `<span>{{message}}</span>`
})
```

然后我们可以这样向它传入一个普通字符串：

```html
<child message="hello"!></child>
```

渲染结果：

```html
<span>Hello!</span>
```

HTML特性是不区分大小的，所以当时用的不是字符串模板时，camelCase(驼峰式命名)的prop需要转换为相对应的kebab-case(短横线分割式名)，比如：

```js
Vue.component('child',{
    props: ['myMessage'],
    template: `<span>{{myMessage}}</span>`
})
```

```html
<!-- 在 HTML 中使用 kebab-case -->
<child my-message="hello!"></child>
```

### 动态Prop

与绑定任何普通的HTML特性相类比，也可以用`v-bind`来动态地将prop绑定到父组件的数据。每当父组件的数据变化时，这个变化也会传导给子组件：

```html
<div id="test">
    <input v-model="parentMsg">
    <br>
    <child v-bind:my-message="parentMsg">
</div>
<script>
    new Vue({
        el: 'test',
        data: {
            parentMsg: 'Message for parent'
        }
    })
</script>
```

如果你想把一个对象的所有属性作为prop进行传递，可以使用不带任何参数的`v-bind`(也就是用`v-bind:`而不是`v-bind:prop-name`).例如，已知一个`todo`对象

```js
todo: {
    text: 'Learn Vue',
    isComplete: false
}
```

然后

```html
<todo-item v-bind="todo"></todo-item>
```

这个效果等价于

```html
<todo-item
  v-bind:text="todo.text"
  v-bind:is-complete="todo.isComplete">
</todo-item>
```

### 字面量语法 vs 动态语法

初学者常犯一个错误是使用字面量语法传递数值：

```html
<!-- 传递了一个字符串 "1" -->
<comp some-prop="1"></comp>
```

因为它是一个字面量prop，它的值是字符串"1"，而不是一个数值。如果想传递一个真正的JavaScript数值，则需要使用`v-bind`，从而让它的值被当做JavaScript表达式计算

```html
<!-- 传递真正的数值 -->
<comp v-bind:some-prop="1"></comp>
```

### 单向数据流

Prop是单向绑定的:当父组件的属性变化时，将传到给子组件，但是反过来就不会，这是为了防止子组件无意间修改了父组件的状态，来避免应用的数据流变得难以理解。

每次父组件更新时，子组件的所有prop都会更新为最新值，这意味着你不应该在子组件内部改变prop，如果你这么做了，Vue会在控制台给出警告

在两种情况下，我们很需要修改prop中的数据

1. Prop作为初始值传入后，子组件想把它当做局部数据来用
2. Prop作为原始数据传入，由子组件处理成其他数据输出

对这两种情况，正确的应对方式：

1. 定义一个局部变量，并用prop的值初始化它：

```js
props: ['initialCounter'],
data: function () {
    return {counter: this.initialCounter}
}
```

1. 定义一个计算属性，处理prop的值并返回：

```js
props: ['size'],
computed: {
    normalizedSize: function () {
        return this.size.trim().toLowerCase()
    }
}
```

不过要注意的是，在JavaScript中对象和数组是引用类型，指向同一个内存空间，如果prop是一个对象或数据，在子组件内部状态改变它会影响父组件的状态。

## Prop验证

我们可以为组件的prop指定验证规则，如果传入的数据不符合要去的话，Vue会给出合适的警告

要指定验证规则，那么就需要使用对象的形式来定义prop，而不能用字符串数组，如

```js
Vue.component('example', {
    props: {
        //基础类型检测，但要注意，'null'指向任意类型
        propA: Number,
        //propB可以是String或Number
        propB: [String,Number],
        //porpC必须传而且得是字符串
        propC: {
            type: String,
            required: true
        },
        //类型是数值且有默认值
        propD: {
            type: Number,
            default: 100
        },
        //类型是数组或对象的，其默认值应该由一个工厂函数返回
        propE: {
            type: Object,
            default: function() {
                return { message: 'hello'}
            }
        },
        //自定义验证函数
        propF: {
            validator: function(value) {
                return vlalue > 10
            }
        }
    }
})
```

检测用到的参数type可以是原生构造函数：`String Number Boolean Function Object Array Symbol`,当然也可以是一个自定义函数，使用`instanceof`来检测

当prop验证失败，开发版的Vue.js会给出警告，prop会在组件实例创建之前进行校验，所以在`default`或`validator`函数里，不能使用诸如`data computed methods`等实例属性

## 非prop特性

所谓的非prop特性，就是指它可以直接传入组件，而不要定义相应的prop

尽管为组件定义明确的prop是推荐的传参方式，组件的作者却并不总能预见到组件被使用的场景。所以组件可以接收任意传入的特性，这些特性都会被添加到组件的根元素上

举例：假设我们使用了第三方组件`bs-date-input`,它包含一个Bootstrap插件，该插件需要在`input`上添加`data-3d-date-picker`这个特性，那么此时可以把特性直接传到这个组件上而不需要事先定义prop
`bs-date-input data-3d-date-picker="true"></bs-date-input>`
添加属性`data-3d-date-picker="true"`之后，这个特性会被自动添加到`bs-date-input`的跟元素上

## 替换/合并现有特性

假设这是 `bs-date-input` 的模板：

```html
<input type="date" class="form-control">
```

为了给该日期选择器插件增加一个特殊的主题，我们可能需要增加一个特殊的 class，比如:

```html
<bs-date-input
 data-3d-date-picker="true"
 class="date-picker-theme-dark"
></bs-date-input>
```

在这个例子当中，我们定义了两个不同的 class 值：

1. form-control，来自组件自身的模板
2. date-picker-theme-dark，来自父组件

对于多数特性来说，传递给组件的值会覆盖组件本身设定的值。即例如传递 type="large" 将会覆盖 type="date" 且有可能破坏该组件！所幸我们对待 class 和 style 特性会更聪明一些，这两个特性的值都会做合并 (merge) 操作，让最终生成的值为：`class="form-control date-picker-theme-dark"`。

## 使用v-on绑定自定义事件

每个Vue实例都实现了事件接口，即：

1. 使用`$on(eventName)`监听事件
2. 使用`$emit(eventName,optionalPayload)`触发事件

要注意的是：Vue的事件系统与浏览器的EventTargetAPI有所不同，尽管它们运行起来类似，但是`$on $emit`并不是`addEventListener dispatchEvent`的别名

另外，父组件可以在使用子组件的地方直接用 `v-on` 来监听子组件触发的事件。

不过不能用`$on`监听子组件释放的事件，而是在模板里直接用`v-on`绑定

请谨记，Vue.js中，子组件都是和外部完全解耦了，子组件所要做的只是报告自己内部的事件，因为父组件可能会关心这些事件的发生从而做出相应的处理

## 给组件绑定原生事件

有时候，你可能想在某个组件的根元素上面监听一个原生事件。可以使用`v-on`修饰符`.native`，例如：

```html
<my-component v-on:click.native="doTheThing"></my-component>
```

## .sync修饰符

在一些情况下，我们可能会需要对一个 prop 进行“双向绑定”

事实上，这正是 Vue 1.x 中的 `.sync` 修饰符所提供的功能。当一个子组件改变了一个带 `.sync` 的 `prop` 的值时，这个变化也会同步到父组件中所绑定的值。这很方便，但也会导致问题，因为它破坏了单向数据流。由于子组件改变 `prop` 的代码和普通的状态改动代码毫无区别，当光看子组件的代码时，你完全不知道它何时悄悄地改变了父组件的状态。这在 debug 复杂结构的应用时会带来很高的维护成本。

上面所说的正是我们在 2.0 中移除 .sync 的理由。但是在 2.0 发布之后的实际应用中，我们发现 `.sync` 还是有其适用之处，比如在开发可复用的组件库时。我们需要做的只是让子组件改变父组件状态的代码更容易被区分。

所以Vue 2.3.0 重新引入了 `.sync` 修饰符,但是它这次只是作为一个编译时的语法糖的存在，它会被拓展为一个自动更新父组件属性的`v-on`监听器，如：

```html
<comp v-bind:foo.sync="bar"></comp>
```

会被拓展为：

```html
<comp v-bind:foo="bar" v-on:update="val => bar => val"></comp>
```

当子组件需要更新`foo`的值时，它需要显示地触发一个更新事件

```js
this.$emit('update:foo', newValue)
```

如果需要使用对象一次性设置多个属性时，`.sync`可以和`v-bind`一起使用

```html
<comp v-bind.sync="{foo: 1,bar: 2}"></comp>
```

这个例子会为 foo 和 bar 同时添加用于更新的 v-on 监听器。

## 使用自定义事件的表单组件

自定义事件可以用来创建自定义的表单输入组件，使用`v-model`来进行双向数据绑定，请牢记：

```html
<input v-model="something">
```

`v-model`不过是以下实例的语法糖：

```html
<input
  v-bind:value="something"
  v-on:input="something => $event.target.value"
>
```

所以在组件中使用`v-model`时，它应该是可配置的：

1. 接受一个 `value` prop
2. 在有新的值时触发`input`事件并且将新值作为参数

来看一个非常简单的货币输入自定义控件

## 自定义组件的v-model

默认情况下，一个组件的`v-model`会使用`value prop`和`input`事件。但是诸如单选框、复选框之类的，输入类型可能把`value`用做了别的目的。`model`选项可以避免这样的冲突：

 ```js
 Vue.component('my-component',{
     model: {
         prop: 'checked',
         event: 'change'
     },
     props: {
         checked: Boolean,
         // 这样就允许拿 `value` 这个 prop 做其它事了
         value: String
     },
     //...
 })
 ```

 ```html
 <my-checkbox v-model="foo" vlaue="some value"></my-checkbox>
 ```

 上述代码等价于：

 ```html
 <my-checkbox
   v-bind:checked="foo"
   v-on:change="val => {foo = val}"
   value="some value"
 ></my-checkbox>
 <!-- 你仍然需要显示地声明checked 这个prop -->
 ```

## 非父子组件通信

有时候在项目中，非父子关系的两个组件也需要通信，在简单的场景下，可以使用一个空的Vue实例作为事件总线：

```js
var bus = new Vue()

//A组件中触发事件了'id-selected'
bus.$emit('id-selected',1)

//在组件B创建的钩子中监听事件
bus.$on('id-selected',function(id) {
    //...
})
```

当然，老司机的做法可能是这样的

```js
let eventHub = new Vue()
Vue.prototype.$eventHub = eventHub
Vue.component('comp-a',{
    template: `<div>a<button @click="notify"></button></div>`,
    methods: {
        notify: function () {
            var res = this.__proto__ === Vue.prototype
            this.$eventHub.$emit('xxx','hi,这是毫无关系的组件通信哟')
        }
    }
})
Vue.component('comp-b',{
    template: `<div>b<div ref="outpu"></div>`,
    created() {
        this.$eventHub.$on('xxx',function(data) {
            this.$refs.output.textContent = data
        })
    }
})
let app = new Vue({
    el: 'app'
})
```

在复杂的情况下，我们应该考虑使用专门的**状态管理模式**。

## 使用插槽分发内容

在使用组件时，我们常常要像这样组合它们：

```html
<app>
    <app-header></app-header>
    <app-footer></app-footer>
</app>
```

要注意两点：

1. `<app>`组件不知道它会收到什么内容，收到什么内容是由`<app>`的父组件确定的
2. `<app>`组件很可能有自己的模板

为了让组件可以组合使用，我们需要一种方式来混合父组件的内容与子组件自己的模板，这个过程被称为内容分发(也就是Angular中的"transclution").Vue.js实现了一个内容分发API，参照了当前的 Web Component 规范草案，使用特殊的`<slot>`元素作为原始内容的插槽

## 编译作用域

在深入内容分发API之前，我们先明确内容是在哪个作用域里编译。假设模板为：

```html
<child-component>
    {{ message }}
</child-component>
```

`message`应该绑定到父组件的数据，还是绑定到子组件的数据呢？答案是，**父组件**.组件的作用域简单来说就是：

> 父组件模板的内容在父组件作用域内编译，子组件模板的内容在子组件作用域内编译

初学者常见的一个错误就是，试图在父组件的模板内将一个指令绑定到子组件的属性和方法中去

```html
<!-- 无效的绑定 -->
<child-omponent v-show="someChildProperty"></child-component>
```

如果要绑定子组件作用域内的指令到一个组件的根节点，正确的做法是在子组件的模板里做

```js
Vue.component('child-component', {
    template: `<div v-show="someChildProperty"></div>`,
    data: function() {
        return {
            someChildProperty: true
        }
    }
})
```

类似地，被分发的内容也会在父组件作用域内编译

## 单个插槽

除非子组件模板包至少包含一个`<slot>`插口