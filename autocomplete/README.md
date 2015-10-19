#autocomplete 组件

反馈: 童

demo: http://tongjieme.github.io/Haier-js-library/autocomplete/


##用法
###引入
```
<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
<script src="autocomplete/autocomplete.js"></script>
<link href="autocomplete/autocomplete.css" rel="stylesheet">
```
###普通模式
```html
<input type="search" id="search">

<script>
$("#search").autoComplete({
	items: ["浏览器", "下载工具", "远程控制邮件处理", "FTP工具 ", "IP工具  网络推广", "网页制作", "网络辅助"]
});
</script>
```

###异步数据模式
```html
<input type="text" id="ajaxSearch">
<script>
var a = $("#ajaxSearch").autoComplete({
			delay: 200, // keyup 事件的延迟
			items: function(){
				var This = this;
				$.ajax({
					url: 'data.json',
					data: {},
					dataType: 'json',
					timeout: 20e3,
			        error: function(a,b){alert(b);},
					success: function(data) {
						This.update(data.items)
					}
				});
			}
		});
</script>
```

###API
```javascript
var input = $('#input').autoComplete();

input.update(['item1', 'item2']);
input.show();
input.hide();
```