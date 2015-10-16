#H.Util
* 如有 功能增加建议 及 bug 反馈 请联系 插件维护者 曹志锋  
* 使用方法请看 demo 及注释

<br />

与其他的插件不同，H.Util 不是一个单一功能的插件，而是一系列轻量工具的集合<br />
由于各个工具之间存在着相互依赖关系，所以就做成了一个工具集的形式<br />
即便包含了很多小工具，它的大小依然只有40多K，而且还是未压缩状态<br />
所以完全不必担心它会因为包含了很多小工具而变得臃肿<br />

<br />
  
##H.Util 所包含的工具有：
* **[Monitor](#Monitor)**<br />
监听器，可以监听信息，并在接收到信息后触发指定的回调函数。也可以理解为一种脱离 DOM 的事件定义和处理工具<br /><br />
* **[Storage](#Storage)**<br />
本地缓存，假如浏览器不支持 localStorage，会改用 userData 来实现同样的功能，因此有很高兼容性<br /><br />
* **[ItvEvents](#ItvEvents)**<br />
事件定频器，它的作用是，使得绑定在指定元素上的指定事件的触发函数产生一定执行时间间隔，避免高频率触发事件时，函数随之高频率执行，以致影响应用的运行速度<br /><br />
* **[JsLoader](#JsLoader)**<br />
js脚本异步加载器，可以异步加载脚本，防止 DOM 加载阻塞，另外还支持依赖关系定义，保证脚本按照需要顺序加载<br /><br />
* **[Pager](#Pager)**<br />
分页生成器，通过异步请求的方式生成列表分页时非常有用<br /><br />
* **[Template](#Template)**<br />
模版引擎，源自知名的 underscore，非常小巧，功能强大，用于模版编译，从此和 HTML 拼接工作 say goodbye<br /><br />
* **[Tooltips](#Tooltips)**<br />
提示气泡工具，用于生产提示气泡，轻量、灵活、兼容性好<br /><br />
* **[GetStrCodeLength](#GetStrCodeLength)**<br />
获取字符串的字符长度方法（一个汉字为2字符长度）<br /><br />
* **[SubStrByCode](#SubStrByCode)**<br />
根据字符长度截字方法，由于汉字和英文数字的字符长度不同，按字数截字的效果往往无法满足有追求的工程师，此方法应运而生<br /><br />
* **[DateFormat](#DateFormat)**<br />
日期格式化方法，用于将日期转换成各种不同的显示格式<br />
<br />

<br />

#<a name="Monitor"></a>H.Monitor
H.Monitor 对象提供了3个方法：<br />
**H.Monitor.listen、H.Monitor.trigger、H.Monitor.unListen**<br />
<br /><br />
下面是3个方法的调用实例，注释是参数说明：
```
/*
 * H.Monitor.listen(condition, func);
 * 参数说明：
 * condition 【String】
 * 触发条件list的表达字符串，各个条件由英文逗号','分隔开
 * 字符串中的所有空格符都会被过滤掉，建议仅用英文和数字组织触发条件名
 * func 【function】 满足触发条件时，需要触发的函数
 * */
 
H.Monitor.listen('getData', function () {
    alert('success');
});
```

```
/*
 * H.Monitor.trigger(condition, params);
 * 参数说明：
 * condition 【String】
 * 触发条件名
 * 字符串中的所有空格符都会被过滤掉，建议仅用英文和数字组织触发条件名
 * params 【obj】
 * 满足触发条件时，传给触发的函数的公共参数
 * 多个触发条件分开触发时，分别传入的 params 参数对象将会合并（extend）
 * */
 
H.Monitor.trigger('getData', {
    name: 'Jack'
});
```

```
/*
 * H.Monitor.unListen(condition);
 * 参数说明：
 * condition 【String】
 * 触发条件list的表达字符串，各个条件由英文逗号','分隔开
 * 字符串中的所有空格符都会被过滤掉，建议仅用英文和数字组织触发条件名
 * */
 
H.Monitor.unListen('getData');
```

<br />

#<a name="Storage"></a>H.Storage
H.Storage 对象提供了3个方法：<br />
**H.Storage.get、H.Storage.set、H.Storage.remove**<br />
<br /><br />
下面是3个方法的调用实例，注释是参数说明：
```
/*
 * H.Storage.get(key);
 * 参数说明：
 * key 【String】 目标键名
 * */
 
H.Storage.get('myStorage');
```

```
/*
 * H.Storage.set(key, value);
 * 参数说明：
 * key 【String】 目标键名（为了避免在IE6上产生报错，请不要以数字或特殊符号作为键名开头）
 * value 【String】 要设置的值
 * */
 
H.Storage.set('myStorage', 1);
```

```
/*
 * H.Storage.remove(key);
 * 参数说明：
 * key 【String】 目标键名
 * */
 
H.Storage.remove('myStorage');
```

<br />

#<a name="ItvEvents"></a>H.ItvEvents
H.ItvEvents 对象提供了2个方法：<br />
**H.ItvEvents.addEvent、H.ItvEvents.removeEvent**<br />
<br /><br />
下面是2个方法的调用实例，注释是参数说明：
```
/*
 * H.ItvEvents.addEvent($el, eventType, eventName, fn, itvTime);
 * 参数说明：
 * $el 【JqueryObj】 要绑定事件的JqueryDOM对象
 * eventType 【String】 要绑定的事件类型
 * eventName 【String】 事件的命名空间
 * fn 【Function】 事件触发时要执行的函数
 * itvTime 【Int】 事件被连续触发时，对应的函数的执行间隔
 * */
 
H.ItvEvents.addEvent($(window), 'resize', 'resetSomeThing', function () {
    $('#someThing').width($(window).width());
}, 300);
```

```
/*
 * H.ItvEvents.removeEvent($el, eventType, eventName);
 * 参数说明：
 * $el 【JqueryObj】 要绑定事件的JqueryDOM对象
 * eventType 【String】 要绑定的事件类型
 * eventName 【String】 事件的命名空间
 * */
 
H.ItvEvents.removeEvent($(window), 'resize', 'resetSomeThing');
```

<br />

#<a name="JsLoader"></a>H.JsLoader
H.JsLoader 对象提供了1个方法：<br />
**H.JsLoader.get**<br />
<br /><br />
下面是这个方法的调用实例，注释是参数说明：
```
/*
 * H.JsLoader.get(module[, module...]);
 * 参数说明：
 * module 【Obj】【可以传多个,表示加载多个脚本】
 * 每个 module 对象包含了4个属性：
 * name 【String】 必传，要引入 JS 的模块名
 * url 【String】 必传，要引入 JS 的路径
 * requires 【String Array】 可选，此脚本依赖的模块（所依赖模块的模块名组成的集合）
 * callBack 【Function】 回调函数，脚本加载完后执行的回调函数
 * */

//加载单个脚本 
HaierJS.JsLoader.get({
    name: 'avalon',
    url: 'vendor/avalon/avalon.shim.js'
});

//加载多个脚本 
HaierJS.JsLoader.get({
    name: 'companyIndex',
    url: 'js/company-index.js',
    requires: ['avalon', 'jcrop', 'plupload']
}, {
    name: 'avalon',
    url: 'vendor/avalon/avalon.shim.js'
}, {
    name: 'jcrop',
    url: 'vendor/jcrop/jquery.Jcrop.min.js'
}, {
    name: 'plupload',
    url: 'vendor/plupload/plupload.full.min.js'
});
```

<br />
