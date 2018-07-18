# 概述

Vuex是一个专门为Vue.js应用程序开发的状态管理模式，它采用集中式存储管理应用的所有组件状态，并且以相对应的规则保证状态可以以一种可预测的方式发生变化。

## 状态管理模式

一个简单的计数器应用，其状态管理模式为：

1. state 驱动应用的数据源
2. view 以声明方式将state映射到视图
3. action 响应在view上的用户输入导致的状态变化

极简的单向数据流是这样的：state --》 view --》action --》state。形成了一个闭环

但是，当应用遇到多个组件共享状态时，单向数据流的简洁性很容易就遭到破坏：

1. 多个视图依赖同一个状态
2. 来自不同视图的不同行为需要变更同一个状态

对于问题1，组件传参的方式对于多层嵌套组件会变得异常繁琐，而且兄弟组件间的状态传递是无法做到的。

对于问题2，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。

以上这两种模式，通常会导致无法维护的代码

所以，为什么不考虑把组件的共享状态抽离出来，以一个全局单例模式来管理？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都具备获取状态或者触发行为的能力！而且，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。

## start

每一个Vuex应用的核心是 store ，“store” 就是一个容器，它包含着你的 Vue.js 应用中大部分状态，Vuex 和 单纯的全局对象有以下两点不同

1. Vuex的状态存储是响应式的，当Vue组件从 store 中读取状态时，若 store 中的状态发生了变更，那么相应的组件也会随之更新
2. 开发者不能直接变更 store 中的状态，改变状态的唯一途径就是显示地提交**commit mutation**。这样方便我们以方便地追踪每一个状态变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用

## 最简单的 state

```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            return state.count++
        },
        decrement(state) {
            return state.count--
        }
    }
})
const app = new Vue({
    el: '#app',
    computed: {
        count() {
            return store.state.count
        }
    }
})
```

## 单一状态树

Vuex 使用单一状态树，是的，用一个对象就包含了全部的应用层级状态，至此Vuex便作为一个“唯一数据源”而存在，这也意味着，每个应用将仅仅包含一个store实例。单一状态树能够让我们直接定位任一特定的状态片段，在调试过程中也可以轻易的取得整个应用状态的当前快照。

单一状态和模块化并不冲突，后续我们会讨论如何将状态和状态变更事件分布到各个子模块当中去。

## 在Vue.js应用中获取Vuex状态

因为Vuex的状态是响应式的，从store实例中读取状态最简单的方法就是在计算属性中返回某个状态

```js
// 创建一个 Counter 组件
const Counter = {
    template: `
    <div>{{count}}</div>
    `,
    computed: {
        count() {
            return store.state.count
        }
    }
}
```

每当`store.state.count`变更时，都会重新计算属性，并且触发相关联的DOM节点

然而，这种模式导致组件依赖全局状态单例，在模块化构建的系统中，在每个需要使用 state 的组件需要频繁地导入，并且在测试组件时需要提供模拟状态

Vuex通过store选型，提供了一种机制，可以将状态注入到每一个子组件当中（需要调用Vue.use(Vuex)）

```js
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

通过在根实例中注册“store”选型，该“store”实例会注入到根组件下的所有子组件中，子组件可以通过`this.$store`访问到，让我们更新下`Counter`的实现：

```js
const Counter = {
    template: `
    <div>{{count}}</div>
    `,
    computed: {
        count() {
            return this.$store.state.count
        }
    }
}
```

## mapState 辅助函数

当一个组件需要获取多个状态时，将这些状态声明为计算属性会有些重复。为了解决多次声明的问题，我们可以使用`mapState`辅助函数帮助我们生成计算属性，让你少按几次键：

```js
// webpack 打包工具构建模块化
import {mapState} from 'vuex'
export default {
    // ...
    computed: mapState({
        // 箭头函数
        count: state => state.count,
        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',
        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
        countPlusLocalState(state) {
            return state.count + this.localState
        }
    })
}
```

当映射的计算属性的名称与state的子节点名称相同时，我们也可以给`mapState`传入一个字符串数组

```js
computed: mapState([
    // 映射 this.count 为 store.state.count
    'count'
])
```

`mapState`函数返回的是一个对象，我们可以使用ES6的对象拓展运算符，使得全局状态和局部计算属性混用

```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

使用 Vuex 并不意味着你需要将所有的状态放入 Vuex。虽然将所有的状态放到 Vuex 会使状态变化更显式和易调试，但也会使代码变得冗长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定。

## Getter

有的时候我们需要从 store 中派生一些状态，比如对列表进行过滤并计算：

```js
computed: {
    doneTodosCount() {
        return this.$store.state.todos.filter(todo => todo.done).length
    }
}
```

如果有多个组件需要用到这个属性，我们要么复制这个函数，获取抽取一个共享函数然后在需要的地方引入--无论是哪种方式都不够理想

Vuex允许我们在 store 中定义`getter`（可以认为是store的计算属性）。就像计算属性一样，`getter`的返回值会根据它的依赖缓存起来，且只有当它的依赖值发生了改变的时候才会重新计算。

Getter 接受 state 作为它的第一个参数

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

Getter 会暴露为 `store.getter`对象，开发者可以以属性的形式访问这些值

```js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]```
```

Getter 也接受 其他 getter 作为第二个参数

```js
getters: {
    // ...
    doneTodosCount: (state,getters) => {
        return getters.doneTodos.length
    }
}
store.getters.doneTodosCount
```

我们很容易在组件中使用到 getters对象中的属性

```js
computed: {
    doneTodosCount() {
        return this.$store.getters.doneTodosCount
    }
}
```

注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

除了以对象属性访问 getter 外，开发者也可以让 getter 返回一个函数，来实现给 getter 传参，在开发者对 store 里的数组进行查询时非常有效：

```js
getters: {
    // ...
    getTodoById: (state) => {
        return (id) => {
            return state.todos.find(todo => todo.id === id)
        }
    }
}

store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

注意，getter 在通过方法访问时，每次都会去进行调用，而不会取缓存结果

## mapGetters 辅助函数

类比`mapState`将 store 中的 state 映射到组件的局部计算属性，`mapGetter`则是将 store 中的 getter 映射到 组件的局部计算属性

```js
import {mapGetters} form 'vuex'

export default {
    // ...
    computed: {
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
            // ...
        ])
    }
}
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：

```js
mapGetters({
    //  把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
    doneCount: 'doneTodosCount'
})
```

## Mutation

更改Vuex中的store的状态的唯一方法就是，提交mutation。Vuex中的mutation非常类似于事件，每个mutation都有一个字符串的事件类型`type`和一个回调函数`handler`。这个回调函数就是我们实际进行状态更改的地方，并且它会接受state作为第一个参数：

```js
const store = new Vuex.store({
    state: {
        count: 1
    },
    mutations: {
        increment(state) {
            // 变更状态
            state.count++
        }
    }
})
```

开发者不能直接调用一个`mutation handler`,这个选项更像是事件注册：触发一个类型为“increment”的mutation时，调用此处理函数变更状态。要唤醒一个“mutation handler”，需要以相应的type调用store.commit方法：

```js
store.commit('increment')
```

开发者也可以在`store.commit`传入额外的参数，即mutation的载荷（payload）

```js
// ...
mutations: {
    increment(state,n) {
        state.count += n
    }
}
store.commit('increment',10)
```

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段记录的mutation会更加易读

```js
// ...
mutations: {
    increment(state,payload) {
        state.count += payload.amount
    }
}
store.commit('increment',{
    amount: 10
})
// 对象风格方式提交commit
store.commit({
    type: 'increment',
    amount: 10
})
```

## Mutation 遵循 Vue 的响应规则

既然Vuex中的store是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

1. 最好提前在你的 store 中初始化好所有所需属性。
2. 当需要在store对象上添加新属性时，你应该
    * 使用 `Vue.set(obj,'newProp',123)`
    * 以新对象代替旧对象 `state.obj = {...state.obj,newProp:123}`

在实际开发中，使用常量替代mutation的事件类型，是各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

```js
// mutation-type.js
export const SOME_MUTATION = 'SOME_MUTATION'

// store.js
const store = new Vuex.Store({
    state: {...},
    mutations: {
        // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
        [SOME_MUTATION](state) {
            // mutate state
        }
    }
})
```

## Mutation 其他细节

一条重要的原则就是要记住 mutation 必须是同步函数。为什么呢？参考以下例子：

```js
mutations: {
    someMutation(state) {
        api.callAsyncMethod(() => {
            state.count++
        })
    }
}
```

现在想象，我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

