(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = function () {
    /*
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     * 可以用 1-2 个占位符
     * 年(y) 可以用 1-4 个占位符
     * 毫秒(S) 只能用 1 个占位符(是 1-3 位的数字)
     * */
    Date.prototype.format = function (fmt) {
        var o = {
            'M+' : this.getMonth() + 1, //月份
            'd+' : this.getDate(), //日
            'h+' : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            'H+' : this.getHours(), //小时
            'm+' : this.getMinutes(), //分
            's+' : this.getSeconds(), //秒
            'q+' : Math.floor((this.getMonth() + 3) / 3), //季度
            'S' : this.getMilliseconds() //毫秒
        };

        var week = {
            '0' : '/u65e5',
            '1' : '/u4e00',
            '2' : '/u4e8c',
            '3' : '/u4e09',
            '4' : '/u56db',
            '5' : '/u4e94',
            '6' : '/u516d'
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
        }

        for (var k in o) {
            if (new RegExp('('+ k +')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    };
};

},{}],2:[function(require,module,exports){
'use strict';
/*
 * 获取字符串的字符长度方法
 *
 * 参数说明：
 * str 【String】 需要获取字符长度的字符串
 * */
var getStrCodeLength = function (str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;

    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);

        if (charCode >= 0x4e00 && charCode <= 0x9fff) {
            //如果 unicode 在汉字范围内（汉字的 unicode 码范围是 u4e00~u9fff）
            realLength += 2;
        } else {
            realLength += 1;
        }
    }

    return realLength;
};

module.exports = getStrCodeLength;

},{}],3:[function(require,module,exports){
'use strict';
/* === Class ItvEvents begin === */
/*
 * 此类依赖于Jquery
 * 此类的作用是，使得绑定在指定元素上的指定事件的触发函数产生一定执行间隔时间
 * 避免高频率触发事件时，函数随之高频率执行，以致影响应用的运行速度
 * */
var ItvEvents = function () {
    var _this = this;
    _this.lastTriggerTime = {}; //最后一次触发事件的时间点
    _this.timeOut = {};         //setTimeout对象缓存
};

/*
 * 参数说明：
 * $el 【JqueryObj】 要绑定事件的JqueryDOM对象
 * eventType 【String】 要绑定的事件类型
 * eventName 【String】 事件的命名空间
 * fn 【Function】 事件触发时要执行的函数
 * itvTime 【Int】 事件被连续触发时，对应的函数的执行间隔
 * */
ItvEvents.prototype.addEvent = function ($el, eventType, eventName, fn, itvTime) {
    var _this = this;

    _this.lastTriggerTime[eventName] = +new Date();
    _this.timeOut[eventName] = null;

    $el.on(eventType + '.' + eventName, function () {
        _this.itvTrigger(eventName, fn, itvTime, this);
    });
};

/*
 * 参数说明：
 * $el 【JqueryObj】 要绑定事件的JqueryDOM对象
 * eventType 【String】 要绑定的事件类型
 * eventName 【String】 事件的命名空间
 * */
ItvEvents.prototype.removeEvent = function ($el, eventType, eventName) {
    var _this = this;

    delete _this.lastTriggerTime[eventName], _this.timeOut[eventName];

    $el.off(eventType + '.' + eventName);
};

/*
 * 参数说明：
 * eventName 【String】 事件的命名空间
 * eventName 【Function】 事件触发时要执行的函数
 * itvTime 【Int】 事件被连续触发时，对应的函数的执行间隔
 * fnContextObj 【Obj】 事件触发时所执行函数的上下文关系变量
 * */
ItvEvents.prototype.itvTrigger = function (eventName, fn, itvTime, fnContextObj) {
    var _this = this,
        curTriggerTime = +new Date();   //当前要触发事件的时间点

    clearTimeout(_this.timeOut[eventName]);

    if (curTriggerTime - _this.lastTriggerTime[eventName] > itvTime) {
        _this.lastTriggerTime[eventName] = curTriggerTime;
        fn.call(fnContextObj);
    } else {
        _this.timeOut[eventName] = setTimeout(function () {
            fn.call(fnContextObj);
        }, itvTime);
    }
};

module.exports = ItvEvents;
},{}],4:[function(require,module,exports){
'use strict';
/* === Class JsLoader begin === */
/*
 * 此类依赖于Jquery和Monitor工具类，它的实例化一定要在这两者之后
 * 此类的作用是，根据依赖关系来异步加载JS脚本
 * */
var JsLoader = function () {
    var _this = this;
    _this.queue = {};       //未加载模块列表
    _this.loaded = {};      //已加载模块列表

    //PS：这里依赖了 Monitor 模块
    var Monitor = require('../Monitor/Monitor');
    _this.Monitor = new Monitor();
};

/*
 * 参数说明：
 * module 【Obj】【可以传多个】
 * 每个 module 对象包含了4个属性：
 * name 【String】 必传，要引入 JS 的模块名
 * url 【String】 必传，要引入 JS 的路径
 * requires 【String Array】 可选，此脚本依赖的模块（所依赖模块的模块名组成的集合）
 * callBack 【Function】 回调函数，脚本加载完后执行的回调函数
 * */
JsLoader.prototype.get = function () {
    var _this = this;

    for (var i = 0, argumentsLen = arguments.length; i < argumentsLen; i++) {
        var module = $.extend({}, arguments[i]);

        //查找是否已加载
        if (_this.loaded[module.name]) {
            continue;
        }

        _this.queue[module.name] = module;

        //是否依赖其他模块
        if ($.isArray(module.requires) && module.requires.length > 0) {
            var conditionArr = [];

            for (var j = 0, requiresLen = module.requires.length; j < requiresLen; j++) {
                conditionArr.push('JsLoader_Success_' + module.requires[j]);
            }

            var condition = conditionArr.join(',');

            _this.addListen(condition, module.name);
        }else{
            _this.execute(module);
        }
    }

    return _this;
};

/*
 * 参数说明：
 * module 【Obj】
 * 参考 get 方法关于 module 对象的详解
 * */
JsLoader.prototype.execute = function (module) {
    var _this = this;

    $.ajax({
        url: module.url,
        dataType: 'script',
        context: {
            name: module.name
        },
        cache: true,
        crossDomain: true,
        success: function () {
            //标记模块已加载
            _this.loaded[module.name] = 1;
            delete _this.queue[module.name];

            if (typeof module.callBack != 'undefined' && typeof module.callBack == 'function') {
                module.callBack();
            }

            _this.Monitor.trigger('JsLoader_Success_' + module.name);
        }
    });
};

/*
 * 参数说明：
 * condition 【String】 触发条件名
 * moduleName 【String】 模块名，对应 get 方法传入对象的 name 属性
 * */
JsLoader.prototype.addListen = function (condition, moduleName) {
    var _this = this;

    _this.Monitor.listen(condition, function () {
        _this.execute(_this.queue[moduleName]);
    });
};

module.exports = JsLoader;

},{"../Monitor/Monitor":7}],5:[function(require,module,exports){
'use strict';
/* === Class DelayedFunc begin === */
/*
 用 DelayedFunc 类创建的对象包含5属性
 func 【function】 需要触发的函数实体
 allowCount 【int】 已经成功触发的条件数
 conditionCount 【int】 需要触发的条件数
 allowFlag 【bool】 该函数的所有触发条件都已经触发了，其值就为true，否则其值就为false
 conditionStatusList 【Obj】 此对象包含的子属性的数目将等于conditionCount的值，这n个属性的属性名和触发条件名相同
 */
var DelayedFunc = function (func, conditionCount) {
    var _this = this;
    _this.func = [];
    _this.conditionCount = conditionCount;
    _this.allowCount = 0;
    _this.allowFlag = false;
    _this.conditionStatusList = {};

    _this.func.push(func);
};

DelayedFunc.prototype.checkStatus = function () {
    var _this = this;

    if (_this.allowFlag) {
        return true;
    }

    if (_this.allowCount === _this.conditionCount) {
        _this.allowFlag = true;
        return true;
    }

    return false;
};

module.exports = DelayedFunc;
},{}],6:[function(require,module,exports){
'use strict';
var DelayedFunc = require('./DelayedFunc');

/* === Class FuncDepot begin === */
var FuncDepot = function (parent) {
    var _this = this;
    _this.parent = parent;
    //初始化触发条件列表
    _this.conditionList = {};
    //初始化函数库存列表
    _this.stockList = {};
    //初始化参数库存列表
    _this.paramList = {};
};

/*
 * 参数说明：
 * condition 【Array】 触发条件list
 * func 【function】 满足触发条件时，需要触发的函数
 * */
FuncDepot.prototype.stockPush = function (condition, func) {
    var _this = this,
        condition_length = condition.length,
        curStock = null,
        _condition = [],
        stockName = '',
        curParam = {},
        triggerHash = _this.parent.triggerHash,
        triggerHash_length = triggerHash.length;

    for (var i = 0; i < condition_length; i++) {
        _condition.push('^' + condition[i] + '^');
    }

    for (var i = 0; i < triggerHash_length; i++) {
        if ($.inArray(triggerHash[i], condition) != -1 && typeof _this.paramList[triggerHash[i]] != 'undefined') {
            $.extend(curParam, _this.paramList[triggerHash[i]]);
        }
    }

    stockName = _condition.join('|@|');

    if (typeof _this.stockList[stockName] === 'undefined') {

        /*
         如果指定的库存函数对象不存在，就在函数库存列表中插入一个新的库存函数对象
         同时定义一个局部变量，缓存该对象（当前库存函数对象），以便后面的代码快速引用它
         */
        curStock = _this.stockList[stockName] = new DelayedFunc(func, condition_length);

    } else {

        //如果指定的库存函数对象已经存在，直接引用它
        curStock = _this.stockList[stockName];
        curStock.func.push(func);

    }

    if (curStock.allowFlag) {

        //当前库存函数对象 的函数触发标记为true时，直接触发函数
        curStock.func[curStock.func.length - 1].call(window, curParam);

    } else {

        //遍历触发条件list
        for (var i = 0; i < condition_length; i++) {

            var curCondition = condition[i];
            //如果触发条件列表（conditionList）中，对应的触发条件的值为true（该条件已经被触发）
            if (_this.conditionList[curCondition] === true) {

                //为 当前库存函数对象 插入条件属性，并设置其值为true
                if (!curStock.conditionStatusList[curCondition]) {
                    curStock.allowCount++;
                }
                curStock.conditionStatusList[curCondition] = true;


            } else {

                //否则，为 当前库存函数对象 插入条件属性，并设置其值为false
                curStock.conditionStatusList[curCondition] = false;

            }

        }

        if (curStock.checkStatus()) {

            //该函数的所有触发条件都已经触发了
            curStock.func[curStock.func.length - 1].call(window, curParam);

        }

    }
};

/*
 * 参数说明：
 * condition 【Array】 触发条件list
 * params 【obj】 满足触发条件时，传给触发的函数的公共参数
 * */
FuncDepot.prototype.stockTrigger = function (condition, params) {
    var _this = this,
        stockItem;

    if (typeof params != 'undefined' && params.constructor == Object) {
        _this.paramList[condition] = params;
    }

    //遍历函数库存列表
    for (stockItem in _this.stockList) {

        //进行库存函数名称匹配，如果库存函数名含有与某个触发条件相同的字符，说明该库存函数含有此触发条件
        if (stockItem.indexOf('^' + condition + '^') !== -1) {

            var curStock = _this.stockList[stockItem],
                curParam = _this.paramList[condition];

            for (var item in curStock.conditionStatusList) {
                if (typeof _this.paramList[item] != 'undefined' && item != condition) {
                    curParam = $.extend({}, _this.paramList[item], curParam);
                }
            }

            if (curStock.allowFlag) {

                //如果该函数的所有触发条件都已经满足，直接触发该函数
                for (var i = 0, len = curStock.func.length; i < len; i++) {
                    curStock.func[i].call(window, curParam);
                }

            } else {

                //该函数并未所有触发条件满足，且当前正在触发的条件正是未被触发的
                if (typeof curStock.conditionStatusList[condition] != 'undefined' && !curStock.conditionStatusList[condition]) {

                    //将该函数的对应触发条件设为true（已触发)
                    if (!curStock.conditionStatusList[condition]) {
                        //已触发条件数+1
                        curStock.allowCount++;
                    }
                    curStock.conditionStatusList[condition] = true;

                }

                //触发条件相关属性变更完后，判断已触发条件数是否与需要触发的条件数相同，如果相同，则所有触发条件都已触发
                if (curStock.checkStatus()) {

                    //所有触发条件都已触发，allowFlag属性设为true，并直接执行该函数
                    for (var i = 0, len = curStock.func.length; i < len; i++) {
                        curStock.func[i].call(window, curParam);
                    }

                }

            }

        }

    }
};

/*
 * 参数说明：
 * condition 【Array】 触发条件list
 * */
FuncDepot.prototype.stockPop = function (condition) {
    var _this = this,
        condition_length = condition.length,
        _condition = [],
        stockName = '';

    for (var i = 0; i < condition_length; i++) {
        _condition.push('^' + condition[i] + '^');
    }

    stockName = _condition.join('|@|');

    if (typeof _this.stockList[stockName] != 'undefined') {
        delete _this.stockList[stockName];
    }
};

module.exports = FuncDepot;
},{"./DelayedFunc":5}],7:[function(require,module,exports){
'use strict';
var FuncDepot = require('./FuncDepot');

/* === Class Monitor begin === */
/*
 * 此类依赖于Jquery
 * */
var Monitor = function () {
    var _this = this;
    _this.triggerHash = [];
    _this.funcDepot = new FuncDepot(_this);
};

/*
 * 参数说明：
 * condition 【String】
 * 触发条件list的表达字符串，各个条件由英文逗号','分隔开
 * 字符串中的所有空格符都会被过滤掉，建议仅用英文和数字组织触发条件名
 * func 【function】 满足触发条件时，需要触发的函数
 * */
Monitor.prototype.listen = function (condition, func) {
    var _this = this,
        _condition = condition.replace(/ /g, '').split(',');

    for (var i = 0, j = _condition.length; i < j; i++) {

        var curCondition = _condition[i];
        //如果该触发条件并未加入触发条件列表中
        if (!_this.funcDepot.conditionList[curCondition]) {

            //将该触发条件插入到触发条件列表，触发条件的值为false（未触发）
            _this.funcDepot.conditionList[curCondition] = false;

        }

    }

    _this.funcDepot.stockPush(_condition, func);
};

/*
 * 参数说明：
 * condition 【String】
 * 触发条件名
 * 字符串中的所有空格符都会被过滤掉，建议仅用英文和数字组织触发条件名
 * params 【obj】
 * 满足触发条件时，传给触发的函数的公共参数
 * 多个触发条件分开触发时，分别传入的 params 参数对象将会合并（extend）
 * */
Monitor.prototype.trigger = function (condition, params) {
    var _this = this,
        flag = $.inArray(condition, _this.triggerHash);

    if (flag != -1) {
        _this.triggerHash.splice(flag, 1);
    }

    _this.triggerHash.push(condition);
    //如果触发条件列表中包含此触发条件，就会直接将其设为true
    //如果触发条件列表中不包含此触发条件，则会将该触发条件插入到触发条件列表，触发条件的值为true（已触发）
    _this.funcDepot.conditionList[condition] = true;

    _this.funcDepot.stockTrigger(condition, params);
};

/*
 * 参数说明：
 * condition 【String】
 * 触发条件list的表达字符串，各个条件由英文逗号','分隔开
 * 字符串中的所有空格符都会被过滤掉，建议仅用英文和数字组织触发条件名
 * */
Monitor.prototype.unListen = function (condition) {
    var _this = this,
        _condition = condition.replace(/ /g, '').split(',');

    _this.funcDepot.stockPop(_condition);
};

module.exports = Monitor;
},{"./FuncDepot":6}],8:[function(require,module,exports){
'use strict';
/* === Class Pager begin === */
/*
 * 此类依赖于Jquery
 *
 * Pager分页模板可用数据的格式
 * ｛
 *      total : 180,
 *      apg : 1,
 *      pgc : 18,
 *      ps : 10,
 *      els : [｛
 *          pg : 1,
 *          name : 1,
 *          cls : 'ui-pager-active'
 *      ｝,｛
 *          pg : 2,
 *          name : 2,
 *          cls : 'ui-pager-can'
 *      ｝]
 * ｝
 *
 * 数据字段说明：
 * total —— 记录总条数
 * apg —— 当前页
 * pac —— 总页数
 * ps —— 每页显示条数
 * els —— 页码元素list
 * els|pg —— 点击页码要跳转到的页数（可能为空，空则不进行换页）
 * els|name —— 页码元素的内容（文字）
 * els|cls —— 页码元素的 css class
 * */
var Pager = function (opts) {
    var _this = this;

    _this.bindEventFlag = true; //事件是否已绑定标记
    _this.tplT = opts.tplT || null; //上分页模板（列表上方的简单分页）
    _this.tplB = opts.tplB || null; //下分页模板（列表下方的常规分页）
    _this.wrapT = opts.wrapT || null; //上分页容器（列表上方的简单分页）
    _this.wrapB = opts.wrapB || null; //下分页容器（列表上方的简单分页）
    _this.goToPageFunc = opts.goToPageFunc || null; //分页跳转回调

    //可点击的页码的class
    _this.canClkCls = opts.canClkCls || 'ui-pager-can';
    //不可点击的页码的class
    _this.cantClkCls = opts.cantClkCls || 'ui-pager-cant';
    //当前页码的class
    _this.activeCls = opts.activeCls || 'ui-pager-active';

    return _this;
};

/*
 * 分页模块渲染方法
 * 参数说明：
 * options type｛obj｝
 *
 * 属性
 * pg 【Int,Int-String】 当前页页码
 * total 【Int,Int-String】 数据总数
 * ps 【Int,Int-String】 每页条数
 * */
Pager.prototype.render = function (options) {
    var _this = this,
        pageData = _this.transformOpts(options),
        template = require('../Template/Template'),//PS:这里依赖了 Template 模块
        contT = _this.tplT ? template(_this.tplT, {
            total : pageData['total'],
            apg : pageData['pg'],
            pgc : pageData['page_count'],
            ps : pageData['ps'],
            els : pageData['simple_page_els']
        }) : '',
        contB = _this.tplB ? template(_this.tplB, {
            total : pageData['total'],
            apg : pageData['pg'],
            pgc : pageData['page_count'],
            ps : pageData['ps'],
            els : pageData['page_els']
        }) : '';

    _this.wrapT && _this.wrapT.html(contT);
    _this.wrapB && _this.wrapB.html(contB);

    if (_this.bindEventFlag) {
        //如果还没绑定事件
        _this.bindEvents();
    }
};

/*
 * 分页数据生产方法
 * 参数说明：
 * options type｛obj｝
 *
 * 属性
 * pg 【Int,Int-String】 当前页页码
 * total 【Int,Int-String】 数据总数
 * ps 【Int,Int-String】 每页条数
 * */
Pager.prototype.transformOpts = function (options) {
    var _this = this,
        pg = options.pg * 1,
        pageCount = Math.ceil(options.total / options.ps),
        simplePageEls = [],
        pageEls = [],
        canClkCls = _this.canClkCls,
        cantClkCls = _this.cantClkCls,
        activeCls = _this.activeCls;

    if (pageCount < 9) {
        //总页数小于9页
        for (i = 1; i <= pageCount; i++) {
            pageEls.push({
                pg : i,
                name : i,
                cls : canClkCls
            });
        }
    } else {
        //总页数大于或等于9页
        if (pg < 4) {
            //小于第4页
            if (pg !== 1) {
                //不是第1页
                pageEls.unshift({
                    pg : pg - 1,
                    name : '&lt;',
                    cls : canClkCls
                },{
                    pg : 1,
                    name : 1,
                    cls : canClkCls
                });
            } else {
                //是第1页
                pageEls.unshift({
                    pg : '',
                    name : '&lt;',
                    cls : cantClkCls
                },{
                    pg : 1,
                    name : 1,
                    cls : canClkCls
                });
            }

            //插入第2页到第6页
            for (var i = 2; i <= pg + 3; i++) {
                pageEls.push({
                    pg : i,
                    name : i,
                    cls : canClkCls
                });
            }

            //插入省略号，最后一页，下一页
            pageEls.push({
                pg : '',
                name : '...',
                cls : cantClkCls + ' ui-pager-dot'
            },{
                pg : pageCount,
                name : pageCount,
                cls : canClkCls
            },{
                pg : pg + 1,
                name : '&gt;',
                cls : canClkCls
            });
        } else {
            //大于等于第4页

            //在数组最前端插入上一页，1页
            pageEls.unshift({
                pg : pg - 1,
                name : '&lt;',
                cls : canClkCls
            },{
                pg : 1,
                name : 1,
                cls : canClkCls
            });

            var num = 2;
            if (pg != 4) {
                //不是第四页，插入省略号
                pageEls.push({
                    pg : '',
                    name : '...',
                    cls : cantClkCls + ' ui-pager-dot'
                });

                if (pageCount - 3 != pg) {
                    num = 3;
                }
            }

            for (var i = num; i >= 0; i--) {
                pageEls.push({
                    pg : pg - i,
                    name : pg - i,
                    cls : canClkCls
                });
            }

            if (pg + 3 < pageCount) {
                //当前页距最后一页还有大于3页
                pageEls.push({
                    pg : pg + 1,
                    name : pg + 1,
                    cls : canClkCls
                },{
                    pg : pg + 2,
                    name : pg + 2,
                    cls : canClkCls
                },{
                    pg : '',
                    name : '...',
                    cls : cantClkCls + ' ui-pager-dot'
                },{
                    pg : pageCount,
                    name : pageCount,
                    cls : canClkCls
                },{
                    pg : pg + 1,
                    name : '&gt;',
                    cls : canClkCls
                });
            } else {
                //当前页距最后一页还有小于或等于3页
                for (i = pg + 1; i <= pageCount; i++) {
                    pageEls.push({
                        pg : i,
                        name : i,
                        cls : canClkCls
                    });
                }

                if (pg !== pageCount) {
                    pageEls.push({
                        pg : pg + 1,
                        name : '&gt;',
                        cls : canClkCls
                    });
                } else {
                    pageEls.push({
                        pg : '',
                        name : '&gt;',
                        cls : cantClkCls
                    });
                }
            }
        }
    }

    for (var i = 0, len = pageEls.length; i < len; i++) {
        if (pageEls[i]['pg'] == pg) {
            pageEls[i]['cls'] = pageEls[i]['cls'] + ' ' + activeCls;
            pageEls[i]['pg'] = '';
        }
    }

    simplePageEls.push({
        pg : pg == 1 ? '' : pg - 1,
        name : '&lt;',
        cls : pg == 1 ? canClkCls + ' ' + activeCls : canClkCls
    },{
        pg : pg == pageCount ? '' : pg + 1,
        name : '&gt;',
        cls : pg == pageCount ? canClkCls + ' ' + activeCls : canClkCls
    });

    options['page_els'] = pageEls;
    options['simple_page_els'] = simplePageEls;
    options['page_count'] = pageCount;

    return options;
};

/*
 * 事件绑定方法
 * */
Pager.prototype.bindEvents = function () {
    var _this = this;
    _this.wrapT &&_this.wrapT
        .on('click', '.J-page-to', function () {
            var pg = $(this).data('pg');
            if (pg) {
                _this.goToPageFunc(pg);
            }
        });

    _this.wrapB &&_this.wrapB
        .on('click', '.J-page-to', function () {
            var pg = $(this).data('pg');
            if (pg) {
                _this.goToPageFunc(pg);
            }
        });

    _this.bindEventFlag = false;
};

module.exports = Pager;

},{"../Template/Template":11}],9:[function(require,module,exports){
'use strict';
/* === Class Storage begin === */
var Storage = function () {
    var _this = this;
    _this.LS_flag = !!window.localStorage;

    if (_this.LS_flag) {
        _this.storage = window.localStorage;
    } else {
        _this.storage = null;
        _this.hostName = 'storageForOldBrowser';

        try {
            _this.storage = document.createElement('INPUT');
            _this.storage.type = 'hidden';
            _this.storage.style.display = 'none';
            _this.storage.addBehavior ('#default#userData');
            document.body.appendChild(_this.storage);
            var expires = new Date();
            expires.setDate(expires.getDate() + 365);
            _this.storage.expires = expires.toUTCString();
        } catch(e) {
            alert('Storage Object create error!');
        }
    }
};

/*
 * 参数说明：
 * key 【String】 目标键名
 * */
Storage.prototype.get = function (key) {
    var _this = this;

    if (_this.storage) {

        if (_this.LS_flag) {
            return _this.storage.getItem(key);
        } else {
            _this.storage.load(_this.hostName);
            var value = _this.storage.getAttribute(key);

            if (value === null || value === undefined) {
                value = '';
            }
            return value;
        }

    }
};

/*
 * 参数说明：
 * key 【String】 目标键名（为了避免在IE6上产生报错，请不要以数字或特殊符号作为键名开头）
 * value 【String】 要设置的值
 * */
Storage.prototype.set = function (key, value) {
    var _this = this;

    if (_this.storage) {

        if (_this.LS_flag) {
            _this.storage.setItem(key, value);
        } else {
            _this.storage.load(_this.hostName);
            _this.storage.setAttribute(key, value);
            _this.storage.save(_this.hostName);
        }

    }
};

/*
 * 参数说明：
 * key 【String】 目标键名
 * */
Storage.prototype.remove = function (key) {
    var _this = this;

    if (_this.storage) {

        if (_this.LS_flag) {
            _this.storage.removeItem(key);
        } else {
            _this.storage.load(_this.hostName);
            _this.storage.removeAttribute(key);
            _this.storage.save(_this.hostName);
        }

    }
};

module.exports = Storage;
},{}],10:[function(require,module,exports){
'use strict';
/*
 * 根据字符长度截字方法
 *
 * 此方法依赖Jquery
 *
 * 参数说明：
 * str 【String】 需要处理的字符串
 * codeLength 【Int】 需求截字的长度
 * flag 【Bool】 是否要保留头尾空格符，默认值为 false
 * EnglishType 【Bool】 是否开启英文截字模式（英文截字模式下，截字末尾如果将单词截断了，就会把末尾被截断的单词部分也去除掉），默认值为 false。
 *
 * 【PS：EnglishType 参数放在最后，因为在中文环境，如果将 EnglishType 设置为 true，会出现意想不到的结果。因此中文环境下使用此参数需慎重】
 * */
var subStrByCode = function (str, codeLength, flag, EnglishType) {
    var _str = str,
        realLength = 0,
        len = _str.length,
        charCode = -1,
        endStr = '',
        cut = function (curCodeLength, endFlag) {
            var _endFlag = endFlag;
            if (EnglishType) {
                _endFlag++;
            }
            if (curCodeLength == codeLength) {
                _str = _str.substring(0, _endFlag);
                return true;
            } else if (curCodeLength > codeLength) {
                _str = _str.substring(0, _endFlag - 1);
                return true;
            }

            return false;
        };

    for (var i = 0; i < len; i++) {
        charCode = _str.charCodeAt(i);

        if (charCode >= 0x4e00 && charCode <= 0x9fff) {
            //如果 unicode 在汉字范围内（汉字的 unicode 码范围是 u4e00~u9fff）
            realLength += 2;
        } else {
            realLength += 1;
        }

        if (cut(realLength, i + 1)) {
            break;
        }
    }

    if (i < len && _str != '') {
        endStr = '...';
    } else {
        endStr = '';
    }

    if (EnglishType) {
        var _strArr = _str.split(' ');
        _strArr.length > 1 && _strArr.pop();
        _str = _strArr.join(' ');
    }

    return flag ? _str + endStr : $.trim(_str) + endStr;
};

module.exports = subStrByCode;

},{}],11:[function(require,module,exports){
'use strict';
/*
 * 模板编译方法
 * 参数说明：
 * text 【String】 需要编译的模板字符串
 * data 【Object】 编译模板时所要传入的数据
 * */
var template = function (text, data) {
    var render,

        settings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g
        },

        noMatch = /(.)^/,

        matcher = new RegExp([
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g'),

        escapes = {
            '\'': '\'',
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        },

        escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,

        index = 0,

        source = '__p+=\'';


    text.replace(matcher, function (match, interpolate, evaluate, offset) {
        source += text.slice(index, offset)
            .replace(escaper, function (match) { return '\\' + escapes[match]; });

        if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        }

        if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }

        index = offset + match.length;
        return match;
    });

    source += "';\n";

    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + "return __p;\n";

    try {
        render = new Function(settings.variable || 'obj', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    if (data) return render(data);
    var template = function (data) {
        return render.call(this, data);
    };

    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
};

module.exports = template;

},{}],12:[function(require,module,exports){
'use strict';
var tooltips = {};

/*
 * 提示框生成方法
 * */
tooltips.create = function (opts) {
    var options = {
        //需要添加提示框的目标元素 【JqueryObject】
        target : null,
        //提示框模版【string】
        tpl :　'<div class="J-tooltips ui-tooltips <%= themeCls %>" data-tooltips-create-flag="true">' +
                    '<div class="ui-tooltips-arrow">' +
                        '<i class="J-arrow arrow arrow-out">&#9670;</i>' +
                        '<i class="J-arrow arrow">&#9670;</i>' +
                    '</div>' +
                    '<div class="J-tooltips-content ui-tooltips-content"></div>' +
                '</div>',
        //提示框内容，类型可以是【string】或【function】，如果是【function】，要求该函数必须返回一个字符串
        content : '',
        //提示框主题【string】（默认值：''， 取值范围：''， 'info'， 'success'， 'warning'， 'error'）
        theme : '',
        //提示框展示在目标元素的哪一边【string】（取值范围：'top'， 'bottom'， 'left'， 'right'）
        side : 'top',
        //提示框的宽度【Int】（默认值：0， 默认情况下，宽度是自适应的，但是当 content 的内容是纯文本时，请务必设置 tooltips 宽度，否则可能会出现意想不到的意外结果出现）
        width : 0,
        //用来调整提示框的位置偏移【Object - Int】
        position : {
            top : 0,
            left : 0
        },
        //提示框显示标识
        showFlag : false,
        //提示框展示触发事件【string】（默认值:'mouseenter'）
        eventShow : 'mouseenter',
        //提示框隐藏触发事件【string】（默认值:'mouseleave'，当 eventShow 的值为 'click' 时，eventHide 会被强行无效化。改为点击提示框以外的区域触发隐藏）
        eventHide : 'mouseleave',
        //提示框显示后的回调【function】，有一个参数，传入的是生成的提示框的 JqueryObject
        onShow : null,
        //提示框隐藏后的回调【function】，有一个参数，传入的是生成的提示框的 JqueryObject
        onHide : null
    };

    //依赖template
    var template = require('../Template/Template');

    delete opts.tpl;
    delete opts.showFlag;

    $.extend(options, opts);

    if (options.target && options.target.length > 0) {
        options.target
            .append(template(options.tpl, {
                themeCls : options.theme == '' ? options.theme : 'ui-tooltips-' + options.theme
            }));

        var _width = options.width * 1;
        if (!isNaN(_width) && _width > 0) {
            options.target.find('div.J-tooltips-content').width(_width);
        }

        var targetPosition = options.target.css('position');
        if (targetPosition != 'relative' && targetPosition != 'absolute') {
            options.target.css('position', 'relative');
        }

        options.target.on(options.eventShow, function (e) {
            var $this = $(this),
                $target = $this.find('div.J-tooltips');

            if (!options.showFlag) {
                $target.find('div.J-tooltips-content').html(typeof options.content == 'function' ? options.content() : options.content);
                options.showFlag = true;
            }

            var $this_t = $this.offset().top,
                $this_l = $this.offset().left,
                $this_w = $this.outerWidth(),
                $this_h = $this.outerHeight(),
                $target_w = $target.outerWidth(),
                $target_h = $target.outerHeight(),
                window_w = $(window).width(),
                window_h = $(window).height(),
                scroll_t = $(document).scrollTop(),
                scroll_l = $(document).scrollLeft(),
                cssConfig = {},
                arrowCls = '',
                arrowCssConfig = {};

            if (options.side == 'left' || options.side == 'right') {

                if (options.side == 'left' && $target_w <= $this_l - scroll_l
                    || options.side == 'right' && $target_w > window_w - ($this_l - scroll_l) - $this_w
                ) {
                    arrowCls = 'right';
                    cssConfig['left'] = 0 + options.position.left;
                    cssConfig['margin-left'] = ($target_w + 8) * (-1);
                } else {
                    arrowCls = 'left';
                    cssConfig['left'] = 0 + options.position.left;
                    cssConfig['margin-left'] = $this_w + 8;
                }

                if (options.contSide && options.contSide == 'bottom' || options.contSide && options.contSide != 'bottom' && $target_h <= window_h - ($this_t - scroll_t)) {
                    arrowCls += '-top';
                    cssConfig['top'] = 0 + options.position.top;
                    cssConfig['margin-top'] = 0;
                    arrowCssConfig['top'] = $this_h < $target_h ? $this_h / 2 : $target_h / 2;
                } else if (options.contSide && options.contSide == 'middle') {
                    cssConfig['top'] = 0 + options.position.top;
                    cssConfig['margin-top'] = ($target_h - $this_h) * (-0.5);
                } else {
                    arrowCls += '-bottom';
                    cssConfig['top'] = 0 + options.position.top;
                    cssConfig['margin-top'] = ($target_h - $this_h) * (-1);
                    arrowCssConfig['top'] = $target_h - ($this_h < $target_h ? $this_h / 2 : $target_h / 2);
                }

            } else if (options.side == 'top' || options.side == 'bottom') {

                if ( (options.side == 'top' && $this_t - scroll_t < $target_h)
                    || options.side == 'bottom' && $target_h < window_h - ($this_t - scroll_t)
                ) {
                    arrowCls = 'top';
                    cssConfig['top'] = 0 + options.position.top;
                    cssConfig['margin-top'] = $this_h + 5;
                } else {
                    arrowCls = 'bottom';
                    cssConfig['top'] = 0 + options.position.top;
                    cssConfig['margin-top'] = ($target_h + 5) * (-1);
                }

                if (options.contSide && options.contSide == 'left' || options.contSide && options.contSide != 'right' && $target_w > window_w - ($this_l - scroll_l)) {
                    arrowCls += '-right';
                    cssConfig['left'] = 0 + options.position.left;
                    cssConfig['margin-left'] = ($target_w - $this_w) * (-1);
                    arrowCssConfig['left'] = $target_w - ($this_w < $target_w ? $this_w / 2 : $target_w / 2);
                } else if (options.contSide && options.contSide == 'middle') {
                    cssConfig['left'] = 0 + options.position.left;
                    cssConfig['margin-left'] = ($target_w - $this_w) * (-0.5);
                } else {
                    arrowCls += '-left';
                    cssConfig['left'] = 0 + options.position.left;
                    cssConfig['margin-left'] = 0;
                    arrowCssConfig['left'] = $this_w < $target_w ? $this_w / 2 : $target_w / 2;
                }

            }

            $target
                .css(cssConfig)
                .addClass('ui-tooltips-' + arrowCls + '-arrow')
                .data('arrowCls', 'ui-tooltips-' + arrowCls + '-arrow')
                .addClass('z-ui-tooltips-in')
                .find('i.J-arrow')
                .css(arrowCssConfig);

            options.onShow && options.onShow($target);
        });

        if (options.eventShow != 'click') {
            options.target.on(options.eventHide, function () {
                var $target = $(this).find('div.J-tooltips');

                $target.addClass('z-ui-tooltips-out');

                setTimeout(function () {
                    $target.removeClass('z-ui-tooltips-in z-ui-tooltips-out' + ' ' + $target.data('arrowCls'));
                    options.showFlag = false;
                    options.onHide && options.onHide($target);
                }, 200);
            });
        } else {
            $(document).on('click', function (e) {
                if ($(e.target).closest(options.target).length == 0) {
                    var $target = options.target.find('div.J-tooltips');

                    $target.addClass('z-ui-tooltips-out');

                    setTimeout(function () {
                        $target.removeClass('z-ui-tooltips-in z-ui-tooltips-out' + ' ' + $target.data('arrowCls'));
                        options.showFlag = false;
                        options.onHide && options.onHide($target);
                    }, 200);
                }
            });
        }

        return options.target.find('div.J-tooltips');
    } else {
        return;
    }
};

/*
 * 提示框显示方法
 * */
tooltips.show = function ($target) {
    var flag = $target.data('tooltipsCreateFlag');
    if (typeof flag == 'undefined' || (flag && flag.toString() != 'true')) {
        $target.addClass('z-ui-tooltips-in');
    } else {
        console.log('通过 create 方法构造出来的 tooltips 不支持 show 方法。请通过触发事件的方式显示它。');
    }
};

/*
 * 提示框隐藏方法
 * */
tooltips.hide = function ($target) {
    $target.addClass('z-ui-tooltips-out');

    setTimeout(function () {
        $target.removeClass('z-ui-tooltips-in z-ui-tooltips-out' + ' ' + $target.data('arrowCls'));
    }, 200);
};

module.exports = tooltips;

},{"../Template/Template":11}],13:[function(require,module,exports){
'use strict';
(function(window, $){
    //实例
    var Monitor = require('./Util_modules/Monitor/Monitor');
    var Storage = require('./Util_modules/Storage/Storage');
    var ItvEvents = require('./Util_modules/ItvEvents/ItvEvents');
    var JsLoader = require('./Util_modules/JsLoader/JsLoader');

    //类
    //var Switchable = require('./Util_modules/Switchable/Switchable');
    var Pager = require('./Util_modules/Pager/Pager');

    //方法
    var Template = require('./Util_modules/Template/Template');
    var GetStrCodeLength = require('./Util_modules/GetStrCodeLength/GetStrCodeLength');
    var SubStrByCode = require('./Util_modules/SubStrByCode/SubStrByCode');
    var Tooltips = require('./Util_modules/Tooltips/Tooltips');

    //原生对象方法扩展
    var DateFormat = require('./Util_modules/DateFormat/DateFormat');

    //Jquery方法扩展
    //var ValidationEngine = require('./Util_modules/ValidationEngine/ValidationEngine');
    //var ValidationEngineLanguage = require('./Util_modules/ValidationEngine/ValidationEngineLanguageCN');

    window.H = window.H || {};

    //代理console.log
    H.log = function(msg){
        if(window["console"]){
            try{
                console.log.call(console, "%c" + msg, "font-size:14px; color:#C0A; font-family:微软雅黑; text-shadow:0px 1px 2px #ff0;");
            }catch(e){
                console.log(msg);
            }
        }
    };

    //实例
    H.Monitor = new Monitor();
    H.Storage = new Storage();
    H.ItvEvents = new ItvEvents();
    H.JsLoader = new JsLoader();

    //类
    //H.Switchable = Switchable;
    H.Pager = Pager;

    //方法
    H.template = Template;
    H.getStrCodeLength = GetStrCodeLength;
    H.subStrByCode = SubStrByCode;
    H.tooltips = Tooltips;

    //原生对象方法扩展
    DateFormat();

    //Jquery方法扩展
    //ValidationEngine($);
    //ValidationEngineLanguage($);

})(window, jQuery);

},{"./Util_modules/DateFormat/DateFormat":1,"./Util_modules/GetStrCodeLength/GetStrCodeLength":2,"./Util_modules/ItvEvents/ItvEvents":3,"./Util_modules/JsLoader/JsLoader":4,"./Util_modules/Monitor/Monitor":7,"./Util_modules/Pager/Pager":8,"./Util_modules/Storage/Storage":9,"./Util_modules/SubStrByCode/SubStrByCode":10,"./Util_modules/Template/Template":11,"./Util_modules/Tooltips/Tooltips":12}]},{},[13])