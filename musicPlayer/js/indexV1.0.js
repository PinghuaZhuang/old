/**
 * Created by hodo on 2017/7/29.
 */


var config = {
    type: "audio/mp3",
    data: [],
    listMax: 100,
    url: "./music/",
    //ROOT_RUL: "./data/songData.json",
    ROOT_RUL: "http://127.0.0.1/97-phpCase/00-songList//data/songData.json"
};

(function (w, callback) {

    // 自己写的对象都继承的原型
    var zpObj = new function Zp() {
        this.toString = function () {
            return this.name ? "[" + this.name + " " + this.constructor.name + "]" : "[" + typeof this + " " + this.constructor.name + "]";
        };
    };
    Object.defineProperty(w, "zpObj", {
        value: zpObj,
        writable: false
    });

    Function.prototype.inheritForObj = function (obj) {
        var tp = Object.create(obj);
        tp.constructor = this;
        this.prototype = tp;
    };
    Function.prototype.inherit = function (sup) {
        this.inheritForObj(sup.prototype);
    };



    // HTMLAudioElement HTMLElement

    HTMLElement.prototype.zpClick = function (callback, obj) {
        this.addEventListener("click", callback.bind(obj));
        return this;
    };




    // 缓存
    function createCache() {
        var keys = [];

        function cache(key, value) {
            if(value) {
                if(keys.push(key + " ") > 10) {
                    delete cache[keys.shift()];
                }
                return cache[key + " "] = value;
            }
            return cache[key + " "];
        }
        return cache;
    }
    window.cache = createCache();


    // 获取歌曲数据

}(window, function (w) {

    // 单个歌曲对象
    function Song(obj) {
        this.name = obj.name;               // 歌曲名
        this.size = obj.size;               // 歌曲大小
        this.curTime = 0;                   // 当前播放时间
        this.lyric = obj.lyric;             // 歌词
        this.singer = obj.singer;           // 歌手
        this.path = obj.path + obj.name;    // 路径
    }
    Song.inheritForObj(w.zpObj);

    // 所有歌曲默认格式
    Song.prototype.type = config.type;

    // 播放器对象
    function Player(name, theme) {
        this.name = name;           // 播放器的名字
        this.theme = theme;         // 主题
        this.lists = [];            // 歌单列表

        // 歌曲列表长度
        Object.defineProperties(this, {
            count: {
                get: function () {
                    return this.lists.length;
                },
                set: function (val) {},
                enumerable: true
            }
        });

        // 歌单的构造函数
        this.MySongList = MySongList;
        var sp = new SongList_pro(name);
        function MySongList(_name) {
            SongList.call(this, _name);
        }
        this.MySongList.inheritForObj(sp);
        this.MySongList._name = name + "List";

    }

    // 为Player添加方法
    ;(function (Player) {
        Player.inheritForObj(w.zpObj);
        Player.prototype.zpConsole = function (val, index) {
            console.log(new Date().toLocaleTimeString() + ": " + this.toString() + " " + val + "(" + index + ")");
        };
        // 创建单个歌单方法
        Player.prototype.addList = function (_name, list) {
            var tpList = new this.MySongList(_name);
            this.lists.push(tpList);
            if(list) {
                tpList.songList = list;
            }
            return tpList;
        };

        // 更新歌曲数据
        Player.prototype.updataList = function (ele, obj) {
            if(this.lists.indexOf(ele)) {
                return;
            }
            ele.forEach(function (ele, index) {

            });
            return this.lists;
        };
    }(Player));


    // list 原型
    function SongList_pro(name) {
        this.Player = name;
    }

    // 为 SongList_pro 添加原型方法
    (function (SongList_pro) {
        SongList_pro.inheritForObj(w.zpObj);
        SongList_pro.prototype.toString = function () {
            //console.log("88888888888");
            return "[" + this.name + " " + this.constructor._name + "]";
        };
        SongList_pro.prototype.valueOf = function () {
            console.log(this.toString());
            return Object.prototype.valueOf.call(this);
        };

        // 根据数组添加歌曲
        SongList_pro.prototype.createSongs = function (dataArr, callback) {
            var list = [];
            dataArr.forEach(function (ele, index) {
                if(callback && typeof callback === "function") {
                    list.push(callback.call(this, ele, index));
                    return list;
                }
                list.push(new Song(ele));
            }, this);
            return list;
        };

        // 添加歌曲
        SongList_pro.prototype.addSong = function (song) {
            this.songList.push(song);
        };

        // 删除歌曲
        SongList_pro.prototype.delSong = function (song) {
            var index = this.songList.indexOf(song);
            w.cache(this.Player + index, this.songList.splice(index, 1));
        };

        // 查询歌曲
        SongList_pro.prototype.search = function (key, value) {
            return this.songList.filter(function (ele) {
                return ele[key] === value;
            });
        };
        SongList_pro.prototype.searchForName = function (name) {
            this.search("name", name);
        };
        SongList_pro.prototype.searchForSinger = function (singer) {
            this.search("singer", singer);
        };
    }(SongList_pro));

    // list 公用的构造器
    function SongList(name) {
        this.name = name;           // 歌曲列表名字
        this.songList = [];

        Object.defineProperties(this, {
            count: {
                get: function () {
                    return this.songList.length;
                },
                set: function (val) {},
                enumerable: true
            }
        });
    }




    // 获取 audio 标签
    var audio = doms.audio;

    // 创建播放器对象
    audio.player = new Player("kuGou");         // 酷狗音乐播放器
    audio.player.addList("myLoves", SongList_pro.prototype.createSongs(w.config.data));     // 默认列表
    audio.player.addList("001", SongList_pro.prototype.createSongs(w.config.data));         // 测试用列表

    // 为音乐标签添加原型方法和属性
    (function (HTMLAudioElement) {
        var curIndex = 0, curListIndex = 0, countSong = this.player.count;

        var p = HTMLAudioElement.prototype;

        Object.defineProperties(p, {
            curListIndex: {
                get: function () {
                    return curListIndex;
                },
                set: function (val) {
                    var count = this.player.count;
                    if(val < 0 || val > count) {
                        console.log("歌曲列表索引超出范围!");
                        throw "Index Error";
                        return -1;
                    }
                    console.log(val);
                    curListIndex = val;

                    // 切换的时候暂停播放
                    this.pause();
                }
            },
            curIndex: {
                get: function () {
                    return curIndex;
                },
                set: function (val) {
                    if(val < 0 || val >= this.player.lists[curListIndex].count) {
                        console.log("歌曲索引超出范围!");
                        return;
                    }
                    curIndex = val;

                    // 播放该索引的歌曲
                    this.src = this.player.lists[curListIndex].songList[curIndex].path;
                    // 修改当前播放进度
                    this.currentTime = this.getCurSong().curTime;
                    // 重新加载
                    this.load();

                }
            },

            // 添加播放当前, 其他暂停的方法
            curPlay: function () {
// ### CodeContinue...
            }
        });

        // 获取当前播放的歌曲
        p.getCurSong = function () {
            try {
                var res = this.player.lists[curListIndex].songList[curIndex];
                if(res) {
                    return res;
                } else {
                    throw "noSong";
                }
            } catch(e) {
                audio.setAttribute("src", "");
                switch (e) {
                    case "noSong":
                        return "当前列表 没有歌曲!";
                }
                return "当前 没有列表!";
            }
        };
        // 获取当前播放的歌曲列表
        p.getCurList = function () {
            return this.player.lists[this.curListIndex];
        };
        // 切换歌单
        p.toggleList = toggleList;

        // 重写 play() 方法
        resetFn("play");

        // 重写 load() 方法
        resetFn("load");

        // 重写 pasuse() 方法
        resetFn("pause");

        function resetFn(val) {
            var tp = HTMLAudioElement.prototype[val];
            HTMLAudioElement.prototype[val] = function () {
                this.player.zpConsole(val, this.curIndex);
                switch (val){
                    case "pause":
                        this.getCurSong().curTime = this.currentTime;
                        break;
                    case "load":
                        this.src = this.getCurSong().path;
                        break;
                }
                tp.call(audio);
            };
        }

    }.call(audio, HTMLAudioElement));

    // 上下一曲的点击事件
    doms.next.addEventListener("click", nextSong.bind(audio));
    doms.prev.addEventListener("click", prevSong.bind(audio));

    // next 函数
    function nextSong() {
        // 保存当前播放进度
        this.getCurSong().curTime = this.currentTime;
        audio.curIndex++;
        console.log(audio.getCurSong().toString());
    }
    // prev 函数
    function prevSong() {
        // 保存当前播放进度
        this.getCurSong().curTime = this.currentTime;
        audio.curIndex--;
        console.log(audio.getCurSong().toString());
    }


    // 添加歌曲列表事件
    doms.addList.addEventListener("click", addList.bind(audio.player));

    // 添加歌曲事件
    doms.addSong.addEventListener("click", addSong.bind(audio.player));

    // 删除当前列表
    doms.delList.addEventListener("click", delList.bind(audio.player));

    // 显示当前所有歌单事件
    doms.showAllList.addEventListener("click", showAllList.bind(audio.player));

    // 显示当前的歌曲列表事件
    doms.showList.addEventListener("click", getCurList.bind(audio.player));

    // 切换歌单
    doms.toggleList.addEventListener("click", toggleList.bind(audio));

    // 添加歌曲列表
    function addList() {
        var name = prompt("输入列表名");
        if(!name) {
            return;
        }

        // 打印日志
        this.zpConsole("addList", 1);
        console.log(this.addList(name));
    }

    // 添加歌曲
    function addSong() {
        // 创建 input 标签
        doms.inp.type = "file";
        doms.inp.setAttribute("multiple", true);
        doms.inp.click();

        // 获取歌曲
        doms.inp.onchange = function () {
            var
                files = Array.from(doms.inp.files),
                list = SongList_pro.prototype.createSongs.call(this, files, function (ele, index) {
                    var song = new Song({
                        name: ele.name,
                        size: ele.size,
                        path: config.url,
                        // 添加歌手
                        singer: ele.name.split(" - ")[0]
                    });
                    this.lists[audio.curListIndex].addSong(song);
                    return song;
                });

            // 打印日志
            this.zpConsole("addSongs", list.length);
            console.log(list);

            // 重载
            audio.load();

        }.bind(this);

    }

    // 显示当前所有的歌曲列表
    function showAllList() {
        console.table(this.lists);
    }

    // 显示当前的歌曲列表
    function getCurList() {
        //console.log(audio.getCurList());
        console.table(audio.getCurList().songList);
    }

    // 切换列表
    function toggleList(listIndex) {
        listIndex = prompt("输入列表索引值");
        if(listIndex == null || isNaN(listIndex)) {
            console.log("输入的索引有错, 请输入大于0的数字!");
            return this.getCurList();
        }
        try {
            this.curListIndex = listIndex;
        } catch(e) {
            return this.getCurList();
        }
        switch (this.getCurList().songList.length) {
            case 0:
                return this.getCurList();
            default:
                console.table(this.getCurList().songList);
                this.load();
        }
        return this.getCurList();
    }

    // 删除当前列表
    function delList() {
        var lists = this.lists;
        if(!lists.length) {
            console.log("歌曲列表已经清空了");
            return;
        }

        var list = lists.splice(lists.indexOf(lists[audio.curListIndex]), 1);

        // 打印日志
        console.log(new Date().toLocaleTimeString() + ": " + this.toString() + " delCurList(" + 1 + ")");
        console.log(list);

        // 重新加载
        audio.load();
        console.log(audio.getCurSong().toString());
    }

    // 编辑列表
    function editList() {
// ### CodeContinue...
    }







    // 初始化
    console.log(audio.getCurSong().toString());


    // 创建网易播放器(测试用)
    var wangYi = new Player("wangYi");

    // 测试
    //console.log(audio.player.lists[0]);
    //wangYi.addList("wYLove", SongList_pro.prototype.createSongs(w.config.data));
    //console.log(wangYi.lists[0]);

}));

















