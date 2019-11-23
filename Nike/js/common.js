/**
 * Created by hodo on 2017/5/10
 */

function test(parameter) {
    console.log("this is test. ==== ", parameter? parameter: "none...");
}

/**
 * 获取元素简单封装
 * @param id
 * @returns {Element}
 */
//function $(str){
//    var char = str.charAt(0);
//    if(char === "#"){
//        return document.getElementById(str.slice(1));
//    }else if(char === "."){
//        return document.getElementsByClassName(str.slice(1));
//    }else{
//        return document.getElementsByTagName(str);
//    }
//}

/**
 * 单个修改背景色
 * @param ele
 */
function setColorRand(ele) {
    var rand = Math.floor(Math.random() * colorRand.length);
    ele.style.backgroundColor = colorRand[rand];
}


/**
 * 清除鼠标选中的文字状态
 */
function clearTextSelected() {
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}

/**
 * 获取当前鼠标的位置
 * @returns {{x: (Number|*), y: (Number|*)}}
 */
function getMouseXYOfClient(event) {
    var pagex = event.pageX || event.clientX + scroll().left;
    var pagey = event.pageY || event.clientY + scroll().top;
    return {x: pagex, y: pagey};
}

/**
 * 获取被减去部分的尺寸
 * @returns {{top: (Number|number), left: (Number|number)}}
 */
function getScroll() {
    return {
        top: window.pageYOffset || document.documentElement.scrollTop,
        left: window.pageXOffset || document.documentElement.scrollLeft
    }
}

/**
 * 获取流量器的宽高
 * @returns {obj}
 */
function getClient() {
    if(window.innerWidth !== undefined) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    } else if(document.compatMode === "CSS1Compat") {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    } else if(document.compatMode === "backCompat") {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    }
}

/**
 * 获取鼠标在屏幕所处的位置
 */
function getMousePlackOfSrc(event) {
    // 获取当前鼠标坐标
    event = event || window.event;

    var pagex = event.pageX || event.clientX + scroll().left;
    var pagey = event.pageY || event.clientY + scroll().top;
    //return {x: pagex, y: pagey};

    var point = {x: pagex, y: pagey};

    var centerX = window.screen.width / 2;
    var centerY = window.screen.height / 2;

    if(point.x < centerX && point.y < centerY) {
        return 1;
    } else if(point.x > centerX && point.y < centerY) {
        return 2;
    } else if(point.x < centerX && point.y > centerY) {
        return 3;
    } else {
        return 4;
    }
}

/**
 * 设置复数元素的display为block;
 */
function show() {
    for(var i=0; i<arguments.length; i++) {
        arguments[i].style.display = "block";
    }
}
/**
 * 设置复数元素的display为hide;
 */
function hide() {
    for(var i=0; i<arguments.length; i++) {
        arguments[i].style.display = "none";
    }
}


/**
 * 兼容,写一个函数获取某一个元素里面的文本的。
 * @param ele   要获取的对象
 * @returns {string}
 */
function getText(ele){
  if(typeof ele.textContent  == "string"){
    return ele.textContent;
  }else {
    return ele.innerText;
  }
}


/**
 * 兼容写法,设置某一个元素里面的文本
 * @param ele       要设置的元素
 * @param text      要设置的内容
 */
function setText(ele,text){
  if(typeof ele.textContent  == "string"){
    ele.textContent = text;
  }else {
    ele.innerText = text;
  }
}


/**
 * 找第一个子元素节点，做兼容
 * @param ele   父元素
 * @returns {Element} 第一个子元素
 */
function getFirstChildElement(ele){
  if(ele.firstElementChild){
    return ele.firstElementChild;
  }else {
    var node = ele.firstChild;
    while(node.nodeType != 1){
      node= node.nextSibling;
    }
    return node;
  }
}


/**
 * 找最后一个子元素节点，做兼容
 * @param ele   父元素
 * @returns {Element} 最后一个子元素
 */
function getLastChildElement(ele){
  if(ele.lastElementChild){
    return ele.lastElementChild;
  }else {
    var node = ele.lastChild;
    while(node.nodeType != 1){
      node = node.previousSibling;
    }
    return node;
  }
}



/**
 * 要得到下一个元素节点，做兼容。
 * @param ele       当前元素
 * @returns {Element} 下一个兄弟节点
 */
function getNextElement(ele){
  if(ele.nextElementSibling){
    return ele.nextElementSibling;
  }else {
    var node = ele.nextSibling;
    while(node.nodeType != 1){
      node = node.nextSibling
    }
    return node;
  }
}


/**
 * 上一个元素节点，做兼容
 * @param ele       当前元素
 * @returns {Element}     上一个兄弟节点
 */
function getPreviousElement(ele){
  if(ele.previousElementSibling){
    return ele.previousElementSibling;
  }else{
    var node = ele.previousSibling;
    while(node.nodeType != 1){
      node = node.previousSibling
    }
    return node;
  }
}

/**
 * 添加事件, 兼容写法
 * @param ele   事件源
 * @param eve   事件名, 没有 on 的字符串
 * @param fn    事件函数
 */
function addEvent(ele, eve, fn) {
    if(ele.addEventListener && typeof ele.addEventListener === "function") {
        ele.addEventListener(eve, fn);
    } else if(ele.attachEvent && typeof ele.addEventListener === "function") {
        ele.attachEvent("on" + eve, fn);
    } else {
        ele["on" + eve] = fn;
    }
}
/**
 * 删除事件, 兼容写法
 * @param ele
 * @param eve
 * @param fn
 */
function removeEvent(ele, eve, fn) {
    if(ele.removeEventListener && typeof ele.removeEventListener === "function") {
        ele.removeEventListener(eve, fn);
    } else if(ele.detachEvent && typeof ele.detachEvent() === "function") {
        ele.attachEvent("on" + eve, fn);
    } else {
        ele["on" + eve] = null;
    }
}
