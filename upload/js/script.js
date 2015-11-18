var HaierJS = window.HaierJS || {};

HaierJS.upload = function($input, o){
	if(typeof o.formData == 'function') {
		$input.bind('fileuploadsubmit', function (e, data) {
		    data.formData = o.formData()
		});
	}
	o = $.extend({
		autoUpload: true,
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        sequentialUploads: true,
        formData: {},
	    add: function (e, data) {
            data.submit();
            !!!o.onAdd || o.onAdd(data);
        },
        submit: function(){
        	
        },
        progressall: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        !!!o.onProgressAll || o.onProgressAll(progress);
	    },
	    progress: function(e, data){
			var progress = parseInt(data.loaded / data.total * 100, 10);
	        !!!o.onProgress || o.onProgress(data.files[0].name, progress);
		},
		fail: function(e, data){
			console.log(data);
			console.log('上传失败:' + data.textStatus);
			!!!o.onFail || o.onFail(data.textStatus)
		},
		always: function(e, data){

		},
        done: function (e, data) {
        	// console.log(data);
        	!!!o.onDone || o.onDone(data);
        }
	}, o);
	
	$input.fileupload(o);
}


var uploadProgress = (function(){
	var init = function(){
		$('<div class="uploadProgress">\
			<h5 class="header"><i class="fa fa-cloud-upload"></i>文件上传<i class="fa fa-minus-square-o minify"></i></h5>\
			<div>\
			</div>\
		</div>').appendTo('body').hide();

		$('.minify').on('click', function(){
			$('.uploadProgress').toggleClass('minified');
		})
	};

	init();

	$('.uploadProgress .minify').on('click', function(){
		toggleMinify();
	})
	
	var minify = function(){
		$('.uploadProgress').addClass('minified')
	};

	var unMinify = function(){
		$('.uploadProgress').removeClass('minified')
	};

	var toggleMinify = function(){
		$('.uploadProgress').toggleClass('minified')
	};

	var add = function(name, progress){
		show();
		unMinify();
		var $list = (function(){
			if(isExist(name)) {
				getList(name).find('.progress').html(progress + '%');
			} else {
				$('<div class="list">\
							<span class=name>'+name+'</span> <span class="progress">'+progress+'%</span>\
						</div>').appendTo('.uploadProgress > div')
			}
		})()
	};

	var remove = function(name){
		getList(name).remove();
	};

	var hide = function(){
		$('.uploadProgress').hide();
	};

	var show = function(){
		$('.uploadProgress').show();
	};

	var isExist = function(name){
		return !!getList(name).length;
	};

	var getList = function(name){
		var el = $('')
		$.each($('.uploadProgress .name'), function(k,v){
			if($(v).html() == name) {
				el = $(v).closest('.list');
				return false;
			}
		})
		return el;
	};

	var clear = function(){
		$('.uploadProgress > div').html('')
		return uploadProgress;
	};

	return {
		add: add,
		clear: clear,
		minify: minify,
		unMinify: unMinify,
		toggleMinify: toggleMinify,
		remove: remove,
		hide: hide,
		show: show
	}
})()