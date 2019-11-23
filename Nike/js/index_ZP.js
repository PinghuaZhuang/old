// 全局变量
var ul = document.getElementsByClassName("navigation-bar-r")[0];
var liArr = ul.getElementsByTagName("li");
var delArr = document.getElementsByClassName("del-line");
var aArr = ul.getElementsByTagName("a");
var wraper = document.getElementsByClassName("wraper")[0];
var inner = document.getElementsByClassName("section-1-inner")[0];
var shoeArr = document.getElementsByClassName("shoe");

// 滚轮用到的变量
var sectionArr = wraper.children;
var nowSec = sectionArr[0];

// 鼠标跟随移动的全局变量
var inner = document.getElementsByClassName("section-1-inner")[0];
var innerX = parseFloat(getStyle(inner, "left"));
var innerY = parseFloat(getStyle(inner, "top"));

// 其他的一些全局变量
var navLis = ["watch", "archive", "launch", "share", "NikeSB.com"];     // 没有动态创建, 所以必须跟html的a标签个数一样

var timer = null;           // 放大缩小模糊的计时器 ID 没用到, 预留
var count = 5;              // 控制层级 section 层级
var flag = true;            // 控制导航栏的开闭
var speed = 8;              // 控制屏幕的滚动速度
var step = 35;              // 跟随移动距离
var stepRand = 2;           // 鞋子随机移动的步长, 反比例, 默认 2


// 初始化 a 标签
for(var i=0; i<aArr.length; i++) {
    aArr[i].innerHTML = navLis[i];
}
// sectionArr 添加自定义属性
for(var i=0; i<sectionArr.length; i++) {
    sectionArr[i]._index = i;
}

// 为没个a设置事件
setLiArrElement();

// 鞋子随机移动加拖动
setTimeout(function () {
    for (var i = 0; i < shoeArr.length; i++) {
        shoeArr[i]._x = parseFloat(getStyle(shoeArr[i], "left"));
        shoeArr[i]._y = parseFloat(getStyle(shoeArr[i], "top"));

        // 随机移动
        moveRand(shoeArr[i], stepRand);
        // 设置拖动特效
        setDrag(shoeArr[i], document, function () {
            // 重新注册随机移动
            moveRand.call(this, this);
        });

        // 为鞋子添加放大缩小事件
        shoeArr[i].onmouseenter = function () {
            setShoes(230, this);
        };
        shoeArr[i].onmouseleave = function () {
            setShoes(200, this);
            //moveRand.call(this, this);
        };

    }
}, 0);

// 跟随鼠标移动
inner._json = {
    // 目标值
    left: innerX,
    top: innerY
};

sectionArr[0].onmousemove = function (event) {

    var mouseX = event.pageX;
    var mouseY = event.pageY;

    if(mouseX < 0 || mouseX > getClient().width || mouseY < 0 || mouseY > getClient().height) {
        return;
    }

    var disX =  mouseX- (getClient().width / 2);
    var disY = mouseY - (getClient().height / 2);
    scaleX = disX / (getClient().width / 2);
    scaleY = disY / (getClient().height / 2);
    var json = {
        left: innerX + step * scaleX,
        top: innerY + (step - 7) * scaleY
    };
    inner.style.top = json.top + "px";
    inner.style.left = json.left + "px";
};


// 滚轮事件
window.onmousewheel = function (event) {
    if(flag) {
        flag = false;

        var topNow = nowSec.offsetHeight;
        event = event || window.event;
        // 当前元素
        var temp = null;
        // 向上滚动
        if(event.deltaY < 0) {
            temp = nowSec.previousElementSibling;
            setAnimat(topNow);
        } else {
            // 向下滚动
            temp = nowSec.nextElementSibling;
            setAnimat(-topNow);
        }

        // 设置导航显示 delLine
        if(temp && temp._index != 0) {
            // 判断并删除旧的a标签里面delLine
            clearDelLine();
            console.log(aArr[temp._index - 1], temp);
            animate(delArr[temp._index - 1], {width: aArr[temp._index - 1].data_width});
        } else {
            // 解决最后一个 delLine 会被滚掉的bug
            if(nowSec !== sectionArr[sectionArr.length - 1]) {
                clearDelLine();
            }
        }
    }

    /**
     * 滚动页面
     */
    function setAnimat(topNow) {
        if(temp) {
            temp.style.zIndex = ++count;
            nowSec.style.zIndex = ++count;
            animate(nowSec, {top: topNow}, function () {
                temp.style.zIndex = ++count;
                nowSec.style.top = 0;
                nowSec = temp;
                flag = true;
            }, speed);
        } else {
            flag = true;
        }
    }
};

// 设置页面模糊和放大缩小
var dim = true;
if(flag) {
    setDim();
}


// 小彩蛋
var share = aArr[3];
share.ondblclick = function () {
    // 添加 mask 遮罩层
    var mask = document.createElement("div");
    mask.className = "mask";
    document.body.appendChild(mask);
    // 添加关闭按钮
    var close = document.createElement("span");
    close.innerHTML = "×";
    close.className = "spanClose";
    mask.appendChild(close);

    flag = false;

    // 添加游戏
    var game = new ZPHFlopGame(3, 4);
    game.append(mask);

    // 关闭按钮事件
    close.onclick = function () {
        mask.style.opacity = "0";
        setTimeout(function () {
            mask.style.display = "none";
            flag = true;
        }, 1000);
    };
};


//=====================================函数分割线================================

/**
 * 页面模糊和放大缩小
 */
function setDim() {

    sectionArr[0].style.filter = dim? "": "blur(1px)";

    var rand = Math.random() * 1000 * 3;
    var after = dim? 8000 + rand: 1300;

    dim = !dim;

    setTimeout(function () {
        setDim();
    }, after);
}

/**
 * aArr 排他
 */
function clearDelLine() {
    for (var i=0; i < aArr.length; i++) {
        animate(delArr[i], {width: 0}, null, 30);
        aArr[i].data_flag = true;
    }
}

/**
 * 为每一个 a 标签设置单击事件
 */
function setLiArrElement() {
    for (var i=0; i < aArr.length; i++) {
        // 设置自定义属性
        aArr[i].data_name = navLis[i];
        aArr[i].data_index = i;
        aArr[i].data_flag = true;
        aArr[i].data_width = parseFloat(getStyle(liArr[i], "width"));

        // 鼠标悬停
        aArr[i].onmouseover = function () {
            animate(delArr[this.data_index], {width: this.data_width});
        };

        // 鼠标移出事件
        aArr[i].onmouseout = function (event) {
            if(this.data_flag) {
                animate(delArr[this.data_index], {width: 0});
            }
        };

        // 鼠标点击事件
        aArr[i].onclick = function () {
            if(flag) {

                flag = false;
                var that = this;
                // 判断并删除旧的a标签里面delLine
                clearDelLine();
                // 重新设置宽度
                animate(delArr[this.data_index], {width: this.data_width});

                // 设置点击状态
                this.data_flag = false;

                if(this.data_index <= 2 && nowSec != sectionArr[this.data_index + 1]) {

                    // 跳转部分
                    var l = nowSec.offsetWidth;
                    // 改变层次
                    sectionArr[that.data_index + 1].style.zIndex = ++count;
                    nowSec.style.zIndex = ++count;
                    if(nowSec._index - 1 < that.data_index) {
                        // 向右
                        setAnimat(that, {left: -l});
                    } else {
                        // 向左
                        setAnimat(that, {left: l});
                    }

                } else {
                    flag = true;
                }

            }

        };
    }

    // 内部封装, 减少代码量而已
    function setAnimat(ele, json) {
        animate(nowSec, json, function () {
            sectionArr[ele.data_index + 1].style.zIndex = ++count;
            flag = true;
            nowSec.style.left = 0;
            nowSec = sectionArr[ele.data_index + 1];
        }, speed)
    }

}


/**
 * 鞋子放大缩小
 * @param str
 */
function setShoes(str, ele) {
    if(!ele) {
        for(var i=0; i<shoeArr.length; i++) {
            animate(shoeArr[i], {width: str, height: str}, function () {
                for(var i=0; i<shoeArr.length; i++) {
                    moveRand(shoeArr[i]);
                }
            });
        }
    } else {
        animate(ele, {width: str, height: str}, function () {
            moveRand(ele);
        });
    }
}


