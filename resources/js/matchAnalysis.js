
(function(window, $, template) {

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

    /**
     * 近期交锋 数据处理
     * @param data
     */
    let dataHandleHistory = function(data){
        if(!data.history){
            return;
        }

        //用 3 1 0 分别代表 胜平负
        let hostLs = [], hostZls = [], guestLs = [], guestZls = [];
        //本来就已经倒序了
        for (let i = 0; i < data.history.list.length; i++) {
            let item = data.history.list[i];

            //格式化时间
            item.matchTimeStr = item.matchTime.substring(2,10).replace(/\-/g, '/');

            if(item.hostGoal == item.guestGoal){
                //平
                hostLs.push(1);
                hostZls.push(1);
                guestLs.push(1);
                guestZls.push(1);
                item.hostCls = 'draw';
            }else if((item.hostId == data.match.hostId && item.hostGoal > item.guestGoal)
                || (item.hostId != data.match.hostId && item.hostGoal < item.guestGoal)){
                //当前比赛的主队 胜

                hostLs.push(3);
                guestLs.push(0);
                if(item.hostId == data.match.hostId){
                    //主场
                    hostZls.push(3);
                } else {
                    guestZls.push(0);
                }
                item.hostCls = 'win';
            } else {
                //当前比赛的客队 胜
                guestLs.push(3);
                hostLs.push(0);
                if(item.hostId == data.match.guestId){
                    //主场
                    guestZls.push(3);
                } else {
                    hostZls.push(0);
                }
                item.hostCls = 'lose';
            }
        }

        /**
         *
         * @param zhanji    Array 战绩
         * @param isHome    是否主场
         * @returns {string}
         */
        let getResultInfo = function(zhanji, isHome){
            let i = 0;
            for ( ; i < zhanji.length; i++) {
                if (i < zhanji.length - 1 && zhanji[i] != zhanji[i + 1]) {
                    //下一场战绩 与当前不一致
                    break;
                }
            }

            if(zhanji[i - 1] == 3){
                //连胜
                if(i > 1) {
                    return (isHome ? '主场':'') + '已经连胜' + i + '场';
                } else {
                    return '上一次' + (isHome ? '主场':'') + '交锋胜';
                }
            } else if (zhanji[i - 1] == 1){
                //平
                return '上一次' + (isHome ? '主场':'') + '交锋平';
            } else {
                //负
                return '上一次' + (isHome ? '主场':'') + '交锋负';
            }
        };

        //主队近期战绩统计说明
        data.history.hostResume = data.match.hostName + getResultInfo(hostLs, false) + ';' + getResultInfo(hostZls, true);
        data.history.guestResume = data.match.guestName + getResultInfo(guestLs, false) + ';' + getResultInfo(guestZls, true);

        //主队胜平负
        let spf = data.history.spf.split('|');
        data.history.hostSheng =  parseInt(spf[0]) || 0;
        data.history.hostPing =  parseInt(spf[1]) || 0;
        data.history.hostFu =  parseInt(spf[2]) || 0;


    };

    /**
     * 近期战绩数据处理
     * @param data
     */
    let dataHandleNear = function(data){

        data.nearArray = [data.nearHost, data.nearGuest];

        for (let i = 0; i < data.nearArray.length; i++) {
            if(data.nearArray[i].id == data.match.hostId){
                data.nearArray[i].logo = data.match.hostLogo;
            } else {
                data.nearArray[i].logo = data.match.guestLogo;
            }

            data.nearArray[i].zhanji = [];
            data.nearArray[i].win = 0;
            data.nearArray[i].ping = 0;
            data.nearArray[i].fu = 0;
            for (let j = 0; j < data.nearArray[i].matchs.length; j++) {
                let item = data.nearArray[i].matchs[j];

                //格式化时间
                item.matchTimeStr = item.matchTime.substring(2,10).replace(/\-/g, '/');

                let hostGoal = parseInt(item.goal.split('-')[0]);
                let guestGoal = parseInt(item.goal.split('-')[1]);
                if(hostGoal == guestGoal) {
                    data.nearArray[i].zhanji.push(1);
                    data.nearArray[i].ping++;
                    item.cls = 'draw';
                } else if ((item.hostId == data.nearArray[i].id && hostGoal > guestGoal)
                    || (item.hostId != data.nearArray[i].id && hostGoal < guestGoal)) {
                    data.nearArray[i].zhanji.push(3);
                    data.nearArray[i].win++;
                    item.cls = 'win';
                } else {
                    data.nearArray[i].zhanji.push(0);
                    data.nearArray[i].fu++;
                    item.cls = 'lose';
                }
            }
            data.nearArray[i].winRate = Math.round(100 *  data.nearArray[i].win /  data.nearArray[i].matchs.length);
        }
        console.log('data.nearArray',data.nearArray);
    };

    window.MatchAnalysis = {
        /**
         * 比赛详情数据处理
         * @param data
         */
        dataHandle : function(data){
            dataHandleHistory(data);

            dataHandleNear(data);
        }
    };

}(window, jQuery, template));