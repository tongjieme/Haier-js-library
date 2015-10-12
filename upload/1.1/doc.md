#plupload 上传组件
基于 www.plupload.com/docs/

###与官方API 完全兼容 的基础上增加:
初始化参数
* `autoUpload`: 选择文件后自动上传 默认为false
* `multipart_params`: 可传object json 或者 返回json 的 function(){} 若为function 每次上传都为运行以拿到最新数据(常用于表单)
* `Error`: 发生错误都会console.log 错误信息

###示例代码
```javascript
var uploader = HaierJS.plupload({
	url: 'http://admin.main.test.hotoem.com/Common/UploadImage?dir=image', 
				// http://admin.main.test.hotoem.com/Common/UploadImage?dir=image
	browse_button: 'uploadBtn', // 触发选择文件的 DOM 元素 ID
	autoUpload: true, // 可选 默认为false
	file_data_name: 'file', // 可选 默认为 当前值
	multi_selection: false, // 可选 默认为 true
	multipart_params: function(){ // 可选
		return {
			username: 'abc'
		}
	},
	filters : { // 可选 默认为当前配置
		max_file_size : '500kb',
		mime_types: [
			{title : "Image files", extensions : "jpg,gif,png"},
			{title : "Zip files", extensions : "zip"}
		],
		prevent_duplicates: false // default
	},
	init: {
		FileUploaded: function(up, files, response, json){
			// 上传成功后执行
			console.log(response);
			console.log(json);
		},
		PostInit: function(up, file){ // 可选
			// 初始化执行
			alert("初始化");
		},
		BeforeUpload: function(up, file){ // 可选
			// 上传之前执行
			alert('上传之前');
		},
		FilesAdded: function(up, file){ // 可选
			// 添加文件执行
		},
		UploadProgress: function(up, file){ // 可选
			console.log(file.percent);
		},
		Error: function(up, err){ // 可选
			console.log(err);
			alert('error');
		}
	}
});
```

###最小配置
```javascript
var uploader = HaierJS.plupload({
	url: 'http://admin.main.test.hotoem.com/Common/UploadImage?dir=image', 
	browse_button: 'uploadBtn2',
	autoUpload: true, // 可选 默认为false
	init: {
		FileUploaded: function(up, files, response, json){
			// 上传成功后执行
			console.log(response);
			console.log(json);
		}
	}
});
```

###特别说明
如果设定 `autoUpload: false` 的话
可以通过 `uploader.start()` 启动上传