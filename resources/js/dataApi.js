(function (window, $) {
    let interfaceUrl = 'https://sports.fcaimao.com/interface.do';

    let doRequest = function (data, cb) {
        $.ajax({
            url: interfaceUrl,
            type: 'GET',
            data: data,
            dataType: 'jsonp', //指定服务器返回的数据类型
            jsonp: 'jsonpcallback',
            success: function (data) {
                cb && cb(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('请求失败啦，这个弹窗啥时候优化一下');
                console.error(textStatus, XMLHttpRequest);
            }
        });
    };

    let caimaoDataApi = {
        /**
         * 获取资讯栏位列表
         * @param cb
         */
        getSortList: function (cb) {
            doRequest({fn: 3000}, cb);
        },
        /**
         * 获取咨询列表
         * @param sortId    栏位ID
         * @param maxId
         * @param limit     每页条数
         * @param cb        回调函数
         */
        getArticleList: function (sortId, maxId, limit, cb) {
            doRequest({
                fn: 3001,
                sortId: sortId,
                maxId: maxId,
                limit: limit
            }, cb);
        },
        /**
         * 获取资讯详情
         * @param articleId 资讯ID
         * @param cb
         */
        getArticleDetail: function (articleId, cb) {
            doRequest({
                fn: 3002,
                id: articleId
            }, cb);
        },
        /**
         * 获取足球比赛列表
         * @param cb
         */
        getMatchList: function (cb) {
            doRequest({fn: 3103}, cb);
        },
        /**
         * 获取足球指定单场比赛的详情
         * @param mid   比赛ID
         * @param cb
         */
        getMatchDetail: function (mid, cb) {
            doRequest({fn: 1106, mid: mid}, cb);
        },
        /**
         * 获取单场比赛的 比赛实况及赛后技术统计
         * @param mid
         * @param cb
         */
        getMatchEventAndStatistics: function(mid, cb){
            doRequest({fn: 1105, mid: mid}, cb);
        },
        /**
         * 获取比赛赔率数据
         * @param mid   比赛ID
         * @param cb
         */
        getMatchOdds: function (mid, cb) {
            doRequest({fn: 1206, mid: mid}, cb);
        },
        /**
         * 获取某场比赛某个赔率公司的赔率变动明细
         * @param mid
         * @param compId
         * @param cb
         */
        getMatchEuropeOddLogWithCompId: function(mid, compId, cb){
            doRequest({fn: 1203, mid: mid, compId: compId}, cb);
        }
    };

    window.CaimaoDataApi = caimaoDataApi;
}(window, window.jQuery));
