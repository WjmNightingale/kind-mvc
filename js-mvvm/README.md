# 如何实现一个简易的mvvm

## demo能了解到什么

1. 了解vue的双向数据绑定原理以及核心代码模块
2. 自己实现数据双向绑定

## 背景

主流的几种mvc（mvvm）框架都实现了单向数据绑定，而双向数据绑定则是在单行绑定的基础上给可输入元素（如input、textarea）添加了change（input）事件，来动态地修改model和view，并没有更复杂的实现。

实现数据绑定的做法常见的有以下集中：

1. 发布者-订阅者模式（backbone.js）
2. 脏值检查（angular.js）
3. 数据劫持（vue.js）

**发布者--订阅者模式：**一般通过sub, pub的方式实现数据和视图的绑定监听，更新数据方式通常做法是 `vm.set('property', value)`

**脏值检查**：angular.js 是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图，最简单的方式就是通过 setInterval() 定时轮询检测数据变动，angular只有在指定的事件触发时进入脏值检测，大致如下：

1. DOM事件，如用户的文本输入事件、点击按钮等。
2. XHR响应事件（$http）
3. 浏览器Location变更事件（$location）
4. Timer事件（$timeout,$interval）
5. 执行$digset()或$apply()

**数据劫持**：vue.js则是采用数据劫持结合发布者--订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的`setter`、`getter`，在数据变动时发布消息给订阅者，触发相应的监控回调。

## 数据劫持

实现mvvm的数据双向绑定，理清数据劫持的流程相当重要，实现要点有以下：

1. 实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可以拿到最新值并且通知订阅者
2. 实现一个指令解析器Compile，对每个元素节点的指令进行扫描，根据指令模块替换数据，以及绑定相应的更新函数。
3. 实现一个Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
4. mvvm入口函数，整合以上三者。

![](https://segmentfault.com/img/bVBQYu)