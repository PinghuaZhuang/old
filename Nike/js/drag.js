/**
 * Created by hodo on 2017/6/15.
 */


/**
 * 自定义拖动
 * @param ele     需要拖动的东西
 * @param sup           在哪个盒子中拖动, 默认是document  可选
 * @param fn            回调函数, 在赋值完后执行          可选
 */
function setDrag(scrollEle, sup, fn) {
    scrollEle.onmousedown = function (event) {

        clearInterval(this.timer);

        event = event || window.event;
        var pagex = getMouseXYOfScr().x;
        var pagey = getMouseXYOfScr().y;
        var x = pagex - scrollEle.offsetLeft;
        var y = pagey - scrollEle.offsetTop;

        sup.onmousemove = function (event) {

            event = event || window.event;
            var pagex = getMouseXYOfScr().x;
            var pagey = getMouseXYOfScr().y;
            var mouseX = pagex - x;
            var mouseY = pagey - y;

            if(!sup) {
                sup = document;
            }

            if(mouseX < 0) {
                mouseX = 0;
            }
            if(mouseX > sup.offsetWidth - scrollEle.offsetWidth) {
                mouseX = sup.offsetWidth - scrollEle.offsetWidth;
            }
            if(mouseY < 0) {
                mouseY = 0;
            }
            if(mouseY > sup.offsetHeight - scrollEle.offsetHeight) {
                mouseY = sup.offsetHeight - scrollEle.offsetHeight;
            }

            scrollEle.style.top = mouseY + "px";
            scrollEle.style.left = mouseX + "px";

            if(fn && typeof fn === "function") {
                fn.call(scrollEle);
            }

            clearTextSelected();
        };
    }
    document.onmouseup = function () {
        sup.onmousemove = null;
    };

}


/**
 * 清除鼠标选中的文字
 */
function clearTextSelected() {
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}

/**
 * 获取当前鼠标的位置
 * @returns {{x: (Number|*), y: (Number|*)}}
 */
function getMouseXYOfScr() {
    var pagex = event.pageX || event.clientX + Scroll().left;
    var pagey = event.pageY || event.clientY + Scroll().top;
    return {x: pagex, y: pagey};
}

/**
 * 隐藏部分 top left 值
 * @returns {{top: (Number|number), left: (Number|number)}}
 * @constructor
 */
function Scroll() {
    return {
        top: window.pageYOffset || document.documentElement.scrollTop,
        left: window.pageXOffset || document.documentElement.scrollLeft
    }
}