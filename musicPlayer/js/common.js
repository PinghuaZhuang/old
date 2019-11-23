/**
 * Created by hodo on 2017/7/31.
 */



/**
 * 缓存
 * detail: 缓存是有大小的, 之后改吧
 * @returns {cache}
 */
function createCache() {
    var size = 0;
    var keys = [];

    function cache(key, value) {
        if(value) {
            size += value.size;
            keys.push(key + " ");
            while(size > 130000000) {
                var tp = keys.shift();
                size -= cache[tp].size;
                delete cache[tp];
            }
            return cache[key + " "] = value;
        }
        return cache[key + " "];
    }

    cache.getSize = function () {
        return size;
    };
    cache.getKeys = function () {
        return keys;
    };

    return cache;
}


/**
 * 获取本地 歌曲列表信息
 * @param url
 */
function getAjax(url, callback, w) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(null);

    xhr.onload = function (data) {
        config.data = JSON.parse(data.currentTarget.responseText);
        callback(data, w);
    };
    xhr.onerror = function () {
        console.log("%c请放在服务器中打开, 利用了ajax模拟读取本地数据!", "font-weight: 700; font-size: 22px; color: red;");
        console.log("%c路径错误修改 js 中的config中的路径, 把 '/97-phpCase' 删除掉", "font-weight: 700; font-size: 22px; color: red;");
    };
}

/**
 * 保存文件
 * @param filename  文件名
 * @param content   内容
 * @param type      文件类型
 */


function downloadFile(filename, content, type) {
    type = type || "text/plain";
    var blob = new Blob([content], {type: "text/plain"});
    var url = window.URL.createObjectURL(blob);

    // 模拟点击
    var a = document.createElement("a");
    $(a).attr({
        download: filename,
        href: url
    }).click(function () {
        window.setTimeout(function() {
            // 释放 blob 对象
            window.URL.revokeObjectURL(url);
        }, 0)
    });
    a.click();
}