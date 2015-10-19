#日历选择

基于 http://stefangabos.ro/jquery/zebra-datepicker/ <br>

demo http://tongjieme.github.io/Haier-js-library/datePicker

###用法
```html
<script src="http://code.jquery.com/jquery-1.8.1.min.js"></script>
<script src="datepicker/zebra_datepicker.src.js"></script>
<link href="datepicker/bootstrap.css" rel="stylesheet">
```

###默认模式
```
<input type="text" class="datePicker">
```

###future only 模式
```
<input type="text" class="datePickerFuture">
```

###时间范围模式
```html
<input type="text" class="datePickerBegin1">
<input type="text" class="datePickerEnd1">
```

###更多自定义请使用官方初始化方式
####具体参数请查阅[官方文档](http://stefangabos.ro/jquery/zebra-datepicker/)
```javascript
$('.myinput').Zebra_DatePicker({});
```