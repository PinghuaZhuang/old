/**
 * Created by hodo on 2017/7/31.
 */

// 配置信息
var config = {
    data: [],                                                                       // 保存模拟读取本地的文件资料
    listMax: 100,                                                                   // 暂留
    url: "./music/",                                                                // 默认路径 (我无法获取本地文件路径, 所以写死)
    // 如果打不开就修改这的路径
    ROOT_RUL: "http://192.168.66.57/97-phpCase/01-/local-music-player/",            // 模拟读取本地文件的路径
    DATA_RUL: "data/songData.json",
    supportType: ["audio/mp3", "mp3", "mp4"]                                        // 设定支持的歌曲格式
};

// 需要用到的一些 dom 元素
var doms = {
    inp: document.createElement("input")                                            // 用来模拟添加 file 点击添加本地文件
};

// 警告信息
var _Warn = {
    noList: "当前播放器没有该列表!",
    noSong: "当前列表没有歌曲!",
    index: "索引输入错误 或者 超出索引范围!",
    songType: "歌曲格式不正确!",
    loadQuick: "亲, 不要按的太快, play()被load()中断",
    valueOfNone: "输入内容为空, 重新输入",
    curListIndex: "curListIndex Error!",
    curIndex: "curIndex Error!",
    noSearch: "当前播放列表没有查找到"
};

// 报错信息
var _Error = {
    noList: "noCurList!",
    noSong: "noCurSong!",
    noAudio: "don't have list!",
    noContain: "don't have contain"
};

// 提示
var _Tip = {
    cache: "文件未全部下载完, 稍等~~"
};