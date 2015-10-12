var HaierJS = window.HaierJS || {};



HaierJS.plupload = function(options){
	var initHolder = $.extend({}, options.init);
	delete options.init;

	var uploader = new plupload.Uploader($.extend({
		url : '../file.php',
		browse_button : 'pickfiles', // button id

		runtimes : 'html5,flash,silverlight,html4',
		flash_swf_url : '../js/Moxie.swf',
		silverlight_xap_url : '../js/Moxie.xap',
		multi_selection: true,// default
		
		filters : {
			max_file_size : '500kb',
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png"},
				{title : "Zip files", extensions : "zip"}
			],
			prevent_duplicates: false // default
		},

		chunk_size: 0,

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