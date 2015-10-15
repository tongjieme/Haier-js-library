'use strict';
//class Switchable 【依赖于Jquery】
var Switchable = function (options) {
    var _this = this;
    _this.defaults = {
        curTarget: 1,               //当前所在的分区
        count: 0,                   //分区数
        effect: 'slideX',           //切换效果
        autoPlay: true,             //自动播放
        interval: 3000,             //自动播放时间间隔
        overPause: false,           //覆盖暂停
        activeIndex: 1,             //开始步点
        delay: 500,                 //触发延迟时间
        activeCls: 'active',        //触发器选中样式
        nodeDom: null,              //hover时，停止轮播的触发元素
        prevDom: null,              //上一步DOM元素
        nextDom: null,              //下一步DOM元素
        panelDom: null,             //滚动层DOM
        triggerDom: null,           //触发器DOM
        triggerDomEvent: 'click',   //触发器DOM触发事件类型
        trigger: 'click',           //触发事件类型
        allowTrigger: true,         //切换分区开关
        itvObj: null,               //计时器缓存
        scrollTriggerDom: false     //是否开启触发器DOM滚动
    };
    _this.options = $.extend(_this.defaults, options);
    return _this;
};

//method 初始化
Switchable.prototype.init = function () {
    var _this = this,
        options = _this.options,
        panelDomChildren = options.panelDom.children();

    options.count = panelDomChildren.length;

    if (options.count > 1) {
        _this.bindTriggerEvent();    //绑定按钮事件

        //绑定事件
        switch (options.effect) {
            case 'slideX':
                //设置横向滑动距离
                _this.setScrollDistanceX();
                panelDomChildren.clone()
                    .appendTo(options.panelDom);
                break;
            case 'slideY':
                //设置纵向滑动距离
                _this.setScrollDistanceY();
                panelDomChildren.clone()
                    .appendTo(options.panelDom);
                break;
            case 'fadeX':
                //设置横向滑动距离
                _this.setScrollDistanceX();
                options.panelDom.children().css({
                    'position': 'absolute',
                    'display': 'none'
                }).eq(0).show();
                break;
            case 'fadeY':
                //设置纵向滑动距离
                _this.setScrollDistanceY();
                options.panelDom.children().css({
                    'position': 'absolute',
                    'display': 'none'
                }).eq(0).show();
                break;
            default:
                break;
        }

        if (options.effect.indexOf('X') != -1 && options.scrollDistance * options.count < options.panelDom.parent().width()
            || options.effect.indexOf('Y') != -1 && options.scrollDistance * options.count < options.panelDom.parent().height()) {
            return;
        }

        options.triggerDom && options.triggerDom.children()
            .on(options.triggerDomEvent + '.Switchable', function () {
                var $this = $(this),
                    count = options.count,
                    i = ($this.index() + 1) % count,
                    curTargetFlag = options.curTarget % count,
                    j;

                i = (i == 0) ? count : i;
                curTargetFlag = (curTargetFlag == 0) ? count : curTargetFlag;

                if (i != curTargetFlag) {
                    j = options.curTarget + i - curTargetFlag;
                    _this.switchTo(j);
                }

                $this.addClass(options.activeCls)
                    .siblings()
                    .removeClass(options.activeCls);
            })
            .eq(options.activeIndex - 1)
            .trigger('click.Switchable');

        //是否自动播放
        if (options.autoPlay) {
            var proxyEvt = $.proxy(_this.next, _this);
            options.itvObj = setInterval(proxyEvt, options.interval);

            if (options.nodeDom == null) {
                options.nodeDom = options.panelDom;
            }

            options.nodeDom.on({
                'mouseenter' : function () {
                    clearInterval(options.itvObj);
                },
                'mouseleave' : function () {
                    clearInterval(options.itvObj);
                    options.itvObj = setInterval(proxyEvt, options.interval);
                }
            });
        }
    }

    return _this;
};

//method 重置
Switchable.prototype.reset = function () {
    var _this = this,
        options = _this.options,
        count = options.count,
        targetFlag = options.curTarget % count,
        left;

    if (options.count > 1) {
        clearInterval(options.itvObj);
        options.itvObj = null;

        switch (options.effect) {
            case 'slideX':
                //设置横向滑动距离
                _this.setScrollDistanceX();
                break;
            case 'slideY':
                //设置纵向滑动距离
                _this.setScrollDistanceY();
                break;
            case 'fadeX':
                //设置横向滑动距离
                _this.setScrollDistanceX();
                break;
            case 'fadeY':
                //设置纵向滑动距离
                _this.setScrollDistanceY();
                break;
            default:
                break;
        }

        if (targetFlag == 0) {
            left = (count - 1) * options.scrollDistance;
        } else {
            left = (targetFlag - 1) * options.scrollDistance;
        }

        options.panelDom.css({
            'left' : -left
        });

        if (options.autoPlay) {
            var proxyEvt = $.proxy(_this.next, _this);
            options.itvObj = setInterval(proxyEvt, options.interval);
        }
    }

    return _this;
};

//method 设置横向滑动距离
Switchable.prototype.setScrollDistanceX = function () {
    var _this = this,
        options = _this.options,
        panelDomChildren = options.panelDom.children(),
        triggerDomChildren = options.triggerDom != null ? options.triggerDom.children() : $(''),
        childML,
        childMR;

    childML = panelDomChildren.eq(0).css('marginLeft');
    childMR = panelDomChildren.eq(0).css('marginRight');

    options.scrollDistance = panelDomChildren.eq(0).outerWidth()
        + parseInt(childML != 'auto' ? childML : 0)
        + parseInt(childMR != 'auto' ? childMR : 0);

    //设置滚动层的宽度
    options.panelDom.width(options.scrollDistance * options.count * 2);

    if (options.scrollTriggerDom) {
        //如果触发区开启了滚动支持
        childML = triggerDomChildren.eq(0).css('marginLeft');
        childMR = triggerDomChildren.eq(0).css('marginRight');

        options.trigger_scrollDistance = triggerDomChildren.eq(0).outerWidth()
            + parseInt(childML != 'auto' ? childML : 0)
            + parseInt(childMR != 'auto' ? childMR : 0);

        options.showTriggerCount = Math.ceil(options.triggerDom.parent().width() / options.trigger_scrollDistance);
        options.scrollTriggerCount = 0;
        if (options.count <= options.showTriggerCount) {
            options.scrollTriggerDom = false;
        }
    }
};

//method 设置纵向滑动距离
Switchable.prototype.setScrollDistanceY = function () {
    var _this = this,
        options = _this.options,
        panelDomChildren = options.panelDom.children(),
        triggerDomChildren = options.triggerDom != null ? options.triggerDom.children() : $(''),
        childMT,
        childMB;

    childMT = panelDomChildren.eq(0).css('marginTop');
    childMB = panelDomChildren.eq(0).css('marginBottom');

    options.scrollDistance = panelDomChildren.eq(0).outerHeight()
        + parseInt(childMT != 'auto' ? childMT : 0)
        + parseInt(childMB != 'auto' ? childMB : 0);

    //设置滚动层的宽度
    options.panelDom.height(options.scrollDistance * options.count * 2);

    if (options.scrollTriggerDom) {
        //如果触发区开启了滚动支持
        childMT = triggerDomChildren.eq(0).css('marginTop');
        childMB = triggerDomChildren.eq(0).css('marginBottom');

        options.trigger_scrollDistance = triggerDomChildren.eq(0).outerHeight()
            + parseInt(childMT != 'auto' ? childMT : 0)
            + parseInt(childMB != 'auto' ? childMB : 0);

        options.showTriggerCount = Math.ceil(options.triggerDom.parent().height() / options.trigger_scrollDistance);
        options.scrollTriggerCount = 0;
        if (options.count <= options.showTriggerCount) {
            options.scrollTriggerDom = false;
        }
    }
};

//method 绑定按钮事件
Switchable.prototype.bindTriggerEvent = function () {
    var _this = this,
        options = _this.options;

    options.nextDom && options.nextDom.on(options.trigger + '.Switchable', $.proxy(_this.next, _this));
    options.prevDom && options.prevDom.on(options.trigger + '.Switchable', $.proxy(_this.prev, _this));

    return _this;
};

//method 滑到指定的分区
Switchable.prototype.switchTo = function (i) {
    var _this = this;
    _this.animate(_this.options.effect, i);

    return _this;
};

Switchable.prototype.animate = function (type, i) {
    var _this = this,
        options = _this.options;

    var count = options.count,
        targetFlag = i % count,
        animateCallBack,
        direction = type.indexOf('X') != -1 ? 'left' : 'top',
        distance,
        triggerDistance;

    if (i > options.curTarget) {
        //前进
        if (targetFlag == 1) {
            animateCallBack = function () {
                options.panelDom.css(direction, 0);
                options.allowTrigger = true;
            };
        } else {
            animateCallBack = function () {
                options.allowTrigger = true;
                return;
            };
        }

        if (targetFlag == 1) {
            distance = count * options.scrollDistance;
        } else if (targetFlag == 0) {
            distance = (count - 1) * options.scrollDistance;
        } else {
            distance = (targetFlag - 1) * options.scrollDistance;
        }

        options.allowTrigger = false;

        var animateParam = {};
        animateParam[direction] = -distance;

        if (type.indexOf('slide') != -1) {
            options.panelDom.stop(true, false).animate(animateParam, 300, animateCallBack);
        } else {
            console.info(options.curTarget);
            options.panelDom.children()
                .eq((options.curTarget - 1) % count)
                .fadeOut(300)
                .end()
                .eq(options.curTarget % count)
                .fadeIn(300, function () {
                    options.allowTrigger = true;
                });
        }

        if (options.scrollTriggerDom) {
            //如果触发区开启了滚动支持
            if (targetFlag == 0 && options.scrollTriggerCount < count - options.showTriggerCount) {
                options.scrollTriggerCount = count - options.showTriggerCount;
            } else if (targetFlag - options.showTriggerCount > 0 && options.scrollTriggerCount < targetFlag - options.showTriggerCount) {
                options.scrollTriggerCount = targetFlag - options.showTriggerCount;
            } else if (targetFlag == 1) {
                options.scrollTriggerCount = 0;
            }
            triggerDistance = options.trigger_scrollDistance * options.scrollTriggerCount;

            var animateParam = {};
            animateParam[direction] = -triggerDistance;
            options.triggerDom.stop(true, false).animate(animateParam, 200);
        }

        //给触发按钮加上class
        _this.triggerAddCls(!targetFlag ? count : targetFlag);
        options.curTarget = i;

    } else if (i < options.curTarget) {
        //后退
        if (targetFlag == 0) {
            distance = (count - 1) * options.scrollDistance;
        } else {
            distance = (targetFlag - 1) * options.scrollDistance;
        }

        if (targetFlag == 0 && type.indexOf('slide') != -1) {
            options.panelDom.css(direction, -count * options.scrollDistance);
        }

        options.allowTrigger = false;

        var animateParam = {};
        animateParam[direction] = -distance;


        if (type.indexOf('slide') != -1) {
            options.panelDom.stop(true, false).animate(animateParam, 300, function () {
                options.allowTrigger = true;
            });
        } else {
            console.info(options.curTarget);
            options.panelDom.children()
                .eq((options.curTarget - 1) % count)
                .fadeOut(300)
                .end()
                .eq((options.curTarget - 2) % count)
                .fadeIn(300, function () {
                    options.allowTrigger = true;
                });
        }

        if (options.scrollTriggerDom) {
            //如果触发区开启了滚动支持
            if (targetFlag == 0 && options.scrollTriggerCount < count - options.showTriggerCount) {
                options.scrollTriggerCount = count - options.showTriggerCount;
            } else if (targetFlag < count - options.showTriggerCount + 1 && options.scrollTriggerCount > targetFlag - 1) {
                options.scrollTriggerCount = targetFlag - 1;
            }

            triggerDistance = options.trigger_scrollDistance * options.scrollTriggerCount;

            var animateParam = {};
            animateParam[direction] = -triggerDistance;
            options.triggerDom.stop(true, false).animate(animateParam, 200);
        }

        //给触发按钮加上class
        _this.triggerAddCls(!targetFlag ? count : targetFlag);
        options.curTarget = (i == 0) ? _this.defaults.count : i;
    }
};

//method 为当前触发器添加样式
Switchable.prototype.triggerAddCls = function (i) {
    var _this = this,
        options = _this.options;

    options.triggerDom && options.triggerDom
        .children()
        .eq(i - 1)
        .addClass(options.activeCls)
        .siblings()
        .removeClass(options.activeCls);
};

//method 滑到上一分区
Switchable.prototype.prev = function () {
    var _this = this,
        options = _this.options,
        i = options.curTarget;

    if (options.allowTrigger) {
        i--;
        _this.switchTo(i);
    }
};

//method 滑到下一分区
Switchable.prototype.next = function () {
    var _this = this,
        options = _this.options,
        i = options.curTarget;

    if (options.allowTrigger) {
        i++;
        _this.switchTo(i);
    }
};

window.H = window.H || {};
H.Switchable = Switchable;
