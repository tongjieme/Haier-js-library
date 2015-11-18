// version 1.0		update: 7.29
var HaierJS = window.HaierJS || {};

	$.fn.autoComplete = function(options){
		var This = this;
		var show = function(){
			reset();
			$html.show();
		};

		var hide = function(){
			$html.hide();
		};

		var update = function(list, isFilter){
			if(!!!isFilter && typeof o.items != 'function') {
				o.items = list;	
			}
			$html.find('ul').html((function(){
				var s = '';
				$.each(list, function(k,v){
					s += '<li>'+v+'</li>'
				});
				return s;
			})())
		};

		var reset = function(){
			$html.css({
				left: o.$input.offset().left,
				top: o.$input.offset().top + o.$input.outerHeight(),
				width: o.$input.outerWidth()
			});
		}

		var o = $.extend({
			items: [],
			$input: $(This)
		}, options)
		var $html = $('<div class="autoComplteWrap"><ul></ul></div>');

		o.$input.attr('autocomplete', 'off');
		$html.appendTo('body');
		update(o.items);
		reset();

		if(typeof o.items == 'function') {
			o.items.call({
				update: update
			});
		}


		$html.on('click', 'li', function(e){
			e.preventDefault();
			e.stopPropagation();
			o.$input.val($(this).text())
			hide();
		})
		o.$input.on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			show();
		})

		o.$input.on('keyup', function(e){
			if(e.keyCode == 40) {
				if(!!!$html.find('li.active').length) {
					$html.find('li').eq(0).addClass('active')
				} else {
					var $active = $html.find('li.active');
					if(!!$active.next().length) {
						$active.removeClass('active').next().addClass('active');
					} else {
						$active.removeClass('active')
						$html.find('li').eq(0).addClass('active');
					}
				}
				return;
			}
			if(e.keyCode == 38) {
				if(!!!$html.find('li.active').length) {
					$html.find('li').eq(-1).addClass('active')
				} else {
					var $active = $html.find('li.active');
					if(!!$active.prev().length) {
						$active.removeClass('active').prev().addClass('active');
					} else {
						$active.removeClass('active')
						$html.find('li').eq(-1).addClass('active');
					}
				}
				return;
			}
			if(e.keyCode == 13) {
				if(!!$html.find('li.active').length) {
					o.$input.val($html.find('li.active').text())
					hide();
				}
				return;
			}
			show();

			if(typeof o.items == 'function') {
				clearTimeout($('body').data('autocompleteTimer'));
				$('body').data('autocompleteTimer', setTimeout(function() {
					o.items();      
				}, o.delay || 200))
				
			} else {
				update($.grep(o.items, function(s){
					return s.indexOf(o.$input.val()) > -1;
				}), true)
			}
			
		})

		$('html').on('click', function(){
			hide();
		})

		$html.hide();

	return {
		show: show,
		hide: hide,
		update: update
	}
};