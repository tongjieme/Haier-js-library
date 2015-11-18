#H.ajax
* 如有 功能增加建议 及 bug 反馈 请联系 插件维护者 曹志锋  
* 使用方法请看 demo 及注释

<br />

插件提供了 H.ajax，H.get，H.post 三个方法  
参数与 jquery 的 $.ajax 方法一致，且新增了一系列自定义属性： 
  
###reloadTimeout  
页面自动刷新延时(单位：毫秒，可缺省，不传的话页面立即刷新)  
<br />

###beforeReload  
页面刷新前的回调  
<br />

###pageChangeTimeout  
页面自动跳转延时(单位：毫秒，可缺省，不传的话页面立即刷新)  
<br />

###beforePageChange  
页面跳转前的回调  
<br />

###disabledBtn  
发送请求期间，需要置为不可点击状态的按钮（必须传入一个jquery对象）  
<br />

<br />

此外，参数对象的 url 和 success 属性是必传的。如果参数对象缺少两者其中之一，返回 false，并在控制台显示缺少必要参数的提示信息。  
当接口返回 Result 为 false。 success 回调不执行，但会在控制台返回错误信息。  
同时也会调用 error 回调，并传入两个参数（Result 和 Msg）。  
这里与正常的 ajax error 回调在参数上区别开来.  
假如你希望 error 回调只在正常的 ajax error 状态下执行，可以加入判断 if(arguments[0]){...} ,反之亦然。

<br />

调用实例：  
```
H.get({
    url: "http://138.128.213.88/data_test_a.json",
    data: {
        isGetLast: 1
    },
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "aa",
    cache: true,
    disabledBtn: $("#J-button-demo06"),
    success: function(data){
        H.log(data);
    }
});
```
