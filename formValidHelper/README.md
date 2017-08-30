# 表单验证组件

依赖 tooltipster

## 使用示例
```
<form action="#">
	<input type="text" data-valid="required email" placeholder="Email:">
</form>
<script>
	formValid.submitValid($('form'));
</script>
```

```
<form action="#">
	<input type="text" data-valid="required email" placeholder="Email:">
	<input type="text" data-valid="minLength_10" placeholder="最少长度10">
</form>
<script>
	formValid.blurValid($('form'));
</script>
```

## API
```
form.test($('<input type="text" data-valid="minLength_10" placeholder="最少长度10">'));
// return Object {isPassed: false, type: "required", msg: "* This fields is required."}

form.tests($('[data-valid]'));
// return Object {isPassed: false, list: [{$el: $el, type: 'required'}]}

formValid.test($input)
// return Object {isPassed: false, type: "required", msg: "* This fields is required."}
// 显示tooltips

formValid.tooltips.error($input, 'message');
// 只显示tooltips

formValid.test($input)
formValid.tests($inputs)

formValid.blurValid($form)
formValid.submitValid($form)
// e.preventDefault()
```

### 自定义验证规则
```
<input type="text" data-valid="abc_1">
<script>
form.isAbc = function($el){
	console.log(arguments);
	return {
			isPassed: false,
			type: 'abc',
			msg: 'abc'
		};
}
</script>
```

### 可选验证类型
* required
* email
* chinese
* noChinese
* zipcode
* mobile
* phone
* phoneCn
* numbers
* numbers_dot
* abc
* numbers_abc_underline
* url
* username
* price
* chinaIdLoose
* chinaZip
* ipv4
* url
* minLength
* maxLength
