(function (window, $, CaimaoDataApi) {

    //为赔率公司定义一串颜色数组   COLOR_ARRAY[i%COLOR_ARRAY.length]
    const COLOR_ARRAY = ['#AC2924','#21ADE7','#FC8E12','#EF2566','#1B94C5','#2F4498','#1F1B83','#E9C11E','#208149','#CCC012','#134089','#FC7113','#814B0C','#359A7D','#524A8F','#6481CF','#606060','#DB5B1B', '#386EAE','#D8443B','#E15CDD','#E96C6A','#E9C223','#00012E','#117030','#FB1900','#CCC114'];

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

            item.returnRate = item.nowSheng * item.nowPing * item.nowFu / (item.nowSheng * item.nowPing + item.nowSheng * item.nowFu + item.nowPing * item.nowFu);

            item.color = COLOR_ARRAY[i % COLOR_ARRAY.length];
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
            item.abRate = getRate( 1 + item.nowAb);
            item.beRate = getRate( 1 + item.nowBe);

            item.abRateStr = (item.abRate * 100).toFixed(1) + '%';
            item.beRateStr = (item.beRate * 100).toFixed(1) + '%';

            asiaAbRateTotal += item.abRate;
            asiaBeRateTotal += item.beRate;

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


    let dataHandle= function(data){
        if(data.europeOdds) {
            calculateEuropeKaili(data.europeOdds);
        }
        if(data.asiaOdds) {
            perfectedAsia(data.asiaOdds);
        }
    }

    window.MatchOddsCore = {
        init: function(mid){
            CaimaoDataApi.getMatchOdds(mid, function(data){

                //处理数据
                dataHandle(data);

                console.log('获取比赛赔率数据', data);

                //解析模板 渲染
                $("#match-content").html(Core.templateTpl('template/odds.tpl', data));
            });
        }
    };
}(window, window.jQuery, window.CaimaoDataApi));
