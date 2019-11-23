/**
 * Created by hodo on 2017/6/15.
 */


/**
 * 自定义滚动
 * @param scrollEle     滚动栏
 * @param bar           滚动条
 * @param arr{arr|ele}  滚动内容对象, 可以是数组和单对象
 */
function setSrollBar(scrollEle, bar, contentArr) {
    bar.onmousedown = function (event) {

        event = event || window.event;
        var pagey = getMouseXYOfScr().y;
        var y = pagey - bar.offsetTop;

        document.onmousemove = function (event) {

            event = event || window.event;
            var pagey = getMouseXYOfScr().y;
            var mouseY = pagey - y;

            if(mouseY < 0) {
                mouseY = 0;
            }
            if(mouseY > scrollEle.offsetHeight - bar.offsetHeight) {
                mouseY = scrollEle.offsetHeight - bar.offsetHeight;
            }

            bar.style.top = mouseY + "px";

            if(contentArr != undefined && contentArr instanceof Array) {
                setContentScroll.apply(this, contentArr);
            } else {
                setContentScroll(contentArr);
            }
            clearTextSelected();
        };
    }
    document.onmouseup = function () {
        document.onmousemove = null;
    };

    /**
     * 内容跟随移动
     * 注意: 与上面的函数必须同时使用
     * @param ele   要移动内容的函数
    // */
    function setContentScroll() {
        for(var i=0; i<arguments.length; i++) {
            var scale = (arguments[i].offsetHeight - box.clientHeight) / (scrollEle.offsetHeight - bar.offsetHeight);
            var height = scale * bar.offsetTop;
            arguments[i].style.top = -height + "px";
        }
    }
    
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

function Scroll() {
    return {
        top: window.pageYOffset || document.documentElement.scrollTop,
        left: window.pageXOffset || document.documentElement.scrollLeft
    }
}