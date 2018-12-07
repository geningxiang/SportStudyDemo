(function (window, $, CaimaoDataApi, F2) {

    //为赔率公司定义一串颜色数组   COLOR_ARRAY[i%COLOR_ARRAY.length]
    const COLOR_ARRAY = ['#AC2924','#21ADE7','#FC8E12','#EF2566','#1B94C5','#2F4498','#1F1B83','#E9C11E','#208149','#CCC012','#134089','#FC7113','#814B0C','#359A7D','#524A8F','#6481CF','#606060','#DB5B1B', '#386EAE','#D8443B','#E15CDD','#E96C6A','#E9C223','#00012E','#117030','#FB1900','#CCC114'];

    let europeCompanyMap = {};

    /**
     * 获取概率  主要为了防止 d=0 或 undefined
     * @param d
     * @returns {number}
     */
    let getRate = function(d) {
        if (d) {
            return 1 / d;
        }else {
            return 1;
        }
    };

    /**
     * 计算欧赔凯里指数
     * @param europeOdds
     */
    let calculateEuropeKaili = function(europeOdds) {
        let europeShengRateTotal = 0, europePingRateTotal = 0, europeFuRateTotal = 0;
        //第一次遍历
        for (let i = 0; i < europeOdds.length; i++) {
            let item = europeOdds[i];
            //即使赔率为空数据修补
            if (!item.nowSheng)
                item.nowSheng = item.initSheng;
            if (!item.nowPing)
                item.nowPing = item.initPing;
            if (!item.nowFu)
                item.nowFu = item.initFu;

            item.shengRate = getRate(item.nowSheng);
            item.pingRate = getRate(item.nowPing);
            item.fuRate = getRate(item.nowFu);
            europeShengRateTotal += item.shengRate;
            europePingRateTotal += item.pingRate;
            europeFuRateTotal += item.fuRate;

            //返还率 = 胜赔率 * 平赔率 * 负赔率 / （胜赔率 * 平赔率 + 胜赔率 * 负赔率 + 平赔率 * 负赔率）
            item.returnRate = item.nowSheng * item.nowPing * item.nowFu / (item.nowSheng * item.nowPing + item.nowSheng * item.nowFu + item.nowPing * item.nowFu);

            item.color = COLOR_ARRAY[i % COLOR_ARRAY.length];

            //compId 转字符串  F2无法按数值汇总
            item.compId = ''+item.compId;
            europeCompanyMap[item.compId] = item;
        }

        //计算出赔率的平均值
        let europeShengRateAvg = europeShengRateTotal / europeOdds.length;
        let europePingRateAvg = europePingRateTotal / europeOdds.length;
        let europeFuRateAvg = europeFuRateTotal /europeOdds.length;

        let rateArray = ['shengRate','pingRate','fuRate','returnRate'];
        //第二次遍历  赋值 凯利指数
        for (let i = 0; i < europeOdds.length; i++) {
            let item = europeOdds[i];
            item.kailiSheng = (item.nowSheng * europeShengRateAvg).toFixed(2);
            item.kailiPing = (item.nowPing * europePingRateAvg).toFixed(2);
            item.kailiFu = (item.nowFu * europeFuRateAvg).toFixed(2);
            //小数 转 百分比 并 四舍五入
            for (let j = 0; j < rateArray.length; j++) {
                item[rateArray[j] + 'Str'] = (item[rateArray[j]] * 100).toFixed(1) + '%';
            }
        }
    };

    /** 完善亚盘数据 */
    let perfectedAsia = function(asiaOdds) {
        var asiaAbRateTotal = 0, asiaBeRateTotal = 0;
        for (var i = 0; i < asiaOdds.length; i++) {
            var item = asiaOdds[i];
            item.initAb = (parseFloat(item.initAb)).toFixed(3) / 1;
            item.initBe = (parseFloat(item.initBe)).toFixed(3) / 1;
            if (item.nowAb) {
                item.nowAb = (parseFloat(item.nowAb)).toFixed(3) / 1;
            } else {
                item.nowAb = item.initAb;
            }
            if (item.nowBe) {
                item.nowBe = (parseFloat(item.nowBe)).toFixed(3) / 1;
            } else {
                item.nowBe = item.initBe;
            }
            // 欧赔 赔率的数值不包含本金
            item.abRate = getRate( 1 + item.nowAb);
            item.beRate = getRate( 1 + item.nowBe);

            item.abRateStr = (item.abRate * 100).toFixed(1) + '%';
            item.beRateStr = (item.beRate * 100).toFixed(1) + '%';

            asiaAbRateTotal += item.abRate;
            asiaBeRateTotal += item.beRate;

            //数值转字符串
            item.compId = ''+item.compId;
            item.color = COLOR_ARRAY[i % COLOR_ARRAY.length];
        }
        var asiaAbRateAvg = asiaAbRateTotal / asiaOdds.length;
        var asiaBeRateAvg = asiaBeRateTotal / asiaOdds.length;
        for (var i = 0; i < asiaOdds.length; i++) {
            var item = asiaOdds[i];
            item.kailiAb = ((1 + item.nowAb) * asiaAbRateAvg).toFixed(2) / 1;
            item.kailiBe = ((1 + item.nowBe) * asiaBeRateAvg).toFixed(2) / 1;

        }
    };

    /**
     * 数据处理
     * @param data
     */
    let dataHandle= function(data){
        if(data.europeOdds) {
            //欧赔数据处理
            calculateEuropeKaili(data.europeOdds);
        }
        if(data.asiaOdds) {
            //亚赔数据处理
            perfectedAsia(data.asiaOdds);
        }
    };

    //存欧赔图表对象  第二次就可以直接重绘
    let myEuropeChart;
    /**
     * 绘制欧赔图表
     * @param mid           比赛id
     * @param type          sheng、ping、fu
     * @param maxCompId     信心最高公司ID
     * @param minCompId     信心最低公司ID
     * @param diffCompId    幅度最大公司ID
     * @param companyMap    公司map 主要为了放 公司名和颜色
     */
    let drawEuropeChart = function(mid, type, maxCompId, minCompId, diffCompId, companyMap){
        let ids = [maxCompId];
        if(minCompId != maxCompId) {
            ids.push(minCompId);
        }
        if(diffCompId != maxCompId && diffCompId != minCompId){
            ids.push(diffCompId)
        }
        console.log('准备查询下列公司赔率明细', ids);


        //查询图表所需的数据
        getEuropeChartData(mid, type, ids, function(data){
            console.log('图表数据', data);

            var chart = new F2.Chart({
                id: 'europeOddCanvas',
                pixelRatio: window.devicePixelRatio
            });

            chart.source(data, {
                rate: {
                    type: 'linear',
                    tickCount: 5,
                },
                oddsTimeLong: {
                    type: 'linear',
                    range: [0, 1]
                }
            });
            chart.tooltip(false);
            chart.axis('oddsTimeLong', {
                label: function label(text, index, total) {
                    var textCfg = {};
                    if (index === 0) {
                        textCfg.textAlign = 'left';
                        textCfg.text = '(初)';
                    } else if (index > 0 && index === total - 1) {
                        textCfg.textAlign = 'right';
                        textCfg.text = '(即)';
                    } else {
                        textCfg = null;
                    }
                    return textCfg;
                }
            });
            chart.axis('rate', {
                label: function label(text, index, total) {
                    return {text: text + '%'};
                }
            });
            chart.legend('compId', {
                align: 'center',
                itemFormatter: function(val){
                    return europeCompanyMap[val] && europeCompanyMap[val].compName;
                }
            });

            chart.line().position('oddsTimeLong*rate').color('compId', function(val) {
                return europeCompanyMap[val] && europeCompanyMap[val].color;
            });
            chart.render();
            myEuropeChart = chart;
        });
    };



    /**
     * 获取赔率
     * @param mid
     * @param compIds
     * @param cb
     */
    let europeOddLogTemp = {};

    let getEuropeChartData = function(mid, type, compIds, cb){

        if(compIds && compIds.length > 0){
            let europChartData = [];
            let finished = 0;
            for (const compId of compIds) {
                CaimaoDataApi.getMatchEuropeOddLogWithCompId(mid, compId, function (data) {
                    console.log('赔率明细', data);

                    for (let i = data.data.length - 1; i >= 0; i--) {
                        data.data[i].compId = ''+data.data[i].compId;
                        data.data[i].rate = (100 / data.data[i][type]).toFixed(1);
                        europChartData.push(data.data[i]);
                    }
                    finished++;
                    if(finished == compIds.length){
                        cb && cb(europChartData);
                    }
                });
            }
        }
    }


    window.MatchOddsCore = {
        init: function(mid){
            //获取单场比赛的赔率数据
            CaimaoDataApi.getMatchOdds(mid, function(data){

                //处理数据
                dataHandle(data);

                console.log('获取比赛赔率数据', data);

                //解析模板 渲染
                $("#match-odds-content").html(Core.templateTpl('template/matchOdds.tpl', data));


                //欧赔图表初始化   #europeOddCanvas
                drawEuropeChart(mid, 'sheng', data.europeOddStatistics.srMax, data.europeOddStatistics.srMin, data.europeOddStatistics.srDiffer, europeCompanyMap);

                //欧赔图表  胜平负 切换
                $("#chartStatiscUl li").click(function(){
                    if($(this).hasClass("current")){
                        return;
                    }
                    $("#chartStatiscUl li.current").removeClass("current");
                    $(this).addClass("current")
                    let type = $(this).attr("data-value");
                    if(type == 'sheng'){
                        drawEuropeChart(mid, 'sheng', data.europeOddStatistics.srMax, data.europeOddStatistics.srMin, data.europeOddStatistics.srDiffer, europeCompanyMap);
                    } else if (type == 'ping') {
                        drawEuropeChart(mid, 'ping', data.europeOddStatistics.prMax, data.europeOddStatistics.prMin, data.europeOddStatistics.prDiffer, europeCompanyMap);
                    } else if (type == 'fu') {
                        drawEuropeChart(mid, 'fu', data.europeOddStatistics.frMax, data.europeOddStatistics.frMin, data.europeOddStatistics.frDiffer, europeCompanyMap);
                    }
                });
            });
        }
    };
}(window, window.jQuery, window.CaimaoDataApi, window.F2));
