/*
	版本: 1.0
	更新时间: 7.29
*/

var HaierJS = window.HaierJS || {};

if(window.console == undefined) {
	window.console = {
		log: function(){}
	}
}

HaierJS.plupload = function(options){
	var initHolder = $.extend({}, options.init);
	delete options.init;

	var uploader = new plupload.Uploader($.extend({
		url : '../file.php',
		browse_button : 'pickfiles', // button id

		runtimes : 'html5,flash,silverlight,html4',
		flash_swf_url : './plupload/Moxie.swf',
		silverlight_xap_url : './plupload/Moxie.xap',
		multi_selection: true,// default
		
		filters : {
			max_file_size : '500kb',
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png"},
				{title : "Zip files", extensions : "zip"}
			],
			prevent_duplicates: false // default
		},

		//chunk_size: 0,

		init: (function(){
			return $.extend({}, initHolder, {
						BeforeUpload: function(up, file){
							if(typeof options.multipart_params == 'function') {
								up.setOption('multipart_params', options.multipart_params());
							}
							!!!(initHolder && initHolder.BeforeUpload) || initHolder.BeforeUpload(up, file);
						},
						FilesAdded: function(up, file){
							!!!initHolder.FilesAdded || initHolder.FilesAdded(up, file);
							if(options.autoUpload) {
								uploader.start()
							}
						},
						FileUploaded: function(up, files, response){
							var json = {};
							try {
							    json = $.parseJSON(response.response)
							}
							catch(err) {
							    
							} 
							finally {
								!!!initHolder.FileUploaded || initHolder.FileUploaded(up, files, response, json);    
							}
							
						},
						Error: function(up, err){
							console.log(err.code);
							console.log(err.message);
							!!!(initHolder && initHolder.Error) || initHolder.Error(up, err);
						}
					})
		})()
	}, options));

	uploader.init();

	return uploader;
};
