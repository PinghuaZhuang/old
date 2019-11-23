/**
 * Created by hodo on 2017/6/13.
 */

/**
 * 缓动动画
 * @param ele   触发对象
 * @param json  json数据
 * @param fu    回调函数
 * @param num   步长比例
 */
function animate(ele, json, fu, num) {
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {
        // 判断是否全部执行完成
        var flag = true;
        if(num === undefined) {
            // 步长比例
            num = 10;
        }
        for(var key in json) {
            if(key === "z-index") {
                ele.style.zIndex = json[key];
            } else if(key === "opacity") {

                // 放大倍数
                var scale = 10;

                // 对opacity判断
                if (getStyle(ele, key) == 0) {
                    var leader = 0;
                } else {
                    var leader = parseInt(getStyle(ele, key)*scale) || scale;
                }
                var step = (parseInt(json[key]*scale) - leader) / num;
                step = step>0? Math.ceil(step): Math.floor(step);
                leader += step;

                ele.style[key] = leader/scale;    // 有是单位问题, opacity是没有单位的
                ele.style.filter = "alpha(opacity= "+ leader*(100/scale) +")";
                if(json[key] != leader/scale) {
                    flag = false;
                }

            } else {
                var leader = parseInt(getStyle(ele, key));
                var step = (json[key] - leader) / num;
                step = step>0? Math.ceil(step): Math.floor(step);
                leader += step;
                ele.style[key] = leader + "px";
                // 解决抖动问题!!
                if (Math.abs(parseFloat(json[key]) - parseFloat(ele.style[key])) < 1) {
                    leader = json[key];
                }
                if(leader != json[key]) {
                    flag = false;
                }
            }
        }
        // 完成清除计时器
        if(flag) {
            clearInterval(ele.timer);
            if(fu instanceof Function) {
                fu();
            }
        }
    }, 30);
}

/**
 * 随机匀速缓慢移动
 * @param ele 需要缓动的目标
 */
function moveRand(ele, stepRand) {

    if(!stepRand || stepRand == 0) {
        stepRand = 2;
    }

    //var tempFlag = true;

    var flag1 = 1;
    var flag2 = 1;
    var count = 0;
    var count_Max = Math.ceil(Math.random()*200);
    var leaderX = ele.offsetLeft;
    var leaderY = ele.offsetTop;

    //if(leaderX > getClient().width - 260 || leaderY > getClient().height - 260 || leaderX < 0 || leaderY < 0) {
    //    flag1 = !flag1, flag2 = !flag2;
    //    tempFlag = false;
    //}

    clearInterval(ele.timer);
    ele.timer = setInterval(function() {
        if(/*tempFlag && */++count > count_Max) {
            count = 0;
            if(Math.random() > 0.5) {
                flag1 = -flag1;
            }
            if(Math.random() > 0.5) {
                flag2 = -flag2;
            }
        }/* else {
            tempFlag = true;
        }*/
        var rand1 = Math.ceil(Math.random()*10)/100/stepRand;
        var rand2 = Math.ceil(Math.random()*10)/100/stepRand;
        leaderX += flag1 * rand1;
        leaderY += flag2 * rand2;
        ele.style.left = leaderX + "px";
        ele.style.top = leaderY + "px";
    }, 10);
}


/**
 * 匀速移动
 * @param ele     需要移动的元素
 * @param target  移动目标距离距离(按照左上角来计算)
 */
function move (ele, target, attr, fn) {
    var sum = ele.offsetLeft;
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {
        var step = target>ele.style[attr]? 0.1: -0.1;
        sum += step;
        ele.style[attr] = sum + "px";
        // 判断是否距离小于步长
        if (Math.abs(target - sum) <= Math.abs(step)) {
            ele.style[attr] = target + "px";
            if(fn && typeof fn === "function") {
                fn();
            }
            clearInterval(ele.timer);
        }
    }, 10);
}


/**
 * 获取元素, 最高权限
 * @param ele
 * @param attr
 * @returns {*}
 */
function getStyle(ele, attr) {
    if(window.getComputedStyle && typeof window.getComputedStyle === "function") {
        return window.getComputedStyle(ele, null)[attr];
    } else {
        return ele.currentStyle[attr];
    }
}