'use strict';
(function ($) {
    //修复 IE8 以下不支持 indexOf 导致产生错误的 bug
    if (!Array.indexOf) {
        Array.prototype.indexOf = function(obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    var methods = {
        //初始化
        init : function (options) {
            var $form = this;

            if (!$form.data('jqv') || $form.data('jqv') == null) {
                options = methods._saveOptions($form, options);
            }

            $(document).on('click.hideVeErrMsg', '[data-tips-for-field]', function () {
                $(this).fadeOut(300);
            });

            return $form;
        },

        //基本控件的事件绑定
        attach : function (userOptions) {
            var $form = this,
                options;

            if (userOptions) {
                options = methods._saveOptions($form, userOptions);
            } else {
                options = $form.data('jqv');
            }

            //为控件做事件绑定
            if (options.bindFlag) {
                //非 checkbox、radio 以及 非使用了 datepicker 的文本框
                $form.on(options.validationEventTrigger + '.ve', '[' + options.validateAttribute + '*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)', methods._onFieldEvent);
                //checkbox、radio
                $form.on('click.ve', '[' + options.validateAttribute + '*=validate][type=checkbox],[' + options.validateAttribute + '*=validate][type=radio]', methods._onFieldEvent);
                //使用了 datepicker 的文本框
                $form.on(options.validationEventTrigger + '.ve', '[' + options.validateAttribute + '*=validate][class*=datepicker]', {delay: 300}, methods._onFieldEvent);
            }

            //为【跳过验证】直接提交按钮绑定事件
            $form.on('click.ve', 'a[data-ve-skip], button[data-ve-skip], input[data-ve-skip]', methods._submitButtonClick);
            $form.removeData('jqv_submitButton');

            //绑定表单提交触发事件回调
            $form.on('submit.ve', methods._onSubmitEvent);
            return this;
        },

        //解除基本控件的事件绑定
        detach : function () {
            var $form = this,
                options = $form.data('jqv');

            $form.find('[' + options.validateAttribute + '*=validate]').not('[type=checkbox]').not('[type=radio]').off(options.validationEventTrigger + '.ve');
            $form.find('[' + options.validateAttribute + '*=validate][type=checkbox],[' + options.validateAttribute + '*=validate][type=radio]').off('click.ve', methods._onFieldEvent);

            $form.off('submit.ve', methods._onSubmitEvent);
            $form.removeData('jqv');

            $form.off('click.ve', 'a[data-ve-skip], button[data-ve-skip], input[data-ve-skip]', methods._submitButtonClick);
            $form.removeData('jqv_submitButton');

            return this;
        },

        //保存设置
        _saveOptions : function ($form, options) {
            if ($.validationEngineLanguage) {
                var allRules = $.validationEngineLanguage.allRules;
            } else {
                $.error('jQuery.validationEngine rules are not loaded, plz add localization files to the page');
            }

            //设置校验规则
            $.validationEngine.defaults.allrules = allRules;

            var userOptions = $.extend(true, {}, $.validationEngine.defaults, options);

            $form.data('jqv', userOptions);

            return userOptions;
        },

        _onFieldEvent : function (event) {
            var $field = $(this),
                $form = $field.closest('form, .J-ve-cont'),
                options = $form.data('jqv');

            options.eventTrigger = 'field';

            window.setTimeout(function() {
                methods._validateField($field, options);

                if (options.InvalidFields.length == 0 && options.onFieldSuccess) {
                    //校验成功时的回调
                    options.onFieldSuccess();
                } else if (options.InvalidFields.length > 0 && options.onFieldFailure) {
                    //校验失败时的回调
                    options.onFieldFailure();
                }
            }, (event.data) ? event.data.delay : 0);
        },

        _submitButtonClick : function (e) {
            var $button = $(this),
                $form = $button.closest('form, .J-ve-cont');

            $form.data('jqv_submitButton', $button.attr('id'));
        },

        _onSubmitEvent : function (e) {
            var $form = $(this),
                options = $form.data('jqv');

            //check if it is trigger from skipped button
            if ($form.data('jqv_submitButton')) {
                var $submitButton = $('#' + $form.data('jqv_submitButton'));
                if ($submitButton.length > 0) {
                    if ($submitButton.hasClass('validate-skip') || $submitButton.attr('data-validation-engine-skip') == 'true') {
                        return true;
                    }
                }
            }

            options.eventTrigger = 'submit';

            //校验表单中所有控件的值
            var r = methods._validateFields($form);

            if (options.onValidationComplete) {
                //如果用户自定义了表单验证完成回调，则执行之
                return !!options.onValidationComplete($form, r);
            }

            return r;
        },

        /*
        * 表单验证方法
        * 验证通过是返回 true，否则返回 false
        * */
        validate : function () {
            var $this = this,
                valid = null; //校验结果

            if ($this.is('form') || $this.hasClass('J-ve-cont')) {
                //校验整个表单
                if ($this.hasClass('validating')) {
                    //表单校验中...（防止多次快速连续校验）
                    return false;
                } else {
                    $this.addClass('validating');

                    var options = $this.data('jqv'),
                        valid = methods._validateFields($this);

                    //0.1秒后移除校验中状态class
                    setTimeout(function(){
                        $this.removeClass('validating');
                    }, 100);

                    if (valid && options.onSuccess) {
                        options.onSuccess();
                    } else if (!valid && options.onFailure) {
                        options.onFailure();
                    }
                }
            } else {
                //校验某个控件
                var $form = $this.closest('form, .J-ve-cont'),
                    options = ($form.data('jqv')) ? $form.data('jqv') : $.validationEngine.defaults,
                    valid = methods._validateField($this, options);

                if (valid && options.onFieldSuccess) {
                    options.onFieldSuccess();
                } else if (options.onFieldFailure && options.InvalidFields.length > 0) {
                    options.onFieldFailure();
                }
            }

            if (options.onValidationComplete) {
                //如果用户自定义了表单验证完成回调，则执行之
                return !!options.onValidationComplete($form, valid);
            }

            return valid;
        },

        /*
         * 值验证方法（仅供内部调用）
         * 验证通过是返回 true，否则返回 false
         * */
        _validateFields : function ($form) {
            var options = $form.data('jqv'),
                errorFound = false, //错误标记，当校验出现错误，它会被设为true
                first_err = null; //用来缓存第一个出现报错的控件

            //触发 开始进行表单校验 钩子
            $form.trigger('jqv.form.validating');

            //对表单中包含校验标记的所有控件的值进行校验
            $form.find('[' + options.validateAttribute + '*=validate]').not(':disabled').each(function () {
                var $field = $(this),
                    names = []; //缓存已经验证过的控件类型

                //如果这一类（name属性相同的控件为同一类）控件还没进行验证
                if ($.inArray(this.name, names) < 0) {
                    errorFound |= methods._validateField($field, options);

                    if (errorFound && first_err == null) {
                        //如果尚未出现校验报错
                        if ($field.is(':hidden') && options.prettySelect && $field.is('select')) {
                            //如果是隐藏控件（用户自定义生成的下拉框，原控件会被隐藏掉）
                            $field = $form.find('#' + $field.data('prettySelect'));
                        }
                        first_err = $field;

                    }

                    if (options.doNotShowAllErrorsOnSubmit) {
                        //如果设置了表单提交时不展示任何错误信息，直接返回校验结果 false
                        return false;
                    }

                    //将当前类型添加到 names 列表
                    names.push($field.attr('name'));

                    if (options.showOneMessage == true && errorFound) {
                        //如果设置了只展示一条错误信息，且发现控件验证不通过
                        return false;
                    }
                }
            });

            //触发 表单校验完成 钩子
            $form.trigger('jqv.form.result', [errorFound]);

            if (errorFound) {

                if (options.scroll) {
                    var destination = first_err.offset().top,
                        fixLeft = first_err.offset().left;

                    $('html, body').animate({
                        scrollTop: destination,
                        scrollLeft: fixLeft
                    }, 500, function(){
                        if(options.focusFirstField) {
                            first_err.focus();
                        }
                    });

                } else if (options.focusFirstField) {
                    first_err.focus();
                }

                return false;
            }

            return true;
        },

        /*
         * 值验证方法（仅供内部调用）
         * 验证通过是返回 false，否则返回 true
         * */
        _validateField : function ($field, options) {
            if ($field.is(':hidden') && !options.prettySelect && $field.is('select') || $field.parent().is(':hidden')) {
                return false;
            }

            var veRules = $field.attr(options.validateAttribute),
                veRulesList = /validate\[(.*)\]/.exec(veRules);

            if (!veRulesList) {
                return false;
            }

            var str = veRulesList[1],
                rules = str.split(/\[|,|\]/),
                fieldName = $field.attr('name'),
                promptText = '',
                required = false,
                limitErrors = false,
                $form = $field.closest('form, .J-ve-cont');

            options.isError = false;

            if (options.maxErrorsPerField > 0) {
                //如果设置了最大错误信息提示数量
                limitErrors = true;
            }

            for (var i = 0, rulesLen = rules.length; i < rulesLen; i++) {
                //移除空格符
                rules[i] = rules[i].replace(' ', '');
                if (rules[i] === '') {
                    //移除内容为空的元素
                    delete rules[i];
                }
            }

            for (var i = 0, field_errors = 0; i < rules.length; i++) {

                if (limitErrors && field_errors >= options.maxErrorsPerField) {
                    //如果设置了最大错误信息提示数，且校验出错数 >= 该最大提示数
                    if (!required) {
                        var have_required = $.inArray('required', rules);
                        required = (have_required != -1 && have_required >= i);
                    }
                    break;
                }

                var errorMsg = undefined;

                switch (rules[i]) {
                    case 'required':
                        required = true;
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._required);
                        break;

                    case 'custom':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._custom);
                        break;

                    case 'groupRequired':
                        //这里做过比较大的修改，需要校验是否会出现问题
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._groupRequired);

                        if (errorMsg) {
                            required = true;
                        }

                        break;

                    case 'minSize':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._minSize);
                        break;

                    case 'maxSize':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._maxSize);
                        break;

                    case 'min':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._min);
                        break;

                    case 'max':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._max);
                        break;

                    case 'past':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._past);
                        break;

                    case 'future':
                        errorMsg = methods._getErrorMessage($form, $field ,rules[i], rules, i, options, methods._future);
                        break;

                    case 'dateRange':
                        var classGroup = '[' + options.validateAttribute + '*=' + rules[i + 1] + ']';
                        options.firstOfGroup = $form.find(classGroup).eq(0);
                        options.secondOfGroup = $form.find(classGroup).eq(1);

                        if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
                            //如果两个控件其中一个有值，就执行校验
                            errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._dateRange);
                        }

                        if (errorMsg) {
                            required = true;
                        }

                        break;

                    case 'dateTimeRange':
                        var classGroup = '[' + options.validateAttribute + '*=' + rules[i + 1] + ']';
                        options.firstOfGroup = $form.find(classGroup).eq(0);
                        options.secondOfGroup = $form.find(classGroup).eq(1);

                        if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
                            //如果两个控件其中一个有值，就执行校验
                            errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._dateTimeRange);
                        }

                        if (errorMsg) {
                            required = true;
                        }

                        break;

                    case 'maxCheckbox':
                        $field = $form.find('input[name="' + fieldName + '"]');
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._maxCheckbox);
                        break;

                    case 'minCheckbox':
                        $field = $form.find('input[name="' + fieldName + '"]');
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._minCheckbox);
                        break;

                    case 'equals':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._equals);
                        break;

                    case 'funcCall':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._funcCall);
                        break;

                    case 'creditCard':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._creditCard);
                        break;

                    case 'condRequired':
                        errorMsg = methods._getErrorMessage($form, $field, rules[i], rules, i, options, methods._condRequired);
                        if (errorMsg !== undefined) {
                            required = true;
                        }
                        break;

                    default:
                }

                var end_validation = false; //结束验证标记

                if (typeof errorMsg == 'object') {
                    //如果校验返回一个消息对象，根据它的 status 来决定下一步怎么做
                    switch (errorMsg.status) {
                        case '_break':
                            //改变结束验证标记
                            end_validation = true;
                            break;

                        case '_error':
                            errorMsg = errorMsg.message;
                            break;

                        case '_error_no_prompt':
                            //如果想抛出一个错误，但不展示提示信息气泡吗，返回true
                            return true;
                            break;

                        default:
                            break;
                    }
                }

                if (end_validation) {
                    //结束验证
                    break;
                }

                if (typeof errorMsg == 'string') {
                    //如果返回了一个消息字符串，将其拼接组装其他，以备展示
                    promptText += errorMsg + '<br/>';
                    options.isError = true;
                    field_errors++;
                }
            }

            if (!required && !($field.val()) && $field.val().length < 1 && rules.indexOf('equals') < 0) {
                //假如非必填，值为空，又不需要与其他控件的值相等...
                options.isError = false;
            }

            //关于单选和复选框的错误信息展示相关处理
            var fieldType = $field.prop('type');

            if ((fieldType == 'radio' || fieldType == 'checkbox') && $form.find('input[name="' + fieldName + '"]').size() > 1) {
                $field = $($form.find('input[name="' + fieldName + '"][type!=hidden]:first'));
            }

            if ($field.is(':hidden') && options.prettySelect && $field.is('select')) {
                //如果是隐藏控件（用户自定义生成的下拉框，原控件会被隐藏掉）
                $field = $form.find('#' + $field.data('prettySelect'));
            }

            if (options.isError && options.showErrorFlag) {
                methods._showErrorMsg($field, promptText, $form, options);
            } else {
                methods._hideErrorMsg($field, $form, options);
            }

            //为控件添加状态 css class（如果有设置的话）
            methods._handleStatusCssClasses($field, options);

            //记录报错
            var errIndex = $.inArray($field[0], options.InvalidFields);
            if (errIndex == -1 && options.isError) {
                //如果校验有误，且当前控件不在错误控件列表中时，将当前控件假如到错误控件列表中去
                options.InvalidFields.push($field[0]);
            } else if (!options.isError) {
                //如果验证无误，将当前控件从错误控件列表中移除
                options.InvalidFields.splice(errIndex, 1);
            }

            //执行校验出错回调
            if (options.isError && options.onFieldFailure) {
                options.onFieldFailure($field);
            }

            //执行校验通过回调
            if (!options.isError && options.onFieldSuccess) {
                options.onFieldSuccess($field);
            }

            return options.isError;
        },

        _jqSelector : function (str) {
            return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
        },

        _handleStatusCssClasses : function($field, options) {
            //移除class
            if (options.addSuccessCssClassToField) {
                $field.removeClass(options.addSuccessCssClassToField);
            }

            if (options.addFailureCssClassToField) {
                $field.removeClass(options.addFailureCssClassToField);
            }

            //添加class
            if (options.addSuccessCssClassToField && !options.isError) {
                $field.addClass(options.addSuccessCssClassToField);
            }

            if (options.addFailureCssClassToField && options.isError) {
                $field.addClass(options.addFailureCssClassToField);
            }
        },

        _getErrorMessage : function ($form, $field, rule, rules, i, options, originalValidationMethod) {
            var rule_index = $.inArray(rule, rules),
                errorMsg = undefined;

            if (rule === 'custom' || rule === 'funcCall') {
                //如果是 custom 或 funcCall 校验方式，合并
                var custom_validation_type = rules[rule_index + 1];
                rule = rule + '[' + custom_validation_type + ']';
                delete(rules[rule_index]);
            }

            if (rule == 'future' || rule == 'past' || rule == 'maxCheckbox' || rule == 'minCheckbox') {
                //如果是这4种校验规则，这样调用校验方法
                errorMsg = originalValidationMethod($form, $field, rules, i, options);
            } else {
                //其他情况
                errorMsg = originalValidationMethod($field, rules, i, options);
            }

            if (errorMsg != undefined) {
                //如果返回了校验错误信息，再尝试获取用户自定义校验信息（如果用户有自定义校验信息，就拿用户自定义的校验信息覆盖原来的）
                var custom_message = methods._getCustomErrorMessage($field, rule, options);
                if (custom_message) {
                    errorMsg = custom_message;
                }
            }

            return errorMsg;
        },

        _getCustomErrorMessage : function ($field, rule, options) {
            var custom_message = '',
                validityProp = '';

            if (/^custom\[.*\]$/.test(rule)) {
                validityProp = 'custom';
            } else if (/^funcCall\[.*\]$/.test(rule)) {
                validityProp = 'funcCall';
            } else {
                validityProp = rule;
            }

            if (validityProp) {
                custom_message = $field.attr('data-ve-msg-' + validityProp);
                if (custom_message) {
                    //如果有错误信息，返回之
                    return custom_message;
                }
            }

            custom_message = $field.attr('data-ve-msg');
            if (custom_message) {
                //如果有错误信息，返回之
                return custom_message;
            }

            return custom_message;
        },

        _required : function ($field, rules, i, options, condRequired) {
            switch ($field.prop('type')) {
                /*case 'text':
                case 'password':
                case 'textarea':
                case 'file':
                case 'select-one':
                case 'select-multiple':
                case 'radio':*/
                case 'checkbox':
                    if (condRequired) {
                        if (!$field.attr('checked')) {
                            return options.allrules[rules[i]].alertTextCheckboxMultiple;
                        }
                        break;
                    }

                    var $form = $field.closest('form, .J-ve-cont'),
                        name = $field.attr('name');

                    if ($form.find('input[name="' + name + '"]:checked').size() == 0) {

                        if ($form.find('input[name="' + name + '"]:visible').size() == 1) {
                            return options.allrules[rules[i]].alertTextCheckbox;
                        } else {
                            return options.allrules[rules[i]].alertTextCheckboxMultiple;
                        }

                    }
                    break;
                default:
                    var field_val = $.trim($field.val()),
                        dv_placeholder = $.trim($field.attr('data-validation-placeholder')),
                        placeholder = $.trim($field.attr('placeholder'));

                    if (!field_val
                        || (dv_placeholder && field_val == dv_placeholder)
                        || (placeholder && field_val == placeholder)
                    ) {
                        return options.allrules[rules[i]].alertText;
                    }
                    break;
            }
        },

        _groupRequired : function ($field, rules, i, options) {
            var classGroup = '[' + options.validateAttribute + '*=' + rules[i + 1] + ']',
                isValid = false;

            $field.closest('form, .J-ve-cont').find(classGroup).each(function(){
                if (!methods._required($(this), rules, i, options)) {
                    isValid = true;
                    return false;
                }
            });

            if(!isValid) {
                return options.allrules[rules[i]].alertText;
            }
        },

        _custom : function ($field, rules, i, options) {
            var customRule = rules[i + 1],
                rule = options.allrules[customRule],
                fn;

            if (!rule) {
                alert('jqv:custom rule not found - ' + customRule);
                return;
            }

            if (rule['regex']) {

                var ex = rule.regex;

                if(!ex) {
                    alert('jqv:custom regex not found - '+customRule);
                    return;
                }

                var pattern = new RegExp(ex);

                if (!pattern.test($field.val())) {
                    return options.allrules[customRule].alertText;
                }

            } else if(rule['func']) {

                fn = rule['func'];

                if (typeof(fn) !== 'function') {
                    alert('jqv:custom parameter "function" is no function - ' + customRule);
                    return;
                }

                if (!fn($field, rules, i, options)) {
                    return options.allrules[customRule].alertText;
                }

            } else {
                alert('jqv:custom type not allowed ' + customRule);
                return;
            }
        },

        _funcCall : function ($field, rules, i, options) {
            var functionName = rules[i + 1],
                fn;

            if (functionName.indexOf('.') > -1) {
                var namespaces = functionName.split('.'),
                    scope = window;

                while (namespaces.length) {
                    scope = scope[namespaces.shift()];
                }

                fn = scope;
            } else {
                fn = window[functionName] || options.customFunctions[functionName];
            }

            if (typeof(fn) == 'function') {
                return fn($field, rules, i, options);
            }
        },

        _equals : function ($field, rules, i, options) {
            var equalsField = rules[i + 1];

            if ($field.val() != $('#' + equalsField).val()) {
                return options.allrules.equals.alertText;
            }
        },

        _maxSize : function ($field, rules, i, options) {
            var max = rules[i + 1],
                len = $field.val().length;

            if (len > max) {
                var rule = options.allrules.maxSize;
                return rule.alertText + max + rule.alertText2;
            }
        },

        _minSize : function ($field, rules, i, options) {
            var min = rules[i + 1],
                len = $field.val().length;

            if (len < min) {
                var rule = options.allrules.minSize;
                return rule.alertText + min + rule.alertText2;
            }
        },

        _min : function ($field, rules, i, options) {
            var min = parseFloat(rules[i + 1]),
                len = parseFloat($field.val());

            if (len < min) {
                var rule = options.allrules.min;
                if (rule.alertText2) {
                    return rule.alertText + min + rule.alertText2;
                }
                return rule.alertText + min;
            }
        },

        _max : function ($field, rules, i, options) {
            var max = parseFloat(rules[i + 1]),
                len = parseFloat($field.val());

            if (len > max) {
                var rule = options.allrules.max;
                if (rule.alertText2) {
                    return rule.alertText + max + rule.alertText2;
                }
                return rule.alertText + max;
            }
        },

        _past : function ($form, $field, rules, i, options) {
            var p = rules[i + 1],
                fieldAlt = $($form.find('*[name="' + p.replace(/^#+/, '') + '"]')),
                pDate;

            if (p.toLowerCase() == 'now') {
                pDate = new Date();
            } else if (undefined != fieldAlt.val()) {
                if (fieldAlt.is(':disabled')) {
                    return;
                }
                pDate = methods._parseDate(fieldAlt.val());
            } else {
                pDate = methods._parseDate(p);
            }

            var vDate = methods._parseDate($field.val());

            if (vDate > pDate ) {
                var rule = options.allrules.past;
                if (rule.alertText2) {
                    return rule.alertText + methods._dateToString(pDate) + rule.alertText2;
                }
                return rule.alertText + methods._dateToString(pDate);
            }
        },

        _future: function($form, $field, rules, i, options) {
            var p = rules[i + 1],
                fieldAlt = $($form.find('*[name="' + p.replace(/^#+/, '') + '"]')),
                pDate;

            if (p.toLowerCase() == 'now') {
                pDate = new Date();
            } else if (undefined != fieldAlt.val()) {
                if (fieldAlt.is(':disabled')) {
                    return;
                }
                pDate = methods._parseDate(fieldAlt.val());
            } else {
                pDate = methods._parseDate(p);
            }

            var vDate = methods._parseDate($field.val());

            if (vDate < pDate ) {
                var rule = options.allrules.future;
                if (rule.alertText2) {
                    return rule.alertText + methods._dateToString(pDate) + rule.alertText2;
                }
                return rule.alertText + methods._dateToString(pDate);
            }
        },

        _isDate : function (value) {
            var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
            return dateRegEx.test(value);
        },

        _isDateTime : function (value) {
            var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
            return dateTimeRegEx.test(value);
        },

        _dateCompare : function (start, end) {
            return (new Date(start.toString()) < new Date(end.toString()));
        },

        _dateRange : function ($field, rules, i, options) {
            //are not both populated
            if ( (!options.firstOfGroup[0].value && options.secondOfGroup[0].value)
                || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)
            ) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }

            //are not both dates
            if ( !methods._isDate(options.firstOfGroup[0].value)
                || !methods._isDate(options.secondOfGroup[0].value)
            ) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }

            //are both dates but range is off
            if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
        },

        _dateTimeRange : function ($field, rules, i, options) {
            //are not both populated
            if ( (!options.firstOfGroup[0].value && options.secondOfGroup[0].value)
                || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)
            ) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }

            //are not both dates
            if ( !methods._isDateTime(options.firstOfGroup[0].value)
                || !methods._isDateTime(options.secondOfGroup[0].value)
            ) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }

            //are both dates but range is off
            if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
        },

        _maxCheckbox : function ($form, $field, rules, i, options) {
            var nbCheck = rules[i + 1],
                groupName = $field.attr('name'),
                groupSize = $form.find('input[name="' + groupName + '"]:checked').size();

            if (groupSize > nbCheck) {
                if (options.allrules.maxCheckbox.alertText2) {
                    return options.allrules.maxCheckbox.alertText + ' ' + nbCheck + ' ' + options.allrules.maxCheckbox.alertText2;
                }
                return options.allrules.maxCheckbox.alertText;
            }
        },

        _minCheckbox : function ($form, $field, rules, i, options) {
            var nbCheck = rules[i + 1],
                groupName = $field.attr('name'),
                groupSize = $form.find('input[name="' + groupName + '"]:checked').size();

            if (groupSize < nbCheck) {
                return options.allrules.minCheckbox.alertText + ' ' + nbCheck + ' ' + options.allrules.minCheckbox.alertText2;
            }
        },

        _creditCard : function ($field, rules, i, options) {
            //spaces and dashes may be valid characters, but must be stripped to calculate the checksum.
            var valid = false,
                cardNumber = $field.val().replace(/ +/g, '').replace(/-+/g, ''),
                numDigits = cardNumber.length;

            if (numDigits >= 14 && numDigits <= 16 && parseInt(cardNumber) > 0) {

                var sum = 0,
                    i = numDigits - 1,
                    pos = 1,
                    digit,
                    str = new String();

                do {
                    digit = parseInt(cardNumber.charAt(i));
                    str += (pos++ % 2 == 0) ? digit * 2 : digit;
                } while (--i >= 0)

                for (i = 0; i < str.length; i++) {
                    sum += parseInt(str.charAt(i));
                }

                valid = sum % 10 == 0;
            }

            if (!valid) {
                return options.allrules.creditCard.alertText;
            }
        },

        _dateToString : function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },

        _parseDate : function (d) {
            var dateParts = d.split("-");

            if (dateParts == d) {
                dateParts = d.split("/");
            }

            if (dateParts == d) {
                dateParts = d.split(".");
                return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
            }

            return new Date(dateParts[0], (dateParts[1] - 1) ,dateParts[2]);
        },

        _condRequired : function ($field, rules, i, options) {
            var idx,
                dependingField;

            for (idx = (i + 1); idx < rules.length; idx++) {
                dependingField = $('#' + rules[idx]).first();

                if (dependingField.length && methods._required(dependingField, ['required'], 0, options, true) == undefined) {
                    return methods._required($field, ['required'], 0, options);
                }
            }
        },

        showErrorMsg : function (promptText) {
            var $this = this,
                $form = $this.closest('form, .J-ve-cont'),
                options = $form.data('jqv');

            methods._showErrorMsg($this, promptText, $form, options);
            return this;
        },

        _showErrorMsg : function ($field, promptText, $form, options) {
            if (options && options.showErrorMsg) {
                options.showErrorMsg($field, promptText, $form, options);
            } else {
                $form.find('[data-tips-for-field=' + $field.attr('name') + ']')
                    .find('.J-ve-err-msg-txt')
                    .html(promptText)
                    .end()
                    .fadeIn(300);
            }
        },

        hideErrorMsg : function () {
            var $this = this,
                $form = $this.closest('form, .J-ve-cont'),
                options = $form.data('jqv');

            methods._hideErrorMsg($this, options);
            return this;
        },

        _hideErrorMsg : function ($field, $form, options) {
            if (options && options.hideErrorMsg) {
                options.hideErrorMsg($field, $form, options);
            } else {
                $form.find('[data-tips-for-field=' + $field.attr('name') + ']')
                    .fadeOut(300);
            }
        },

        hideAll : function () {
            var $form = this,
                options = $form.data('jqv');

            if (options && options.hideAll) {
                options.hideAll($form, options);
            } else {
                $form.find('[data-tips-for-field]').fadeOut(300);
            }
        }
    };

    $.fn.validationEngine = function (method) {
        var $this = $(this);

        if (!$this[0]) return $this;  //表单不存在，不再往下执行

        if (typeof(method) == 'string' && method.charAt(0) != '_' && methods[method]) {

            //确保 init 方法先被调用一次
            if (method != 'showErrorMsg' && method != 'hideErrorMsg' && method != 'hideAll') {
                methods.init.apply($this);
            }
            return methods[method].apply($this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof method == 'object' || !method) {

            //初始化
            methods.init.apply($this, arguments);
            return methods.attach.apply($this);

        } else {
            $.error('Method ' + method + ' does not exist in jQuery.validationEngine');
        }
    };

    //暴露全局配置
    $.validationEngine = {
        defaults : {
            //用于获取校验规则的属性
            validateAttribute : 'data-ve',

            //是否显示错误提示
            showErrorFlag : true,
            //自定义错误提示显示方法  参数：$field, promptText, $form, options
            showErrorMsg :　false,
            //自定义错误提示隐藏方法  参数：$field, $form, options
            hideErrorMsg : false,
            //自定义的所有错误提示隐藏方法  参数：$form, options
            hideAll : false,


            //是否整个表单只显示一条错误提示信息
            showOneMessage: false,
            //每个控件最多显示的错误信息条数（默认为 false，可以设置具体数值）
            maxErrorsPerField : 1,
            //含有无效值的控件列表
            InvalidFields : [],

            //只要有任何一个校验不通过，那么 isError 就会被设为 true
            isError : false,
            //是否控件事件绑定
            bindFlag : true,
            //控件校验触发事件类型
            validationEventTrigger : 'blur',

            //是否滚动到第一个报错控件处
            scroll : true,
            //是否自动获得第一个报错控件的焦点
            focusFirstField : true,
            //【表单提交时的表单验证】是否不显示任何验证报错信息
            doNotShowAllErrorsOnSubmit : false,

            //可以设置表单验证完成的回调，需要返回 true 或 false
            onValidationComplete : false,
            //表单验证通过时的回调
            onSuccess: false,
            //表单验证失败时的回调
            onFailure: false,
            //控件验证通过时的回调
            onFieldSuccess : false,
            //控件验证失败时的回调
            onFieldFailure : false,
            //控件校验失败时要添加的 css class
            addSuccessCssClassToField: '',
            //控件校验成功时要添加的 css class
            addFailureCssClassToField: '',

            //是否使用了美化控件（自定义生成的下拉框）
            prettySelect: false

        }
    };

    /*
    * .J-ve-cont —— 可以用带这个 class 的其他元素来代替 form 元素，指定表单范围
    * data-ve —— 用于定义校验规则
    * data-ve-skip —— 假如在表单提交按钮上添加次属性，并将它的值设为true，点击按钮将跨过表单校验流程直接提交表单
    * data-ve-msg-[validateType] —— 自定义指定校验类型的错误提示信息（高优先级） 例：<input type="text" data-ve-msg-required="此项为必填项" />
    * data-ve-msg —— 自定义校验类型的错误提示信息（任何校验类型通用，中等优先级） 例：<input type="text" data-ve-msg="您输入的内容无法通过校验，请重新输入" />
    * data-pretty-select —— 指定用户生成的模拟下拉框的ID，这个属性要添加到相对应的原生下拉框之中
    * data-tips-for-field —— 默认的错误信息提示框 target selector,它的 value 可以指定它显示哪个控件的错误提示信息
    * .J-ve-err-msg-txt —— 默认的错误信息提示框的提示信息插入元素 target selector，可以是信息提示框本体或者其后代节点
    * */
})(jQuery);
