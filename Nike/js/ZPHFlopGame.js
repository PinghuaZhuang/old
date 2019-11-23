/**
 * Created by hodo on 2017/6/16.
 */

/**
 * 翻牌游戏的构造函数
 * 参数都可以不传, 但是不传就要设置
 * @param row           翻牌游戏的行数
 * @param col           翻牌游戏的列数
 * @param tdContent     翻牌默认显示文字
 * @returns {string}    创建失败返回提示字符串
 * @constructor
 */
function ZPHFlopGame(row, col, tdContent) {

    // 必须通过 new 来调用
    if(!(this instanceof ZPHFlopGame)) {
        console.log("ZPHFlopGame is construction");
        return "ZPHFlopGame is construction";
    }

    this._row = row? row: 3;                                // 表格的行
    this._col = col? col: 4;                                // 表格的列
    this._time = 400;                                       // 褪色延迟时长
    this._score = 0;                                        // 游戏积分
    this._timer = null;                                     // 存放计时器的 ID
    this._tdsCount = 0;                                     // 存放 tds 的剩余个数
    this._tdContent = tdContent? tdContent: "翻牌";         // td 的默认内容
    this._tdCheckedBg = "rgba(255,100,100,.8)";             // td 被选中的 background 设置值
    this._tdUnCheckedBg = "transparent";                    // td 没有被选中的 background 设置值
    this._isShowToolsDiv = true;                            // 计时器的是否开启属性

    this._outer = document.createElement("div");            // 最外面的 div
    this._inner = document.createElement("div");            // 存放 table 的 div
    this._table = document.createElement("table-prototype");          // 游戏 table
    this._toolsDiv = document.createElement("div");         // 计时器和积分的 div
    this._timeDiv = document.createElement("div");          // 计时器的 div
    this._btnDiv = document.createElement("div");           // 放置按钮的 div
    this._resetGameBtn = document.createElement("button");  // 重置游戏的 按钮
    this._newGameBtn = document.createElement("button");    // 新游戏按钮

    // 对外调用的方法
    this.append = append;                                   // 将游戏 div 加载到页面的方法
    this.setAllTdBg = setAllTdBg;                           // 设置 td 被选中的 background 值
    this.setTdCheckedBg = setTdCheckedBg;                   // 设置 td 没有被选中的 background 值

    // 全局变量
    var that = this;                                        // 存储自己的变量
    var tdNow = null;                                       // 游戏里逻辑判断用来保存点击时的 td 对象
    var tdOld = null;                                       // 游戏里逻辑判断用来保存上一次点击的 td 对象
    var flag = true;                                        // 控制选中2个后能不能继续点击

    createAll();

//=================================方法分割线=========================================================

    /**
     * 将创建好的 outer 加入到页面中
     * @param ele
     * @param index
     */
    function append(ele, index) {
        // 为每个 td 添加事件
        setOnclick();
        // 为 resetGameBtn 添加事件
        resetGame();
        // 为 newGameBtn 添加事件
        newGame();

        // 根据 this._isShowToolsDiv 来设置是否添加 toolsDiv
        if(that._isShowToolsDiv) {
            // 创建添加添加计时器
            that._toolsDiv = createToolsDiv();
            that._outer.appendChild(that._toolsDiv);
            that._timeDiv.className = "flop-time";
            that._timeDiv.innerHTML = "00:00:00";
            that._toolsDiv.appendChild(that._timeDiv);
            createTimer(that._timeDiv);
        }

        // 添加到页面中
        ele.insertBefore(that._outer, ele.children[index? index: 0]);
    }


    /**
     * 创建主体框架
     * outer, timeDiv, table, btnDiv
     */
    function createAll() {

        // 创建表格
        that._table = createTable();
        that._outer.appendChild(that._inner);
        that._inner.appendChild(that._table);
        that._outer.className = "flop";

        // 创建 newGame 和 resetGame 的 div
        that._outer.appendChild(that._btnDiv);
        that._btnDiv.appendChild(that._resetGameBtn);
        that._btnDiv.appendChild(that._newGameBtn);
        that._resetGameBtn.innerHTML = "重新开始";
        that._newGameBtn.innerHTML = "新游戏";
        that._inner.appendChild(that._btnDiv);
    }

    /**
     * 创建表格
     * @returns {Element}   返回一个表格
     */
    function createTable() {
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        for(var i = 0; i < that._row; i++) {
            tbody.insertRow(i);
            for(var j = 0; j < that._col; j++) {
                tbody.rows[i].insertCell(j);
                tbody.rows[i].cells[j].innerHTML = that._tdContent;
            }
        }
        that._tdsCount = tbody.getElementsByTagName("td").length;
        return table;
    }

    /**
     * 创建 toolsDiv
     * @returns {Element}   返回创建好的 toolsDiv
     */
    function createToolsDiv() {
//###CodeContinue...
        var toolsDiv = document.createElement("div");
        // time Div
        var timeDiv = document.createElement("div");
        // score Div
        var scoreDiv = document.createElement("div");

        toolsDiv.appendChild(timeDiv);
        toolsDiv.appendChild(scoreDiv);

        return toolsDiv;
    }

    /**
     * 为每个 td 注册单击事件
     * 主体逻辑
     */
    function setOnclick() {
        var tds = that._table.getElementsByTagName("td");
        // 创建翻牌内容数组
        var arr = new Array(tds.length);
        arr = getArrOfMathRandom(arr);

        // 翻牌游戏的主要逻辑
        for (var i=0; i<tds.length; i++) {
            // 设置标识,判断是否被点击过
            tds[i].flag = false;     // 为当前标签添加一个 flag 属性, 判断是否被点击过
            tds[i]._text = arr[i];     // 添加属性 _text 并赋值
            // 为每个 td 注册点击事件
            tds[i].onclick = function () {

                // 点击改变背景与内容
                setTdBackground.call(this);
                //if(flag) {
                    tdNow = this;
                    // 判断是否点击了标签
                    if (tdOld != null && tdOld != this) {
                        // 点击2次后, 2个标签内容是否相等
                        if (tdOld._text == this._text) {
                            //flag = true;
                            this.onclick = null;
                            tdOld.onclick = null;
                            reset.call(this, true);

                            // 记录 td 的个数
                            that._tdsCount -= 2;
                            if(that._tdsCount === 1 || that._tdsCount === 0) {
                                clearInterval(that._timer);
                            }

                        } else {
                            // 点击2次后,内容不等的时候重置
                            //flag = false;
                            this.flag = false;
                            setTimeout(function () {

                                // 判断现有的 td
                                var tds = that._table.getElementsByTagName("td");
                                if(tds.length === 0 || tds.length === 1) {
                                    clearInterval(that._timer);
                                }
                                reset(false);
                                //flag = true;
                                tdOld = null;
                                tdNow = null;
                            }, that._time);
                        }
                        tdOld = null;
                    } else {
                        if (tdOld==null) {
                            tdOld = this;
                        }
                        this.flag = true;
                    }
                    //if(this != tdOld) {
                    //    flag = true;
                    //}
                }
            }
        //}
        arr = null;
    }

    /**
     * 为 newGameBtn 注册事件
     */
    function newGame() {
        that._newGameBtn.onclick = function () {
            // 用户输出
            that._row = inputN("请输入需要创建table的行数(正整数1-8)!", "默认翻牌游戏为 3 X 4 !", 8);
            if (that._row != -1) {
                that._col = inputN("请输入需要创建table的列数(正整数1-7)!", "默认翻牌游戏为 3 X 4 !", 7);
            }
            if (that._row != -1 && that._col != -1) {
                newGameTable();
            } else {
                that._row = 3;
                that._col = 4;
                newGameTable();
            }
            // 开始新的计时
            that._timeDiv.innerHTML = "00:00:00";
            createTimer(that._timeDiv);
            that._tdsCount = that._table.getElementsByTagName("td").length;
        };
        function newGameTable() {
            // 删除表格
            that._inner.removeChild(that._table);
            // 创建表格
            that._table = createTable();
            // 注册单击事件
            setOnclick();
            // 添加表格
            that._inner.insertBefore(that._table, that._inner.children[0]);
            // 注册 resetGmaeBtn
            resetGame();
        }
    }

    /**
     * resetGameBtn 注册单击事件
     */
    function resetGame() {
        var tds = that._table.getElementsByTagName("td");
        that._resetGameBtn.onclick = function () {
            var arr = new Array(tds.length);
            arr = getArrOfMathRandom(arr);
            // 重载所有 td 的内容
            for (var i=0; i<tds.length; i++) {
                tds[i].style.backgroundColor = that._tdUnCheckedBg;
                tds[i].innerText = that._tdContent;
                tds[i].txt = arr[i];
                tds[i].flag = true;
                tds[i].style.cursor = "pointer";
                tds[i].style.opacity = "1";
            }
            // 重新为 td 注册单击事件
            setOnclick();
            arr = null;
            // 开始新计时
            that._timeDiv.innerHTML = "00:00:00";
            createTimer(that._timeDiv);
            that._tdsCount = that._table.getElementsByTagName("td").length;
        };
    }

    /**
     * 重置td标签
     * @param  {[boolean]} flag [判断需要执行的内容]
     */
    function reset(flag) {
        var tds = that._table.getElementsByTagName("td");
        if (flag) {
            // 消掉的同时设置不能触发点击事件
            this.flag = false;
            this.style.cursor = "default";
            this.style.opacity = "0";
            tdOld.style.opacity = "0";
            tdOld.style.cursor = "default";
            tdOld = null;
        } else {
            for (var i=0; i<tds.length; i++) {
                // 重置所有 td 内容
                tds[i].style.backgroundColor = that._tdUnCheckedBg;
                tds[i].innerText = that._tdContent;
            }
            // 重置点击状态
            if (tdOld != null)
                tdOld.flag = true;
            if (tdNow != null)
                tdNow.flag = true;
            tdNow = null;
            tdOld = null;
        }
    }


    /**
     * 设置 td 的背景色
     * @param str
     */
    function setTdBackground() {
        this.style.background = that._tdCheckedBg;
        this.innerText = this._text;
    }

    /**
     * 设置所有 td 默认背景色
     * @param bgcStr
     */
    function setAllTdBg(bgcStr) {
        for(var i = 0; i < tds.length; i++) {
            tds[i].style.background = bgcStr;
        }
    }

    /**
     * 设置 td 被选中的样式
     * @param bgcStr
     */
    function setTdCheckedBg(bgcStr) {
        this._tdCheckedBg = bgcStr;
    }

    /**
     * 创建计时器
     * @param ele
     */
    function createTimer(ele) {

        var h = 0, m = 0, s = 0;
        var time = 0;
        clearInterval(that._timer);
        that._timer = setInterval(function () {
            s++;
            // 判断
            if(s >= 60) {
                s = 0;
                m++;
            }
            if(m >= 60) {
                m = 0;
                h++;
            }
            if(h >= 24) {
                h = 0;
            }
            time = (h <= 9? "0" + h: h) + ":" + (m <= 9? "0" + m: m) + ":" + (s <= 9? "0" + s: s);
            ele.innerHTML = time;
        }, 1000)
    }
}


//==================================公用函数==========================================================

/**
 * 判断并获取用户输入
 * @param str1          提示框内容
 * @param str2          取消提示内容
 * @param limitMax
 * @param limitMin
 * @returns {*}
 */
function inputN(str1, str2, limitMax, limitMin) {
    var number;
    do {
        number = prompt(str1);
        if (number === null) {
            if(typeof str2 === "string") {
                alert(str2);
            }
            return -1;
        }
        number = +number;
    } while (isNaN(number) || number%1 || number<=0 || number==="" || number>limitMax || number<limitMin);
    return number;
}

/**
 * 设置随机生成 arr 数组
 * 长度为(1-arr.length), 并且每个数字只能有2个
 * 奇数的时候, 剩下一个为 笑脸
 * @param  {[array]} arr [传入并返回的数组, 要有长度]
 * @return {[array]}     [返回修改后的数组]
 */
function getArrOfMathRandom(arr) {
    var temp;
    var flag = true;
    // 如果是奇数,就把 length 加1, 末尾赋值为 Math.ceil(arr.length/2)
    if (arr.length%2!=0) {
        arr[arr.length] = Math.ceil(arr.length/2);
        flag = false;
    } else {
        arr[arr.length-1] = Math.ceil(Math.random()*(arr.length/2));
    }
    for (var i=0; i<arr.length-1; i++) {
        temp = Math.ceil(Math.random()*(Math.ceil(arr.length/2)));
        if (arr.indexOf(temp) == -1 || arr.lastIndexOf(temp) == arr.indexOf(temp)) {
            arr[i] = temp;
        } else {
            i--;
        }
    }
    // 从开头开始的第一个值为 Math.ceil(arr.length/2) 的数替换为空字符
    if (!flag) {
        arr[arr.indexOf(Math.ceil(arr.length/2))] = "(～￣▽￣)";
    }
    return arr;
}

