#H.dialog
* 如有 功能增加建议 及 bug 反馈 请联系 插件维护者 曹志锋  
* 使用方法请看 demo 及注释

<br />

原版官方文档：[http://aui.github.io/artDialog/doc/index.html](http://aui.github.io/artDialog/doc/index.html)
如果例子中的属性配置不能满足需要，可参考原版官方文档

<br />

调用实例一【常规弹窗】：
```
var d = H.dialog({
    title: 'Title',//弹窗标题
    content: '这里只显示文案',//弹窗内容
    timeout: 3000,//多长时间后自动关闭（单位：毫秒）
    quickClose: true,//点击空白处快速关闭
    width: 300,
    backdropOpacity: 0.7,//遮罩层透明度(默认0.7)
    onshow: function(){
        //alert('弹窗弹出后执行的回调');
    }
});

d.show();
```

<br />

调用实例二【不会自动销毁的弹窗】：
```
//定义一个弹窗
var myDialog = H.dialog({
    showCloseBtn: true,//是否生成关闭按钮（当title属性没设置时，此属性才会生效，默认为true，设置为false时，就不会为用户生成关闭按钮）
    setMaxSize: true,//是否指定弹窗的最大高度（默认为true，绝大多数情况下使用默认值即可，特殊情况下可设为false）
    content: $('#J-tpl-demo01').html(),//弹窗内容
    quickClose: true,//点击空白处快速关闭
    padding: 5,//弹窗内边距(当title属性没设置时,且showCloseBtn属性设置为true或者没设置【默认值就是true】，padding属性会被强制设置为0)
    width: 400,//弹窗宽度(缺省时为自适应，但默认最大宽度为1000)
    height: 200,//弹窗高度(缺省时为自适应，但默认最大高度为600)
    removeFlag: false,//【高级选项】关闭窗口时，是否销毁dom，默认为true，当设置为false时，【quickClose】配置会强制设为false（因为quickClose触发的关闭弹窗会把dom销毁）
    backdropOpacity: 0.7,//遮罩层透明度(默认0.7)
    onshow: function(){
        //alert('弹窗弹出后执行的回调');
    },
    onclose: function(){
        //alert('弹窗关闭后执行的回调');
    }
});

//不会自动销毁的弹窗，请使用 showModal 显示出来，否则遮罩层会无法显示
myDialog.showModal();
```
