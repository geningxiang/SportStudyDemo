
(function(window, $, template) {

    window.showMore = function(t, cls){
        console.log($(t));
        $(t).hide();
        $("." + cls).show();
    };

    var templateCache = {};
    var templateTpl = function(tplUrl, data){
        var render = templateCache[tplUrl];
        if(render) {
            return render(data);
        } else {
            var s = '';
            $.ajax({
                type : "get",
                url : tplUrl,
                async : false,
                success : function(msg){
                    render = template.compile(msg);
                    templateCache[tplUrl] = render;
                    s = render(data);
                }
            });
            return s;
        }
    };
    /** 判断 310 */
    var getResult = function(val){
        if(val == '3') {
            return "胜";
        } else if (val == '1') {
            return "平";
        } else if (val == '0') {
            return "负";
        } else {
            return "";
        }
    };
    /** 根据历史交锋分析 */
    var getResultInfo = function(str, isHome){
        var info = '';
        //连胜或连负
        var m = str.match(/[3]*/) || str.match(/[1]*/) || str.match(/[0]*/);

        if(m && m[0] && m[0].length > 1) {
            var s1 = m[0];
            info = (isHome ? '主场' : '') + '已经连' + getResult(s1.charAt(0)) + s1.length + '场';
        } else {
            info += '上一次' + (isHome ? '主场' : '') + '交锋' + getResult(str.charAt(0));
            str = str.substring(1);
            m = str.match(/[3]*/) || str.match(/[1]*/) || str.match(/[0]*/);
            if(m && m[0] && m[0].length > 1) {
                var s2 = m[0];
                info += ',' + ( s2.charAt(0) == '3' ? '终结了' : '结束了')+  s2.length + '连' + getResult(s2.charAt(0));
            }
        }
        return info;
    };

    /**
     * 画圈圈  画线时 画板尺寸 * 4
     * @param {Object} rate
     */
    var drawCircleFn = function(canvasId, canvasDivId, rate, bgColor, color){
        var canvas = document.getElementById(canvasId);
        var parentNode = canvas.parentNode;
        var context = canvas.getContext('2d');
        var counterClockwise = false;   //逆时针
        var x = 160, y = 160;
        context.beginPath();
        context.lineWidth = 20;
        context.arc(x, y, x-20, 0.75 * Math.PI, 2.25 * Math.PI, counterClockwise);
        context.strokeStyle = bgColor;
        context.stroke();
        context.closePath();
        if(rate == undefined || isNaN(rate)) return;
        context.beginPath();
        context.arc(x, y, x-20, 0.75 * Math.PI, (0.75 + 1.5 * rate / 100) * Math.PI, counterClockwise);
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        $("#" + canvasDivId).append('<p>' + rate + '</p>');
    };

    /** 格式化时间 */
    var getMatchDate = function(matchTime){
        var s = matchTime.substring(2,10);
        return s.replace(/\-/g, '/');
    };

    /** 计算胜率 */
    var getWinRate = function(winNum, matchNum){
        if(matchNum == 0) return 0;
        return parseInt(winNum * 100 / matchNum);
    };

    /** 计算 当前到比赛时间的间隔天数 */
    var getSpaceDays = function(timeStr){
        var date = new Date();
        var startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        var endTime = new Date(Date.parse(timeStr.substring(0,10).replace(/-/g,   "/"))).getTime();
        var dates = parseInt(Math.abs((startTime - endTime))/(1000*60*60*24));
        return  dates;
    };

    //注册在模板中需要用到的方法
    template.defaults.imports.parseInt = parseInt;
    template.defaults.imports.Math = Math;
    template.defaults.imports.console = console;
    template.defaults.imports.getResult = getResult;
    template.defaults.imports.getResultInfo = getResultInfo;
    template.defaults.imports.getMatchDate = getMatchDate;
    template.defaults.imports.getWinRate = getWinRate;
    template.defaults.imports.getSpaceDays = getSpaceDays;

    var matchDetailCore = {
        switchToEvent: function(mid){
            $.ajax({
                type: "GET",
                url: 'http://sports.fcaimao.com/interface.do',
                data: {
                    fn: 1105,
                    mid: mid
                },
                dataType: 'jsonp', //指定服务器返回的数据类型
                jsonp: 'jsonpcallback',
                success: function (data) {
                    console.log('返回的赛事实况数据', data);
                    $("#match-content").html(templateTpl('template/event.tpl', data));
                },
                error: function (f) {

                }
            });
        },
        switchToAnalysis: function(d){
            $("#match-content").html(templateTpl('template/analysis.tpl', d));

            //canvas 话两个 胜率 的圈
            var hostRate;
            if(d.nearHost && d.nearHost.bifenInfo) {
                hostRate = parseInt(d.nearHost.bifenInfo.split("-")[3]);
            }
            drawCircleFn("hostCanvas", "hostCanvasDiv", hostRate, "#F1A1A1", "#E34646");
            var guestRate;
            if(d.nearGuest && d.nearGuest.bifenInfo) {
                guestRate = parseInt(d.nearGuest.bifenInfo.split("-")[3]);
            }
            drawCircleFn("guestCanvas", "guestCanvasDiv",  guestRate, "#ACB7D8", "#5A6FB1");
        },
        switchToOdds: function(mid){
            $("#match-content").html(templateTpl('template/odds.tpl', {}));

            $("#odds-tab li").click(function(){
                var li = $(this);
                if(!li.hasClass('current')) {
                    $("#odds-tab li").removeClass('current');
                    li.addClass('current');
                    $("#odds-content").attr("data-index", li.attr("data-index"));
                }
            });
        }
    };

    window.matchDetailCore = matchDetailCore;
}(window, $, template));
