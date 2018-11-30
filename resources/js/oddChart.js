(function (window, $, CaimaoDataApi) {
    //设备像素比 在手机上显示会更清晰
    let devicePixelRatio = window.devicePixelRatio || 2;

    /**
     * 构建 绘制 欧赔 图表 的类
     * @param el        要绘制的canvas的上级 DOM节点
     * @param companys [{compId: 803, color: '#AC2924'}...]
     * @param sn        sheng|ping|fu
     * @param minSp     最低赔率
     * @param maxSp     最高赔率
     * @param minTime   最早时间
     * @param maxTime   最晚时间
     */
    function CaimaoOddEuropeChart(el, companys, sn, minSp, maxSp, minTime, maxTime){
        this.el = el;
        this.companys = companys;
        this.sn = sn;
        this.minRate = 1 / maxSp;
        this.maxRate = 1 / minSp;
        this.minTime = minTime;
        this.maxTime = maxTime;
    }

    CaimaoOddEuropeChart.prototype.draw = function() {
        console.log('draw', this);
    };

    window.CaimaoOddEuropeChart = CaimaoOddEuropeChart;

    window.CaimaoOddEuropeChart1 = {
        width: 1200,
        height: 400,
        lineWidth: 4,
        radius: 6,
        cache: {},

        /**
         * 绘制 欧赔 图表
         * @param el        要绘制的canvas的上级 DOM节点
         * @param companys [{compId: 803, color: '#AC2924'}...]
         * @param sn        sheng|ping|fu
         * @param minSp     最低赔率
         * @param maxSp     最高赔率
         * @param minTime   最早时间
         * @param maxTime   最晚时间
         */
        draw: function(el, companys, sn, minSp, maxSp, minTime, maxTime){

            let canvas = document.getElementById("chartCanvas");
            //为了提高在手机上清晰度  应为在手机上 dpi
            canvas.width = el.clientWidth * devicePixelRatio;
            canvas.height = el.clientHeight * devicePixelRatio;
            el.append(canvas);

        },
        getX : function(time){
            return (time - this.minTime) / (this.maxTime - this.minTime) * (this.width - 2 * this.radius) + this.radius;
        },
        getY : function(rate){
            return (rate - this.minRate) / (this.maxRate - this.minRate) * (this.height - 2 * this.radius)  + this.radius;
        },
        drawOneCompany: function(context, companys, sn){
            var comp = companys.pop();
            if(!comp) return;
            var that = this;
            var compId = comp.compId;

            var drawOneCompanyFn = function(logs){
                var x, y;
                context.strokeStyle = comp.color;
                context.fillStyle = comp.color;
                for(var i = 0 ; i < logs.length ; i++) {
                    var item = logs[i];
                    item.rate = 100 / parseFloat(item[sn]);
                }
                for(var i = logs.length - 1 ; i >= 0; i--) {
                    var item = logs[i];
                    //波动小于 0.01的  不显示点
                    if(i > 0 && i < logs.length - 1 && Math.abs(item.rate - logs[i-1].rate) < 0.01 &&  Math.abs(item.rate - logs[i+1].rate) < 0.01) {
                        continue;
                    }
                    x = that.getX(item.oddsTimeLong);
                    y = that.getY(item.rate);
                    if(i == logs.length - 1) {
                        context.beginPath();
                        context.arc(x, y, that.radius, 0, Math.PI * 2, true);
                        //不关闭路径路径会一直保留下去，当然也可以利用这个特点做出意想不到的效果
                        context.closePath();
                        context.fill();
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                        context.stroke();
                        context.beginPath();
                        context.arc(x, y, that.radius, 0, Math.PI * 2, true);
                        //不关闭路径路径会一直保留下去，当然也可以利用这个特点做出意想不到的效果
                        context.closePath();
                        context.fill();
                        context.moveTo(x, y);
                    }
                }
                //that.drawOneCompany(context, companys, sn);
            };
            if(this.cache[compId]) {
                drawOneCompanyFn(this.cache[compId]);
            } else {
                $.ajax({ url: "/interface.do", data : {fn: 1203, mid: mid, compId: compId }, dataType: "json",success: function(d){
                        if(d.flag == '1') {
                            drawOneCompanyFn(d.data);
                            that.cache[compId] = d.data;
                        }
                    }});
            }
        }
    };
}(window, jQuery, CaimaoDataApi));