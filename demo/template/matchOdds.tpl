<ul id="odds-tab" class="odds-tab caimao-tab clearfix" data-target="#odds-content">
    <li class="current" data-index="1">欧赔</li>
    <li data-index="2">亚赔</li>
</ul>
<article class="odds-article">
    <div id="odds-content" data-index="1" class="odds-content clearfix">
        <div>
            <ul id="chartStatiscUl" class="chartStatiscUl">
                <li class="canClick current" event-type="3" data-value="sheng">主胜</li>
                <li class="canClick" event-type="3" data-value="ping">平</li>
                <li class="canClick" event-type="3" data-value="fu">客胜</li>
            </ul>
            <div class="chartBox">
                <canvas id="europeOddCanvas"></canvas>
            </div>
            <ul class="europeOdds-tab caimao-tab clearfix" data-target="#europeOdds-content">
                <li class="current" data-index="1"><span>赔率数据</span></li>
                <li data-index="2"><span>凯利指数</span></li>
            </ul>
            <article class="europeOdds-article">
                <div id="europeOdds-content" data-index="1" class="europeOdds-content clearfix">
                    <div>
                        <table class="oddTable">
                            <tr>
                                <th>公司</th>
                                <th colspan="3">初始赔率</th>
                                <th colspan="3">即时赔率</th>
                            </tr>
                            <% if(!europeOdds || europeOdds.length == 0) {%>
                            <tr><td colspan="7">暂无数据</td></tr>
                            <% } %>
                            {{each europeOdds as item i}}
                            <tr>
                                <td style="color:{{item.color}};">{{item.compName}}</td>
                                <td>{{item.initSheng}}</td>
                                <td>{{item.initPing}}</td>
                                <td>{{item.initFu}}</td>
                                <td>{{item.nowSheng}}</td>
                                <td>{{item.nowPing}}</td>
                                <td>{{item.nowFu}}</td>
                            </tr>
                            {{/each}}
                        </table>
                    </div>
                    <div>
                        <table class="oddTable">
                            <tbody><tr><th rowspan="2">公司</th><th colspan="3">最新概率</th><th colspan="3">最新凯利指数</th><th rowspan="2">返还率</th></tr>
                            <tr><th class="noRightBorder">胜</th><th class="noRightBorder">平</th><th>负</th><th class="noRightBorder">胜</th><th class="noRightBorder">平</th><th>负</th></tr>
                            <% if(!europeOdds || europeOdds.length == 0) {%>
                            <tr><td colspan="7">暂无数据</td></tr>
                            <% } %>
                            {{each europeOdds as item i}}
                            <tr>
                                <td style="color:{{item.color}};">{{item.compName}}</td>
                                <td>{{item.shengRateStr}}</td>
                                <td>{{item.pingRateStr}}</td>
                                <td>{{item.fuRateStr}}</td>
                                <td>{{item.kailiSheng}}</td>
                                <td>{{item.kailiPing}}</td>
                                <td>{{item.kailiFu}}</td>
                                <td>{{item.returnRateStr}}</td>
                            </tr>
                            {{/each}}
                            </tbody>
                        </table>
                    </div>
                </div>
            </article>
        </div>
        <div>
            <ul class="asiaOdds-tab caimao-tab clearfix" data-target="#asiaOdds-content">
                <li class="current" data-index="1"><span>赔率数据</span></li>
                <li data-index="2"><span>凯利指数</span></li>
            </ul>
            <article class="asiaOdds-article">
                <div id="asiaOdds-content" data-index="1" class="asiaOdds-content clearfix">
                    <div>
                        <table class="oddTable">
                            <tbody><tr>
                                <th>公司</th>
                                <th colspan="3">初始赔率</th>
                                <th colspan="3">即时赔率</th>
                            </tr>
                            <% if(!asiaOdds || asiaOdds.length == 0) {%>
                            <tr><td colspan="7">暂无数据</td></tr>
                            <% } %>
                            {{each asiaOdds as item i}}
                            <tr>
                                <td style="color:{{item.color}};">{{item.compName}}</td>
                                <td>{{item.initAb}}</td>
                                <td>{{item.initBet}}</td>
                                <td>{{item.initBe}}</td>
                                <td>{{item.nowAb}}</td>
                                <td>{{item.nowBet}}</td>
                                <td>{{item.nowBe}}</td>
                            </tr>
                            {{/each}}
                            </tbody></table>
                    </div>
                    <div>
                        <table class="oddTable">
                            <tbody><tr><th rowspan="2">公司</th><th colspan="2">最新概率</th><th colspan="2">最新凯利指数</th></tr>
                            <tr><th class="noRightBorder">胜</th><th>负</th><th class="noRightBorder">胜</th><th>负</th></tr>

                            <% if(!asiaOdds || asiaOdds.length == 0) {%>
                            <tr><td colspan="7">暂无数据</td></tr>
                            <% } %>
                            {{each asiaOdds as item i}}
                            <tr>
                                <td style="color:{{item.color}};">{{item.compName}}</td>
                                <td>{{item.abRateStr}}</td>
                                <td>{{item.beRateStr}}</td>
                                <td>{{item.kailiAb}}</td>
                                <td>{{item.kailiBe}}</td>
                            </tr>
                            {{/each}}
                            </tbody></table>
                    </div>
                </div>
            </article>
        </div>
    </div>
</article>
