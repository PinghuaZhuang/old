/**
 * Created by hodo on 2017/6/15.
 */


/**
 * �Զ������
 * @param scrollEle     ������
 * @param bar           ������
 * @param arr{arr|ele}  �������ݶ���, ����������͵�����
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
     * ���ݸ����ƶ�
     * ע��: ������ĺ�������ͬʱʹ��
     * @param ele   Ҫ�ƶ����ݵĺ���
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
 * ������ѡ�е�����
 */
function clearTextSelected() {
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}

/**
 * ��ȡ��ǰ����λ��
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