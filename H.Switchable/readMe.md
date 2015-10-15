#H.Switchable
* 如有 功能增加建议 及 bug 反馈 请联系 插件维护者 曹志锋  
* 使用方法请看 demo 及注释

<br />

Switchable 是一个类，因此可以生成多个实例。也就是说，一个页面存在多个不同的轮播时，可以有各自不同的配置。

<br />

调用实例：
```
var switchable = new H.Switchable({
    effect: 'fadeX',
    panelDom: $('#J-panel-list'),
    triggerDom: $('#J-trigger-list'),
    triggerDomEvent: 'mouseover',
    prevDom: $('#J-btn-prev'),
    nextDom: $('#J-btn-next'),
    trigger: 'click',
    activeCls: 'active',
    interval: 2000,
    scrollTriggerDom: true
});

switchable.init();
```

<br />

Switchable 初始化时可以传入一个对象，对象的属性就是配置项，下面是初始化配置项详解：
  
###effect 【String】
轮播切换效果，可用值：fadeX、slideX、fadeY、slideY （可缺省，默认值：slideX）
<br /><br />

###panelDom 【Jquery Obj】
轮播切换列表，将对其内部子元素进行轮播
<br /><br />

###triggerDom 【Jquery Obj】
事件触发列表，与轮播切换列表一一对应，点击对应的子节点，就会切换到对应的轮播区域
<br /><br />

###triggerDomEvent 【String】
【事件触发列表】轮播切换触发方式 （可缺省，默认值：click）
<br /><br />

###prevDom 【Jquery Obj】
跳转至上一张按钮 （可缺省）
<br /><br />

###nextDom 【Jquery Obj】
跳转至下一张按钮 （可缺省）
<br /><br />

###trigger 【String】
【prev、next按钮】轮播切换触发方式 （可缺省，默认值：click）
<br /><br />

###activeCls 【String】
【事件触发列表】表示当前项的 css class （可缺省，默认值：active）
<br /><br />

###interval 【Int】
轮播间隔（可缺省，默认值：3000，单位：毫秒）
<br /><br />

###scrollTriggerDom 【Bool】
事件触发列表滚动开关（高级扩展选项，控制图片下方的小图区是否需要滚动，可缺省，默认值：false）
<br /><br />

<br />

switchable对样式和DOM结构有很强的依赖性
所以使用前一般需要联系我调整样式，或者直接拿demo样式作修改
