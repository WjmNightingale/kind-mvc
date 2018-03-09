//可以利用Obeject.defineProperty()来监听属性变动
//需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
//这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
var data = {name: 'oldName'}
observer(data)
data.name = 'newName' //已监听到值发生了变化 oldName--》newName
function observer(data) {
    if (!data || typeof data !== 'object') {
        return
    }
    Object.keys(data).forEach((key) => {
        defineReactive(data,key,data[key])
    })
    //第一版
    // function defineReactive(data,key,val) {
    //     observer(val)
    //     Object.defineProperty(data,key,{
    //         enumerable: true,//可枚举
    //         configurable: false,//不可再define
    //         get: function() {
    //             return val
    //         },
    //         set: function(newVal) {
    //             console.log('已监听到值发生了变化',val,'--》',newVal)
    //             val = newVal
    //         }
    //     })
    // }



    //通过observer函数可以监听每个数据的变化，那么监听到变化之后就是怎么通知订阅者了
    //所以接下来我们需要实现一个消息订阅器
    //很简单，通过维护一个数组，用来收集订阅者，数据变动时触发notify，再调用订阅者的update方法

    //第二版，实现订阅中心
    function defineReactive(data,key,val) {
        var dep = new Dep()//收集订阅者的数组
        observer(val)
        Object.defineProperty(data,key,{
            enumerable: true,//可枚举
            configurable: false,//不可再define
            get: function() {
                console.log(this)
                //由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完后再移除
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set: function(newVal) {
                console.log('已监听到值发生了变化',val,'--》',newVal)
                val = newVal
                dep.notify()//数据发生变化，通知所有的订阅者进行数据更新 订阅者一般是watcher
            }
        })
    }
    //订阅中心用一个数组来维护，用来存储订阅者
    function Dep() {
        this.subs = []
    }
    //订阅中心
    Dep.prototype = {
        //添加订阅者 订阅==》subscribe
        addSub: function(sub) {
            this.subs.push(sub)
        },
        //通知订阅者数据更新
        notify: function() {
            this.subs.forEach((sub) => {
                sub.update()
            })
        }
    }


}

