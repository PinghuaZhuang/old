/**
 * Created by hodo on 2017/7/31.
 */


// 模拟读取本地用户的歌曲列表
;(function (w, callback, undefined) {

    // 自己写的对象都继承的原型 (不包括函数对象)
    var zp = new function Zp() {
        this.toString = function () {
            return this._name ? "[" + this._name + " " + this.constructor.name + "]" : "[" + typeof this + " " + this.constructor._name + "]";
        };
    };
    Object.defineProperty(w, "zp", {
        value: zp,
        writable: false
    });

    // 修改添加函数对象原型方法
    Function.prototype.setPrototype = function (obj, option) {
        var tp = null;

        switch (typeof obj) {
            case "function":
                inheritForObj.call(this, obj.prototype);
                break;
            case "object":
                inheritForObj.call(this, obj);
                break;
            default: return;
        }

        if(option != null) {
            for(var key in option) {
                tp[key] = option[key];
            }
        }

        function inheritForObj(obj) {
            tp = Object.create(obj);
            tp.constructor = this;
            this.prototype = tp;
        }
        return tp;
    };


    // 封装点击事件
    HTMLElement.prototype.zpClick = function (callback, obj) {
        obj = obj || w;
        this.addEventListener("click", callback.bind(obj));
        return this;
    };

    // 在window下添加缓存
    w.cache = createCache();

    // 获取本地歌曲列表 (默认的歌曲列表, 测试用)
    getAjax(config.ROOT_RUL, callback);

}(window, function(data, w) {

    /**
     * 歌曲的构造函数
     * @param option    // 配置信息
     * @constructor
     */
    function Song(option) {
        this._name = option.name;                   // 歌名
        this.size = option.size;                    // 歌曲大小
        this.type = option.type || config.songType; // 歌曲类型
        this.lyric = option.lyric || "none";        // 歌词
        this.singer = option.name.split(" - ")[0];  // 歌手
        this.curTime = 0;                           // 播放进度
        this.path = option.path;                    // 歌曲路径 (写死了)
    }
    Song.setPrototype(w.zp, {
        supportType: [config.songType, "mp3", "mp4"]
    });


    /**
     * 播放器构造函数
     * @param id        // 获取元素的 id (必须是id)
     * @param theme     // 主题 (暂留)
     * @constructor
     */
    function Player(id, theme) {
        this.init(id, theme);

        /**
         * 歌单的构造函数
         * @param option
         * @constructor
         */
        Object.defineProperties(this, {
            sp: {
                value: new ListSup({ name: id, player: this }),
                writable: false,
                enumerable: false
            },
            List: {
                value: function List(option) {
                    this.init(option);
                },
                writable: false,
                enumerable: false
            }
        });
        this.List.setPrototype(this.sp, {
            init: function (option) {
                if(option == null) {
                    return;
                }
                this._name = option.name;
                this.constructor.player = this.__proto__._name;
                this.songs = [];
                this.keys = [];
            }
        });

        // 第一次加载 (模拟读取本地文件)
        this._addList("myLove", config.data);
        this.audio.getCurList();
        this.audio.load();
    }
    Player.setPrototype(w.zp, {
        init: function (id, theme) {
            this._name = id;
            this.contain = document.getElementById(id);
            this.audio = this.contain.querySelector("audio");
            this.audio.player = this;
            this.theme = theme || "defalut";
            this.lists = [];
            this.count = 0;

            this.events = ["addList", "addSongs", "delList", "showAllList", "showList", "toggleList"];

            // 元素标签
            this.prev = this.contain.querySelectorAll("button[data-target='prev']");
            this.next = this.contain.querySelectorAll("button[data-target='next']");

            this.events.forEach(function (ele) {
                this[ele] = this.contain.querySelector("button[data-target='" + ele + "']");
            }, this);

            this.searchSong = this.contain.querySelector("input[data-target='searchSong']");
        },
        // 打印
        zpConsole: function (val, index) {
            console.log(new Date().toLocaleTimeString() + ": " + this.toString() + " " + val + "(" + index + ")");
        },
        // 创建并添加歌单
        _addList: function (name, data) {
            var list = new this.List({ name: name });
            this.count = this.lists.push(list);
            if(data) {
                data.forEach(function (ele) {
                    var flag = Song.prototype.supportType.some(function (type) {
                        return ele.type == type;
                    });
                    if(!flag) {
                        console.log("歌曲格式不正确!", ele.name, ele.type);
                        return;
                    }
                    this.keys.push(ele.name);
                    var song = new Song({
                        name: ele.name,
                        size: ele.size,
                        singer: ele.singer,
                        path: ele.path + ele.name,
                        lyric: ele.lyric
                    });
                    list.songs.push(song);
                    w.cache(song._name, song);
                }, this.lists[this.audio.curListIndex]);
            }
            return list;
        },
        // 根据 files 来添加 歌曲
        _addSongs: function (files) {
            var list = this.audio.player.lists[this.audio.curListIndex];
            var count = 0, len = files.length;
            files.forEach(function (ele, index, arr) {
                var reader = new FileReader();
                reader.readAsDataURL(ele);
                //console.log(reader);
                reader.onload = function (e) {
                    var flag = Song.prototype.supportType.some(function (type) {
                        return ele.type == type;
                    });
                    if(!flag) {
                        console.log("歌曲格式不正确!", ele.name, ele.type);
                        return;
                    }
                    var song = new Song({
                        name: ele.name,
                        size: ele.size,
                        path: e.target.result
                    });
                    list.songs.push(song);
                    w.cache(song._name, song);
                };

                // 打印
                reader.onloadend = function () {
                    if(++count == len) {
                        this.audio.load();
                        console.table(list.songs);
                    }
                }.bind(this);
            }, this);
            return list;
        },
        // 根据 歌名, 歌手, 索引查找
        _searchSong: function (value, key) {
            key = key || "_name";
            if(isNaN(value)) {
                var reg = new RegExp(value);
                return this.audio.getCurList(true).songs.filter(function (ele) {
                    return reg.test(ele[key]);
                });
            } else {
                return this.lists[value];
            }
        },
        // 获取key
        _getCurKey: function () {
            return this.audio.getCurList(true).keys[this.audio.curIndex];
        }
    });

    /**
     * 歌曲列表原型
     * @param option
     * @constructor
     */
    function ListSup(option) {
        this.init(option);
    }
    ListSup.setPrototype(w.zp, {
        init: function (option) {
            if(option == null) {
                return;
            }
            this._name = option.name + "List";
            this.player = option.player;
        },
        toString: function () {
            return "[" + this._name + " " + this.constructor.player + "]"
        }
    });




    var audio = doms.audio;

    // 为input添加回车事件
    var inps = document.querySelectorAll("input[data-target]");
    inps.forEach(function (ele) {
        ele.onkeydown = function (e) {
            switch (e.keyCode) {
                case 13:
                    this.blur();
                    break;
            }
        };
    });
    inps = null;

    // 为音乐标签添加原型方法和属性
    ;(function (HTMLAudioElement) {
        var curIndex = 0, curListIndex = 0;
        var p = HTMLAudioElement.prototype;
        var list = null, song = null;

        Object.defineProperties(p, {
            curListIndex: {
                get: function () {
                    return curListIndex;
                },
                set: function (val) {
                    if(val < 0 || val > this.player.lists.length) {
                        console.log("歌曲列表索引超出范围!");
                        throw "Index Error";
                        return;
                    }
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
                    if(val < 0 || val >= this.player.lists[curListIndex].songs.length) {
                        console.log("歌曲索引超出范围!");
                        return;
                    }
                    curIndex = val;

                    // 重新加载
                    this.load();
                    // 修改当前播放进度
                    this.currentTime = song.curTime;
                    this.play();
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
                song = list.songs[curIndex];
                if(song) {
                    console.log(song.toString());
                    return song;
                } else {
                    throw "noSong";
                }
            } catch(e) {
                audio.setAttribute("src", "");
                switch (e) {
                    case "noSong":
                        console.log("当前列表 没有歌曲!");
                        return;
                    case "noList":
                        console.log("当前没有列表!");
                        return;
                }
            }
        };

        // 获取当前播放的歌曲列表
        p.getCurList = function (val) {
            list = this.player.lists[this.curListIndex];
            if(list) {
                if(!val) {
                    list.songs.length ? console.table(list.songs) : console.log("当前列表没有歌曲");
                }
                return list;
            } else {
                throw "noList";
            }
        };

        // 切换歌单
        p.toggleList = function (listIndex) {
            listIndex = prompt("输入列表索引值");
            if(listIndex == null || isNaN(listIndex)) {
                console.log("输入的索引有错, 请输入大于0的数字!");
                return;
            }
            try {
                curListIndex = +listIndex;
                curIndex = 0;
            } catch(e) {
                return;
            }
            var list = this.getCurList();
            switch (list.songs.length) {
                case 0:
                    return list;
                default:
            }
            return list;
        };

        // next 函数
        p.nextSong = function () {
            song.curTime = this.currentTime;
            // 保存当前播放进度
            this.curIndex++;
        };
        // prev 函数
        p.prevSong = function () {
            song.curTime = this.currentTime;
            // 保存当前播放进度
            this.curIndex--;
        };

        // 添加歌单
        p.addList = function () {
            var name = prompt("输入列表名");
            if(!name) {
                return;
            }

            // 打印日志
            this.player.zpConsole("addList", 1);
            console.log(this.player._addList(name));
        };

        // 添加歌曲
        p.addSongs = function () {
            // 创建 input 标签
            doms.inp.type = "file";
            doms.inp.setAttribute("multiple", true);
            doms.inp.click();

            // 获取歌曲
            doms.inp.onchange = function () {
                var
                    files = Array.from(doms.inp.files),
                    list = this._addSongs(files);

                // 打印日志
                this.zpConsole("addSongs", list.songs.length);

            }.bind(this.player);
        };

        // 删除当前列表
        p.delList = function () {
            var lists = this.player.lists;
            if(!lists.length) {
                console.log("歌曲列表已经清空了");
                return;
            }

            var list = lists.splice(lists.indexOf(lists[audio.curListIndex]), 1);

            // 打印日志
            console.log(new Date().toLocaleTimeString() + ": " + this.player.toString() + " delCurList(" + 1 + ")");
            console.log(list);

            // 重新加载
            audio.load();
        };

        // 显示当前列表
        p.showList = function () {
            this.getCurList();
        };

        // 显示当前所有歌单
        p.showAllList = function () {
            console.table(this.player.lists);
        };

        // 查找歌曲
        p.searchSong = function () {
            var songs = this.player._searchSong(this.player.searchSong.value);
            songs ? console.table(songs) : console.table("当前列表没有查找到");
            return songs;
        };

        // 查找歌手
        p.searchSinger = function () {
            var songs = this.player._searchSong(this.player.searchSinger.value, "singer");
            songs ? console.table(songs) : console.table("当前列表没有查找到");
            return songs;
        };


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
                        this.setAttribute("src", this.getCurSong().path);
                        break;
                }
                tp.call(this);
            };
        }

    }.call(doms.audio, HTMLAudioElement));

    // 酷狗音乐
    var kuGou = new Player("KuGou");


    // 上下一曲的点击事件
    kuGou.next.forEach(function (ele) {
        ele.addEventListener("click", audio.nextSong.bind(audio));
    });
    kuGou.prev.forEach(function (ele) {
        ele.addEventListener("click", audio.prevSong.bind(audio));
    });

    // 循环添加点击事件
    kuGou.events.forEach(function (ele) {
        kuGou[ele].addEventListener("click", audio[ele].bind(audio));
    });

    // 搜索歌曲事件
    kuGou.searchSong.addEventListener("change", audio.searchSong.bind(audio));



}));

