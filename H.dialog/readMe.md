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
    title: 'Title',
    content: '这里只显示文案',
    timeout: 3000,
    quickClose: true,
    width: 300,
    backdropOpacity: 0.7,
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
    showCloseBtn: true,
    setMaxSize: true,
    content: $('#J-tpl-demo01').html(),
    quickClose: true,
    padding: 5,
    width: 400,
    height: 200,
    removeFlag: false,
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

<br />

dialog 初始化时可以传入一个对象，对象的属性就是配置项，下面是初始化配置项详解：

###title 【String】
弹窗标题
<br /><br />

###content 【String】
弹窗内容
<br /><br />

###quickClose 【Bool】
是否点击空白处快速关闭
<br /><br />

###padding 【Int】
弹窗内边距(当 title 属性没设置时，且 showCloseBtn 属性设置为 true 或者没设置【默认值就是 true】，padding 属性会被强制设置为 0)
<br /><br />

###width 【Int】
弹窗宽度(缺省时为自适应，但默认最大宽度为 1000)
<br /><br />

###height 【Int】
弹窗高度(缺省时为自适应，但默认最大高度为 600)
<br /><br />

###timeout 【Int】
多长时间后自动关闭（单位：毫秒）
<br /><br />

###activeCls 【String】
【事件触发列表】表示当前项的 css class （可缺省，默认值：active）
<br /><br />

###backdropOpacity 【String】
【事件触发列表】表示当前项的 css class （可缺省，默认值：active）
<br /><br />

###onshow 【Function】
弹窗弹出后执行的回调
<br /><br />

###onremove 【Function】
弹窗移除后执行的回调（请与 onclose 区别开来，大多数情况下请用 onremove，只有在 removeFlag 设为 false 时，采用 onclose）
<br /><br />

###onclose 【Function】
弹窗关闭后执行的回调（请与 onclose 区别开来，大多数情况下请用 onremove，只有在 removeFlag 设为 false 时，采用 onclose）
<br /><br />

###showCloseBtn 【Bool】
【高级选项】是否生成关闭按钮（当 title 属性没设置时，此属性才会生效，默认为 true，设置为 false 时，就不会为用户生成关闭按钮）
<br /><br />

###setMaxSize 【Bool】
【高级选项】是否指定弹窗的最大高度（默认为true，绝大多数情况下使用默认值即可，特殊情况下可设为false）
<br /><br />

###removeFlag 【Bool】
【高级选项】关闭窗口时，是否销毁 dom，默认为 true。当设置为 false 时，quickClose 配置属性会强制设为 false （因为 quickClose 触发的关闭弹窗会把 dom 销毁）
<br /><br />
