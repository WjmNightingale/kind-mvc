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

## 在组件中提交 Mutation

你可以在组件中使用`this.$store.commit('xxx')`提交mutation，或者使用`mapMutations`辅助函数将组件中的methods映射为`store.commit`调用（这个需要在根节点注入 store）

```js
import {mapMutations} from 'vuex'
export default {
    // ...
    methods: {
        ...mapMutations([
            // 将`this.increment()`映射为`this.$store.commit('increment')`
            'increment',
            // `mapMutations`映射的mutation也支持载荷：
            // 比如将`this.incrementBy(amount)`映射为`this.$store.commit({type: incrementBy,amount: amount})`
            'incrementBy'
        ]),
        ...mapMutations({
            // 将 `this.add()`映射为`this.$store.commit('increment')`
            add: 'increment'
        })
    }
}
```

在`mutation`中混合异步调用会导致你的程序很难调试，例如当你调用了两个包含异步回调的`mutation`来改变状态，你怎么知道哪个时候回调和哪个先回调呢，这就是为什么Vuex要区分`mutation`和`action`两个概念。在Vuex中，`mutation`都是同步事务

```js
store.commit('increment') // 任何由 "increment" 导致的状态变更都应该在此刻完成。
```

## 处理异步操作的 Action

Action 类似于 Mutation ，不同点在于：

* Action 提交的是 Mutation，而不是直接变更状态;而Mutation是直接提交一个状态变更
* Action 可以包含任意操作

首先来注册一个简单的 action ：

```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    actions: {
        increment (context) {
            context.commit('increment')
        }
    }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此开发者可以用 `context.commit()` 来提交一个 mutation ,或者通过`context.state`和`context.getter`来获取 state 和 getters。学习 Modules 时我们就能知道，为什么`context`对象不是`store`实例本身了

实践中，我们会经常用到ES2015的参数解构来简化代码，特别是我们需要多次调用`commit`的时候

```js
const store = new Vuex.Store({
    //...
    actions: {
        increment({commit}) {
            // {commit} = context
            commit('increment')
        }
    }
})
```

## 分发Action

Action 通过 `store.dispatch`方法触发。

```js
store.dispatch('increment') // 分发一个名为`increment`的action
```

一眼看上去可能多此一举，我们直接分发mutation岂不是更方便，实际上并非如此，还记得`mutation`内必须执行同步操作这个限制吗，Action就不受约束。我们可以在`action`内执行异步操作

```js
const store = new Vuex.Store({
    //...
    action: {
        incrementAsync({commit}) {
            setTimeout(() => {
                commit('increment')
            },1000)
        }
    }
})
// 分发一个名为`incrementAsync`的action，执行后会在1秒后提交一个名为`increment`的mutation
store.dispatch('incrementAsync')

// action支持载荷和对象风格传入
store.dispatch('incrementAsync',{
    amount: 10
})
//action支持对象风格传入
store.dispatch({
    type: 'incrementAsync',
    amount: 10
})
```

参看一个购物车实例，涉及到调用异步 API 和多重分发`mutation`:

```js
const store = new Vuex.Store({
    //...
    actions: {
        checkout({commit,state},products) {
            // 把当前购物车的信息备份起来
            const savedCartItems = [...state.cart.added]
            // 发出结账请求，然后乐观的清空购物车
            commit(types.CHECKOUT_REQUEST)
            // 购物车 API 接受一个成功回调和一个失败回调
            shop.buyProducts(
                products,
                // 成功操作
                () => commit(types.CHECKOUT_SUCCESS),
                () => commit(types.CHECKOUT_FAILURE,savedCartItem)
            )
        }
    }
})
```

在以上代码中，我们正在进行一系列的异步操作，并且通过提交`mutation`来记录`action`产生的副作用--即状态变更

## 在组件中分发 Action

开发者在组件中使用`this.$store.dispatch('xxx')`分发action，或者使用辅助函数`mapActions`将组件中的methods映射为`this.$store.dispatch()`调用(需要先在根节点注入`store`)

```js
import {mapActions} form 'vuex'

export default {
    // ...
    methods: {
        ...mapActions([
            // this.increment -> this.$store.dispatch('increment')
            'increment'
            // 支持载荷 this.incrementBy(amount) => this.$store.dispatch('incrementBy',amount)
            'incrementBy'
        ]),
        ...mapActions({
            // this.add() => this.$store.dispatch('increment')
            add: 'increment'
        })
    }
}
```

## 组合Action

Action通常是异步的，那我们怎么知道action什么时候结束呢？更重要的是，我们如何才能组合多个action，用来处理更加复杂的流程呢？

首先，我们需要明白，`store.dispatch`可以处理被触发的`action`的处理函数返回的`Promise`，并且`store.dispatch`仍旧返回`Promise`

```js
actions: {
    actionA({commit}) {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                commit('someMutation')
                resolve()
            },1000)
        })
    }
}
```

这样定义action后，现在我们可以这样分发：

```js
store.dispatch('actionA').then(() => {
    // code
})
```

同时，我们还可以在另外一个action中这样写：

```js
actions: {
    // ...
    actionB({dispatch,commit}) {
        return dispatch('actionA').then(() => {
            commit('someOtherMutation')
        })
    }
}
```

最后，如果我们使用`async/await`语法，我们可以这样组合：

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise
actions: {
    async actionA({commit}) {
        commit('gotData',await getData())
    },
    async actionB({dispatch,commit}) {
        await dispatch('actionA') // 等待 actionA 完成
        commit('gotOtherData',await getOtherData)
    }
}
```

一个`store.dispatch`可以在不同模块中触发多个action函数，在这种情况下，只有当所有的触发函数完成后，返回的 Promise 才被执行

## Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象，当应用变得复杂是时，`store`对象就可能变得十分臃肿

为了解决以上问题，Vuex允许开发者将`store`对象分割成模块，每个模块拥有自己的`state`、`getters`、`mutations`、`actions`，甚至是嵌套子模块--从上至下进行同样方式的分割

```js
const moduleA = {
    state: {
        //...
    },
    getters: {
        //...
    },
    mutations: {
        //...
    },
    actions: {
        //...
    }
}
const moduleB = {
    state: {
        //...
    },
    getters: {
        //...
    },
    mutations: {
        //...
    },
    actions: {
        //...
    }
}
const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB
    }
})
store.a.count // -> moduleA的状态
store.b.count // -> moduleB的状态
```

## 模块的局部状态

对于模块内部的`mutation`和`getter`，接受的第一个参数是模块的局部状态对象

```js
// 13588307813
const moduleA = {
    state: {
        count: 1
    },
    getters: {
        doubleCount(state) {
            return state.count * 2
        }
    },
    mutations: {
        increment(state) {
            // 这里的 `state` 对象是模块的局部状态
            state.count++
        }
    }
}
```

同样，对于模块内部的 action ，局部状态通过`context.state`暴露出来，根节点状态为`context.rootState`

```js
const moduleA = {
    // ...
    actions: {
        incrementIfOddOnRootSum({state,commit,rootState}) {
            // {state,commit,rootState} = context
            if ((state.count + rootState.count) %2 === 1) {
                commit('increment')
            }
        }
    }
}
```

对于模块内部的`getter`，根节点状态会作为第三个参数暴露出来

```js
const moduleA = {
    // ...
    getters: {
        sumWithRootCount(state,getters,rootState) {
            return state.count + rootState.count
        }
    }
}
```

## 命名空间

默认情况下，模块内部的`action`、`mutation`、`getter`是注册在全局命名空间下的--这样使得多个模块能够对同一的`mutation`或是`action`做出响应

如果你希望你的模块具有更高的封装度和复用性，那么开发者可以通过添加`namespaced: true`的方式来使其成为带命名空间的模块。当模块被注册后，它的所有`getter`、`action`以及`mutation`都会自动根据模块注册的路径调整命名。

```js
const store = new Vuex.Store({
    modules: {
        account: {
            namespaced: true,
            // 模块内容 module state
            state: {
                //...模块内的状态已经是嵌套了，使用`namespaced`属性不会再产生影响
            },
            getters: {
                isAdmin() {
                    //...
                    //组件内使用 getters['account/isAdmin']
                }
            },
            actions: {
                login() {
                    //...
                    //组件内使用 store.dispatch('account/login')
                }
            },
            mutations: {
                login() {
                    //...
                    //组件内使用 store.commit('account/login')
                }
            },
            // 嵌套模块
            modules: {
                // 继承父模块的命名空间
                myPage: {
                    state: {
                        //...
                    },
                    getters: {
                        profile() {
                            //...
                            // 组件内使用 getters['account/profile']
                        }
                    }
                },
                // 再次嵌套命名空间
                posts: {
                    namespaced: true,
                    state: {
                        //...
                    },
                    getters: {
                        popular() {
                            //...
                            //组件内使用getters['account/posts/popular']
                        }
                    }
                }
            }
        }
    }
})
```

在启用了命名空间的`getter`和`action`会收到局部化的`getter`，`dispatch`和`commit`。换而言之，你在使用模块内容`module state`时，不需要在同一模块内添加额外的空间名前缀。更改`namespaced`属性后不需要修改模块内的代码。

## 在带命名空间的模块内访问全局内容(global assets)

如果你希望使用全局的`state`和`getter`，`rootState`和`rootGetter`会作为第三个和第三个参数传入 getter ，也会通过`context`对象的属性传入 action

若需要在全局命名空间内分发`action`或是提交`mutation`，将`{root: true}`作为第三参数传给`dispatch`或`commit`即可

```js
modules: {
    foo: {
        namespaced: true,
        getters: {
            // 在这个模块的 getter 中，`getters` 被局部化了
            // 你可以使用 getter 的第四个参数来调用 `rootGetters`
            someGetter(state,getters,rootState,rootGetters) {
                getters.someOtherGetter // -> 'foo/someOtherGetter'
                rootGetters.someOtherGetter // -> 'someOtherGetter'
            },
            someOtherGetter: state => {
                // code
            }
        },
        actions: {
            // 在这个模块中， dispatch 和 commit 也被局部化了
            // 可以接受 `root` 属性以访问根 dispatch 或 commit
            someAction({dispatch,commit,getters,rootGetters}) {
                getters.someOtherGetter // -> 'foo/someOtherGetter'
                rootGetters.someOtherGetter // -> 'someOtherGetter'
                // 局部化的 dispatch 和 commit
                dispatch('someOtherAction') // -> 'foo/someOtherAction'
                dispatch('someOtherAction',null,{root: true}) // -> 'someOtherAction'
                commit('someMutation') // -> 'foo/someOtherMutation'
                commit('someMutation',null,{root: true}) // -> 'someMutation'
            },
            someOtherAction(ctx,payload) {
                // ...
            }
        }
    }
}
```

## 在带命名空间的模块全局注册 action

若需要带命名空间的模块全局注册 action，同样可以添加`root: true`,并且将这个`action`定义在函数`handler`中

```js
{
    // ...
    actions: {
        someOtherAction({dispatch}) {
            dispatch('someAction')
        }
    },
    modules: {
        foo: {
            namespaced: true,
            actions: {
                someAction: {
                    root: true,
                    handler(namespacedContext,payload) {
                        // -> 'someAction'
                    }
                }
            }
        }
    }
}
```

## 带命名空间绑定函数

当使用`mapState`、`mapGetters`、`mapActions`和`mapMutations`这些函数来绑定命名空间吧模块时，可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文

```js
{
    //...
    computed: {
        ...mapState('some/nested/module',{
            a: state => state.a,
            b: state => state.b
        })
    },
    methods: {
        ...mapState('some/nested/module',[
            'foo',
            'bar'
        ])
    }
}
```

而且，你可以通过使用`createNamespacedHelpers`创建基于某个命名空间的辅助函数，它返回一个对象，对象里有新的 绑定在给定命名空间值上 的组件绑定辅助函数

```js
import {createNamespacedHelpers} from 'vuex'
const {mapState,mapActions} = createNamespacedHelpers('some/nested/module')
export default {
    computed: {
        // 在`some/nested/module`中查找
        ...mapState({
            a: state => state.a,
            b: state => state.b
        })
    },
    methods: {
        // 在`some/nested/module`中查找
        ...mapActions([
            'foo',
            'bar'
        ])
    }
}
```

## 模块动态注册

在 store 创建之后，我们可以使用`store.registerModule`方法来动态注册模块

```js
// 注册模块 `myModule`
store.registerModule('myModule',{
    // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested','myModule'],{
    // ...
})
```

之后可以通过使用`store.state.myModule`和`store.state.nested.myModule`来访问模块的状态

模块动态注册功能使得其他vue插件可以通过在`store`中附加新模块的方式来使用Vuex的管理状态，例如`vuex-router-sync`插件就是通过动态注册模块将`vue-router`和vuex集合在一起，实现应用的路由状态管理。

开发者也可以使用`store.unregisterModule(moduleName)`来动态卸载模块，但是不能用来卸载静态模块--也就是创建 store 时声明的模块

## 模块重用

有时我可能需要创建一个模块的多个实例，例如：

1. 创建多个`store`，他们公用同一个模块
2. 在一个`store`实例中，多次注册同一个模块

如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时 store 或模块间数据互相污染的问题。

实际上这和 Vue 组件内的 data 是同样的问题。因此解决办法也是相同的——使用一个函数来声明模块状态（仅 2.3.0+ 支持）：

```js
const MyReusableModule = {
    state() {
        return {
            foo: 'bar'
        }
    },
    // mutation, action 和 getter 等等...
}
```

## Vuex 约定俗成的规则

Vuex 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：

1. 应用层级的状态应该集中到单个的`store`对象
2. 提交`mutation`是更改状态的唯一方式，并且这个过程是同步的
3. 异步逻辑都应该封装到`action`里面

只要你遵循以上代码规则，那么代码如何组织完全看你个人风格。如果你的 store 文件太大，那么只需要将`action mutation getter`分割到单独的文件里

大型应用参考实例

```bash
|-- index.html
|-- main.js
|-- api
|   -- ... # 抽取出的API请求
|-- components
|   -- App.vue
|   -- ... # 其他组件
|-- store
    -- index.js # 我们组装模块并导出 store实例 的地方
    -- action.js # 根级别的 action
    -- mutation.js # 根级别的 mutation
    -- module
        -- cart.js # 购物车模块
        -- products.js # 产品模块
```