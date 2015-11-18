#slick Slider

能满足大多数需求的slider, 兼容pc端 移动端
更多用法与demo 请查看官方文档(非常详细) http://kenwheeler.github.io/slick/

反馈:童
###常用初始化配置:
```html
<!-- 推荐使用 1.5.6 版本 -->
<link href="slick/slick.css" rel="stylesheet">
<link href="slick/slick-theme.css" rel="stylesheet">

<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
<script src="slick/slick.min.js"></script>

<div class="slides">
	<div class="slide">
		<img src="https://unsplash.it/500/300?image=50" alt="">
	</div>	
	<div class="slide">
		<img src="https://unsplash.it/500/300?image=51" alt="">
	</div>	
	<div class="slide">
		<img src="https://unsplash.it/500/300?image=52" alt="">
	</div>	
	<div class="slide">
		<img src="https://unsplash.it/500/300?image=53" alt="">
	</div>	
</div>
<script>
$('.slides').slick({
	dots          : true, // 是否显示 slider 底部的"点点"
	arrows        : true, // 是否显示 slider 箭头
	accessibility : false,// 是否允许键盘箭头控制(建议关闭)
	slidesToShow  : 1,		// 显示的slide 数目
	slidesToScroll: 1,      // 滚动的slide 数目
	autoplay      : true,   // 自动播放
	autoplaySpeed : 3000    // 自动播放间隔
});	
</script>
```

###其它API
```javascript
$('.slides').slick('slickCurrentSlide');
$('.slides').slick('slickGoTo');
$('.slides').slick('slickNext');
$('.slides').slick('slickPrev');
$('.slides').slick('setPosition');
```