'use strict';
$.ajaxSetup({
    beforeSend: function(){
        var _this = this;
        if(_this.disabledBtn){
            _this.disabledBtn.each(function(){
                this.disabled = true;
            });
            _this.disabledBtn.append("<i class='fa fa-spinner fa-spin'></i><br>");
            _this.disabledBtn.addClass("btn-disabled");
        }
    },
    complete: function(){
        var _this = this;
        if(_this.disabledBtn){
            _this.disabledBtn.each(function(){
                this.disabled = false;
            });
            _this.disabledBtn.html(_this.disabledBtn.text());
            _this.disabledBtn.removeClass("btn-disabled");
        }
    }
});

window.HaierJS = window.HaierJS || {};

HaierJS.log = function(msg){
    if(window["console"]){
        try{
            console.log.call(console, "%c" + msg, "font-size:14px; color:#C0A; font-family:微软雅黑; text-shadow:0px 1px 2px #ff0;");
        }catch(e){
            console.log(msg);
        }
    }
};

HaierJS.get = function(opts){
    //设置get方法的默认配置
    var defaultOpts = {
            type: "get",
            dataType: "json"
        },
        _opts = {};

    if(typeof opts.type != "undefined"){
        delete opts.type;
    }

    if(typeof opts.method != "undefined"){
        delete opts.method;
    }

    $.extend(_opts, defaultOpts, opts);

    this.ajax(_opts);
};

HaierJS.post = function(opts){
    opts.type = "post";
    //设置post方法的默认配置
    var defaultOpts = {
            type: "post",
            dataType: "json"
        },
        _opts = {};

    if(typeof opts.type != "undefined"){
        delete opts.type;
    }

    if(typeof opts.method != "undefined"){
        delete opts.method;
    }

    $.extend(_opts, defaultOpts, opts);

    this.ajax(_opts);
};

HaierJS.ajax = function(opts){
    var mustList = ['url', 'success'],
        mustList_length = mustList.length;

    for(var i = 0; i < mustList_length; i++){
        if(typeof opts[mustList[i]] == "undefined"){
            HaierJS.log("【HaierJS.ajax.err】缺少必要参数：" + mustList[i]);
            return false;
        }
    }

    var successCB = opts.success, //缓存用户自定义的接口成功回调函数
        errorCB = opts.error, //缓存用户自定义的接口失败回调函数
        reloadTimeout = opts.reloadTimeout || 0, //刷新页面的延迟时间
        beforeReload = opts.beforeReload, //刷新页面之前执行的回调函数
        pageChangeTimeout = opts.pageChangeTimeout || 0, //页面跳转的延迟时间
        beforePageChange = opts.beforePageChange, //页面跳转之前执行的回调函数
        ajaxConfig = {}; //最终发送请求所用配置

    //删除部分影响接口调用结果的属性，避免属性覆盖
    delete opts.success;

    //合并ajax请求配置，公用逻辑处理
    $.extend(ajaxConfig, opts, {
        success: function(re){
            if(re.Result){
                successCB(re.Data);

                if(typeof re.Operation != "undefined" && re.Operation != null){
                    //业务配置之后的处理...
                    switch(re.Operation.Code * 1){
                        case 1:
                            //页面刷新
                            beforeReload && beforeReload();
                            setTimeout(function(){
                                location.reload();
                            }, reloadTimeout);
                            break;
                        case 2:
                            //页面跳转
                            beforePageChange && beforePageChange();
                            setTimeout(function(){
                                location.href = re.Operation.Value;
                            }, pageChangeTimeout);
                            break;
                        case 3:
                            //父页面刷新
                            beforeReload && beforeReload();
                            setTimeout(function(){
                                window.parent.location.reload();
                            }, reloadTimeout);
                            break;
                        case 4:
                            //父页面跳转
                            beforePageChange && beforePageChange();
                            setTimeout(function(){
                                window.parent.location.href = re.Operation.Value;
                            }, pageChangeTimeout);
                            break;
                        default:
                            break;
                    }
                }

            }else{
                errorCB && errorCB(re.Result, re.Msg);
                HaierJS.log("请求数据失败...Err Msg: " + re.Msg);
            }
        }
    });

    return $.ajax(ajaxConfig);
};
