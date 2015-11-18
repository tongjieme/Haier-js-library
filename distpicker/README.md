#地区选择

###示例

http://tongjieme.github.io/Haier-js-library/distpicker/

```html
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="js/distpicker.data.js"></script>
<script src="js/mydistpicker.js"></script>


<h3>初始化</h3>
<div id="J-distpicker2">
    <select></select>
    <select></select>
    <select></select>
</div>
<h3>初始化已选地区</h3>
<div id="J-distpicker">
    <!-- 对应省市区的变好 -->
    <select data-selected="140000"></select>
    <select data-selected="140100"></select>
    <select data-selected="140105"></select>
</div>
<h3>初始化多个实例</h3>
<div class="distpicker">
    <select></select>
    <select></select>
    <select></select>
</div>
<div class="distpicker">
    <select></select>
    <select></select>
    <select></select>
</div>

<script>
$(function() {
	$("#J-distpicker").distpicker({});
	$("#J-distpicker2").distpicker({});
	$('.distpicker').distpicker();
});
</script>
```
