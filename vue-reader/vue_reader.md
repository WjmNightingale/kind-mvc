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
