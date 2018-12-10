
;(function (window, $) {

    //TODO 模板缓存 暂时只用内存缓存  可以考虑用 window.localStorage
    let templateCache = {};

    let core = {
        /**
         * 从当前链接获取参数的值
         * @param param 参数名
         * @returns string
         */
        getParam: function (param) {
            let g = new RegExp("(\\?|#|&)" + param + "=([^&#]*)(&|#|$)");
            let d = location.href.match(g);
            return d ? d[2] || "" : "";
        },

        /**
         * 使用指定的模板地址  解析
         * @param tplUrl
         * @param data
         * @returns string
         */
        templateTpl: function(tplUrl, data){
            let render = templateCache[tplUrl];
            if(render) {
                return render(data);
            } else {
                let s = '';
                $.ajax({
                    type : "get",
                    //防浏览器缓存
                    url : tplUrl + '?t=' + new Date().getTime(),
                    //同步执行
                    async : false,
                    success : function(msg){
                        render = template.compile(msg);
                        templateCache[tplUrl] = render;
                        s = render(data);
                    }
                });
                return s;
            }
        },
        /**
         * 延时关闭的提示框
         * @param content
         */
        tips: function (content) {
            $(".tipsAni").remove();

            let tipsDiv = document.createElement("div");

            tipsDiv.id = "common_tips";
            tipsDiv.innerHTML = content;
            $("body").append(tipsDiv);
            tipsDiv.className = "tipsAni";
            tipsDiv.style["-webkit-animation-name"] = "tipsAniControl";
            tipsDiv.style["animation-name"] = "tipsAniControl";

            //动画结束后触发的事件
            let d = function () {
                tipsDiv.style["-webkit-animation-name"] = "";
                tipsDiv.style["animation-name"] = "";
                $("#common_tips").remove();
            };
            tipsDiv.addEventListener("webkitAnimationEnd", d, false);
            tipsDiv.addEventListener("animationend", d, false);
        },
        /**
         * 计算一个对象数组  某个字段的sum
         * @param objArray
         * @param paramName
         */
        sumOfObjArray: function(objArray, paramName){
            let sum = 0;
            if(objArray && paramName && Array.isArray(objArray)){
                for (const item of objArray) {
                    if(Object.prototype.toString.call(item) === '[Object Object]'){
                        sum += item[paramName];
                    }
                }
            }
            return sum;
        },
        /**
         * 计算一个对象数组  某个字段的平均值
         * @param objArray
         * @param paramName
         * @returns {number}
         */
        avgOfObjArray: function(objArray, paramName){
            let sum = this.sumOfObjArray(objArray, paramName);
            let count = (objArray && objArray.length) || 0;
            return count ? sum / count : 0;
        }
    };

    //原生写法， 直接注册到window.Core  这里暂时未考虑 AMD、CMD 规范
    window.Core = core;
}(window, window.jQuery));


$(function(){
    /**
     * 注册一个通用的标签切换事件
     * 用法如下：
     * 1、tab
     *  <ul class="caimao-tab" data-target="指定要切换的内容元素(jquery写法)">
     *      <li data-index="1"></li>
     *      <li data-index="2"></li>
     *  </ul>
     *
     * 2、内容
     *  <article>
     *      这个div 加css过渡效果， 并使用属性选择器， 为其定义2D转换
     *      <div id="内容元素ID" data-index="1">
     *      </div>
     *  </article>
     *
     */
    $(document).on('click', '.caimao-tab > li', function(){
        var li = $(this);
        if(!li.hasClass('current')) {
            li.parent().children().removeClass('current');
            li.addClass('current');
            $(li.parent().attr("data-target")).attr("data-index", li.attr("data-index"));
        }
    });
});