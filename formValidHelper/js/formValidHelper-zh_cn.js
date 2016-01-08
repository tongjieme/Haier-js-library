/* Begin formvalidhelper
================================================== */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.form = factory();
    }
}(this, function() {
	function capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
    var reg = {
			email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
			chinese: /^[\u0391-\uFFE5]+$/,
			zipcode: /^[1-9]\d{5}$/,
			mobile: /^1[3-9][0-9]{9}$/,
			phone: /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
			phoneCn: /^(0[1-9][0-9]{1,2}-?[2-9][0-9]{4,})|([4|8]00[0-9]{7})$/,
			numbers: /^[0-9]*$/,
			numbers_dot: /^[0-9\.]*$/,
			abc: /^[A-Za-z]+$/,
			numbers_abc_underline: /^\w+$/,
			url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
			username: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
			price: /^\d+(\.\d+)?$/,
			chinaIdLoose: /^(\d{18}|\d{15}|\d{17}[xX])$/,
			chinaZip: /^\d{6}$/,
			ipv4: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
			url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
		},
		msg = {
			noChinese: '* Chinese character is not allowed.',
			required: '* 此项为必填项.',
			numbers: '* 请填写数字(不含小数点)',
			email: '* 电子邮件格式有误.',
            minLength: '* 此项不得少于 {{1}} 个字符.',
            maxLength: '* 此项不得多于 {{1}} 个字符.',
            noNumbers: '* 此项不能全为数字',
            numbersFixed2: '* 此项为数字且最多保留两位数字'
		},
		types = ['email', 'url'];

	var inArray = function(array, v) {
	    for(var i=0; i < array.length; i++) {
	        if(array[i] === v) {return true;}
	    }
	    return false;
	};

	var test = function($el, func){
		var result = {
			isPassed: true,
			type: ''
		};

		if(!!!$el.data('valid')) {
			return result;
		}

		var options = $el.data('valid').split(' ');

		$.each(options, function(k,v){
			var r;
			if(v.indexOf('_') > -1) {
				var args = v.split('_'),
					functionName = 'is' + capitalizeFirstLetter(args[0]),
					type = capitalizeFirstLetter(args[0]);

				args[0] = $el;

				r = form[functionName].apply(undefined, args);
				if(r.isPassed) {
					return true;
				} else {
					result = r;
					return false;
				}

			}
			if(form['is' + capitalizeFirstLetter(v)] !== undefined) {
				r = form['is' + capitalizeFirstLetter(v)]($el);
				if(r.isPassed == false) {
					result = r;
					return false;
				}
			} else {
				r = isRegex($el,v);
				if(r.isPassed == false) {
					result = r;
					return false;
				}
			}
		});

		// if(result.isDeferred && typeof result.func == 'function' ) {
		// 	result.deferred.always(function(abc){
		// 		result.func(abc);
		// 	});
		// }

		return result;
	};

	var tests = function($els){
		var result = {
			isPassed: true,
			list: []
		};

		$.each($els, function(k,v){
			var r = test($(v));

			if(!r.isPassed) {
				result.isPassed = false;
				result.list.push({
					type: r.type,
					$el: $(v)
				});
			}

		});

		return result;
	};

	var isRequired = function($el){
		var flag = true;
		if( $el.is('[type=radio]') ) {
			if($el.closest('form').find('[name='+$el.attr('name')+']:checked').length) {
				return {
					isPassed: flag,
					type: 'required'
				};
			} else {
				flag = false;
			}
		}
		if(flag && $el.is('[type=checkbox]') && !$el.is(':checked')) {
			flag = false;
		}
		if(flag && $el.val() === null || !$el.val().length || ($el.prop('tagName') == 'SELECT' && $el.val() == -1) ) {
			flag = false;
		}
		if(flag && $el.data('default') && $el.val() === $el.data('default') ) {
			flag = false;
		}

		return {
			isPassed: flag,
			type: 'required',
			msg: msg['required']
		}
	};

	var isNoChinese = function($el){
		return {
			isPassed: /^[^\u4e00-\u9fa5]{0,}$/.test($el.val()),
			type: 'noChinese',
			msg: msg['noChinese']
		};
	};

	var isRegex = function($el, regex){
		if($el.val().length == 0) {
			return {
				isPassed: true,
				type: ''
			};
		}
		var regexText = regex,
			regex = reg.hasOwnProperty(regexText) ? reg[regexText] : regex;
		if( regex.test($el.val()) ) {
			return {
				isPassed: true,
				type: regexText,
				msg: msg[regexText]
			};
		}
		return {
			isPassed: false,
			type: regexText,
			msg: msg[regexText]
		};
	};

	var isEqual = function($el){
		return {
			isPassed: $el.val() === $('[name='+arguments[1]+']').val(),
			type: 'equal',
			msg: '* fields do not match'
		};
	};

	var isMinLength = function($el, length){
		return {
			isPassed: $el.val().length === 0 || $el.val().length >= parseInt(length),
			type: 'minLength',
			msg: msg['minLength'].replace('{{1}}', length)
		}
	};

	var isMaxLength = function($el, length){
		return {
			isPassed: $el.val().length <= parseInt(length),
			type: 'maxLength',
			msg: msg['maxLength'].replace('{{1}}', length)
		}
	};

	var isLessThan = function(){

	};

	var isMoreThan = function(){

	};

	var isAjax = function($el){

	};

	var form = {
			test: test,
			tests: tests,
			isEqual: isEqual,
			isRegex: isRegex,
			isRequired: isRequired,
			isMinLength: isMinLength,
            isMaxLength: isMaxLength,
			isNoChinese: isNoChinese,
			msg: msg
		};

	return form;
}));




if($.fn.tooltipster !== undefined) {
	window.formValid = (function(){
		var tooltips = (function(){
			var show = function($el, o){
				if($el.data('tooltipster-ns') !== undefined) {
					$el.tooltipster('destroy');
				}
				$el.tooltipster(o).tooltipster('show');
			};

			var error = function($el, msg, isScroll){

				var showTooltips = function(){
					show($el, {
					    position: 'top-right',
					    theme: 'tooltipster-error',
					    maxWidth: 300,
					    contentAsHTML: true,
					    content: msg || 'This field is invalid.',
					    hideOnClick: true,
					    trigger: 'custom',
					    autoClose: true,
					    timer: 5000,
					    interactive: true,
					    debug: false,
					    functionAfter: function(){

					    }
					});
				}

				if(!isScroll) {
					showTooltips();
				} else {
					to($el, function(){
						showTooltips();
					});
				}

			};

			var hide = function($el){
				if($el.data('tooltipster-ns') === undefined) {
					return;
				}
				$el.tooltipster('hide');
			};

			return {
				show: show,
				hide: hide,
				error: error
			}
		})();

		var test = function($el, isScroll){
			var r = form.test($el);
			if(r.isPassed == false && r.isDeferred !== true) {
				if(!isScroll) {
					tooltips.error($el, r.msg);
				} else {
					to($el, function(){
						tooltips.error($el, r.msg);
					});
				}
			}
			return r;
		};

		var tests = function($els,o){
			var result = {
				isPassed: true,
				list: []
			};

			if(o === undefined) {
				o = {}
			}

			var showOneMessage = typeof o.showOneMessage === 'undefined' ? this.showOneMessage : o.showOneMessage,
				autoPositionUpdate = typeof o.autoPositionUpdate === 'undefined' ? this.autoPositionUpdate : o.autoPositionUpdate;

			$.each($els, function(k,v){
				var r = test($(v));

				if(!r.isPassed) {
					result.isPassed = false;
					result.list.push({
						type: r.type,
						$el: $(v),
						msg: r.msg
					});
					if(showOneMessage) {
						return false;
					}
				}
			});

			if(autoPositionUpdate && result.list.length > 0) {
				var $el = result.list[0].$el;
				tooltips.hide($el);
				to($el, function(){
					if(o.autoFocus) {
						$el.trigger('focus');
					}
					tooltips.error($el, result.list[0].msg);
				});
			}
			return result;
		};

		var to = function($el, func){
			$('html, body').animate({
				scrollTop: $el.offset().top - $(window).height()/2
			}, function(){
				if(func) {
					func($el);
				}
			});
		};

		var blurValid = function($form){
			$form.on('focus', '[data-valid]', function(){
				tooltips.hide($(this));
			}).on('blur', '[data-valid]', function(){
				test($(this));
			});
		};

        var submitValid = function($form, o){
            blurValid($form);
            $form.on('submit', function(e){
                var r = formValid.tests($form.find('[data-valid]'), o);
                if(r.isPassed === false) {
                    e.preventDefault();
                }
            });
        };


		return {
			test: test,
			tests: tests,
			blurValid: blurValid,
			tooltips: tooltips,
            submitValid: submitValid,
            to: to
		}
	})();
}

/* End formvalidhelper
================================================== */