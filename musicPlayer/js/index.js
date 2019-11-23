/**
 * Created by hodo on 2017/7/31.
 */


// 模拟读取本地用户的歌曲列表
;(function (w, callback, undefined) {

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

    // 自己写的对象都继承的原型 (不包括函数对象)
    var zp = new function Zp() {
        this._name = "zp";
        this.toString = function () {
            var name = this.constructor._name;
            name = name ? name : this.constructor.name;
            return this._name ? "[" + this._name + " " + this.constructor.name + "]" : "[" + typeof this + " " + name + "]";
        };
        // listSongs 原型, 用来修改 push 等方法
        this.zpArr = (function () {
            var arr = [];
            function fn() {}
            fn.setPrototype(arr, {
// ### CodeContinue...
                // 重写 push 等方法跟 keys 绑定
                test: "HelloWorld!"
            });
            return fn;
        }());
        // 提供外界用来访问内部构造器使用的对象
        this.PlayerHandle = undefined;
    };
    Object.defineProperty(w, "zp", {
        value: zp,
        writable: false
    });


    // 在window下添加缓存
    w.cache = createCache();

    // 获取本地歌曲列表 (默认的歌曲列表, 测试用)
    getAjax(config.ROOT_RUL, callback, w);

}(window, function(data, w) {

    /**
     * 歌曲的构造函数
     * @param option    // 配置信息
     * @constructor
     */
    function Song(option) {
        this._name = option.name;                               // 歌名
        this.size = option.size;                                // 歌曲大小
        this.type = option.type || config.supportType[0];       // 歌曲类型
        this.lyric = option.lyric || "none";                    // 歌词
        this.singer = option.name.split(" - ")[0];              // 歌手
        this.curTime = 0;                                       // 播放进度
        this.path = option.path;                                // 歌曲路径 (写死了)
        this.data = option.data;                                // 二进制数据 (缓存使用到)
        this.ownOflists = [];                                   // 所属的列表
    }
    Song.setPrototype(w.zp, {
        supportType: config.supportType,
        // 访问自己属于自己的播放器
        getPlayer: function (val) {
            try {
                if(!val) {
                    try {
                        return this.ownOflists[0].constructor.prototype.player;
                    } catch(e) {
                        switch (e.message) {
                            case "Cannot read property 'constructor' of undefined":
                                return "改歌曲没有所属的列表";
                        }
                    }
                }
                // 根据歌单名或者索引值来获取
                return this.ownOflists.filter(function (list, index) {
                    return list.name == val || index == val;
                })[0].constructor.prototype.player;
            } catch(e) {
                switch (e.message) {
                    case "Cannot read property 'constructor' of undefined":
                        return "改歌曲没有所属的列表";
                }
            }
        }
    });


    var listFn = null;

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
                enumerable: false
            }
        });
        this.List.setPrototype(this.sp, {
            init: function (option) {
                if(typeof option === "string" || option == null) {
                    option = { name: option };
                }
                this._name = option.name;
                this.songs = [];
                this.keys = [];
            }
        });
        // 取出list构造函数
        listFn = this.List;

        // 第一次加载 (模拟读取本地文件)
        this._addList("myLove", config.data);
        this.audio.getCurList();
        this.audio.getCurSong(true);
        this.audio.load();

        // 注册事件
        this.initEvents();
    }
    Player.setPrototype(w.zp, {
        init: function (id, theme) {
            this._name = id;
            this.contain = document.getElementById(id);
            if(!this.contain) {
                throw _Error.noContain + " for id #" + id;
                return;
            }
            this.audio = this.contain.querySelector("audio");
            if(!this.audio) {
                throw "#" + id + " " + _Error.noAudio;
                return;
            }
            this.audio.player = this;
            this.theme = theme || "defalut";
            this.lists = [];
            this.count = 0;

            this.events = ["addList", "addSongs", "delList", "showAllList", "showList", "toggleList"];

            // 元素标签
            this.prev = this.contain.querySelectorAll("button[data-target='prev']");
            this.next = this.contain.querySelectorAll("button[data-target='next']");

            this.btns = this.events.filter(function (ele) {
                return this[ele] = this.contain.querySelector("button[data-target='" + ele + "']");
            }, this);

            this.searchSong = this.contain.querySelector("input[data-target='searchSong']");
        },
        initEvents: function () {
            // 注册事件
            // 上下一曲的点击事件
            this.next.forEach(function (ele) {
                ele.addEventListener("click", this.audio.nextSong.bind(this.audio));
            }, this);
            this.prev.forEach(function (ele) {
                ele.addEventListener("click", this.audio.prevSong.bind(this.audio));
            }, this);

            // 循环添加点击事件
            this.btns.forEach(function (ele) {
                this[ele].addEventListener("click", this.audio[ele].bind(this.audio));
            }, this);

            // 搜索歌曲事件
            this.searchSong.addEventListener("blur", this.audio.searchSong.bind(this.audio));
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
                        data: "undefined",
                        lyric: ele.lyric
                    });
                    song.ownOflists.push(list);
                    list.songs.push(song);
                }, this.lists[this.audio.curListIndex]);
            }
            return list;
        },
        // 获取key
        _getCurKey: function () {
            return this.audio.getCurList(true).keys[this.audio.curIndex];
        }
    });

    /**
     * 歌曲原型
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
            return "[" + this._name + " " + this.__proto__.player._name + "]";
        },
        // 根据 files 来添加 歌曲
        _addSongsForFile: function (files) {
            var count = 0, len = files.length, listCount = 0;
            files.forEach(function (ele, index, arr) {
                var reader = new FileReader();
                var audio = this.constructor.prototype.player.audio;
                reader.readAsDataURL(ele);
                reader.onload = function (e) {
                    var flag = Song.prototype.supportType.some(function (type) {
                        return ele.type == type;
                    });
                    if(!flag) {
                        listCount--;
                        console.warn(_Warn.songType, ele.name, ele.type);
                        return;
                    }
                    // 用来模拟缓存的开闭原则
                    var song = new Song({
                        name: ele.name,
                        size: ele.size,
                        path: e.target.result,
                        data: e.target.result
                    });
                    this.songs.push(song);
                    this.keys.push(ele.name);
                    w.cache(song._name, song);
                }.bind(this);

                //var flag_load = true;
                reader.onloadend = function (e) {
                    listCount++;
                    // 缓存的应用, 列表为空的时候加载已经缓存的
                    //if(flag_load && audio.paused/* && !audio.getAttribute("src")*/) { // 加载多次
                    if(listCount === 1 && audio.paused && len != 1) {   // 只有一次加载
                        // 读取好第一个文件直接加载, 其他文件异步继续加载 (加载多个文件的时候有用)
                        console.log("%c" + _Tip.cache + " 先加载已经缓存的第 " + listCount + " 首歌.", "color: green");
                        try {
                            audio.curIndex = this.songs.length - 1;
                        } catch(e) {
                            return;
                        }
                    }

                    switch (++count) {
                        case len:
                            // 打印日志
                            //flag_load = false;
                            audio.player.zpConsole("addSongs", listCount);
                            if(audio.paused) {
                                audio.load();
                            }
                            console.table(this.songs);
                            break;
                    }
                }.bind(this);
            }, this);
            return this;
        },
        // 根据 歌名, 歌手, 索引查找
        _searchSong: function (value, key) {
            key = key || "_name";
            var reg = new RegExp(value);
            var songs = this.songs.filter(function (ele) {
                return reg.test(ele[key]);
            });
            if(songs.length) {
                return songs;
            } else {
                return [this.songs[+value]];
            }

        },
        // 添加歌曲
        _addSongs: function (songs) {
            songs.forEach(function (ele) {
                this.songs.push(ele);
            }, this);
            return this.songs;
        }
        // 删除功能不想写 = =
// ### CodeContinue...
    });


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
                        console.warn(_Warn.curListIndex);
                        return;
                    }
                    curListIndex = val;
                    this.load();

                    // 切换的时候暂停播放
                    //this.pause();
                }
            },
            curIndex: {
                get: function () {
                    return curIndex;
                },
                set: function (val) {
                    try {
                        var len = this.getCurList(true).songs.length;
                    } catch(e) {
                        throw _Error.noList;
                        return;
                    }
                    if(val < 0 || val >= len) {
                        console.warn(_Warn.curIndex);
                        return;
                    }
                    curIndex = val;

                    // 重新加载
                    this.load();
                    // 修改当前播放进度
                    this.currentTime = song.curTime;
                    if(this.paused) {
                        this.play();
                    }
                }
            },

            // 添加播放当前, 其他暂停的方法
            curPlay: function () {
// ### CodeContinue...
            }
        });

        // 获取当前播放的歌曲
        p.getCurSong = function (val) {
            try {
                song = list.songs[curIndex];
                if(song) {
                    if(!val) {
                        console.log(song.toString());
                    }
                    return song;
                } else {
                    throw _Error.noSong;
                }
            } catch(e) {
                this.setAttribute("src", "");
                throw _Error.noSong;
            }
        };

        // 获取当前播放的歌曲列表
        p.getCurList = function (val) {
            list = this.player.lists[this.curListIndex];
            try {
                if(list) {
                    if(!val) {
                        list.songs.length ? console.table(list.songs) : console.warn(_Warn.noSong);
                    }
                    return list;
                } else {
                    throw _Error.noList;
                }
            } catch(e) {
                this.setAttribute("src", "");
                throw _Error.noList;
            }
        };

        // 切换歌单
        p.toggleList = function (listIndex) {
            listIndex = prompt("输入列表索引值");
            if(listIndex == null || isNaN(listIndex)) {
                console.warn(_Warn.index);
                return;
            }
            try {
                curListIndex = +listIndex;
                this.curIndex = 0;
            } catch(e) {
                console.warn(_Warn.noList);
                return;
            }
            var list = this.getCurList(true);
            switch (list.songs.length) {
                case 0:
                    return list;
                default:
            }
            return list;
        };

        // next 函数
        p.nextSong = function () {
            this.getCurSong(true).curTime = this.currentTime;
            // 保存当前播放进度
            this.curIndex++;
        };
        // prev 函数
        p.prevSong = function () {
            this.getCurSong(true).curTime = this.currentTime;
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
            console.log(this.player._addList(name).toString());
            this.curListIndex = this.player.lists.length - 1;
        };

        // 添加歌曲
        p.addSongs = function () {
            // 创建 input 标签
            doms.inp.type = "file";
            doms.inp.setAttribute("multiple", true);
            doms.inp.click();

            // 获取歌曲
            doms.inp.onchange = function () {
                var files = Array.from(doms.inp.files);
                this.getCurList(true)._addSongsForFile(files);

            }.bind(this);
        };

        // 删除当前列表
        p.delList = function () {
            var lists = this.player.lists;
            if(lists.length) {
                var list = lists.splice(lists.indexOf(lists[this.curListIndex]), 1);
                try {
                    this.curListIndex = 0;
                } catch(e) {
                    switch (e.message) {
                        case "Cannot read property 'keys' of undefined":
                            console.warn(_Warn.noList);
                            return;
                    }
                }

                // 打印日志
                console.log(new Date().toLocaleTimeString() + ": " + this.player.toString() + " delCurList(" + 1 + ")");
                console.log(list);

                // 重新加载
                this.load();
            } else {
                return "歌曲列表已经清空了";
            }
        };

        // 显示当前列表
        p.showList = function () {
            this.getCurList();
        };

        // 显示当前所有歌单
        p.showAllList = function () {
            var lists = this.player.lists;
            if(lists.length) {
                console.table(lists);
            } else {
                console.warn(_Warn.noList);
            }
        };

        // 查找歌曲
        p.searchSong = function () {
            var list = this.getCurList(true), value = this.player.searchSong.value;
            if(value.trim()) {
                var songs = this.getCurList(true)._searchSong(value);
                songs = songs[0] == null ? [] : songs;
                this.player.zpConsole("searchSong", songs.length);
                if(songs.length) {
                    console.table(songs)
                } else {
                    console.warn(_Warn.noSearch);
                }

                //songs.length ? (this.player.zpConsole("searchSong", songs.length), console.table(songs)) : console.warn(_Warn.noSearch);
                return songs;
            } else {
                this.player.searchSong.value = "";
                console.warn(_Warn.valueOfNone);
                return;
            }
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
                        // 保存播放记录
                        this.getCurSong().curTime = this.currentTime;
                        break;
                    case "load":
                        // 模拟缓存
                        var data = w.cache(this.player._getCurKey());
                        if(data && data.data) {
                            console.log("cache ", data.toString());
                            this.setAttribute("src", data.data);
                        } else {
                            try {
                                this.setAttribute("src", this.getCurSong().path);
                            } catch(e) {
                                switch (e.message) {
                                    case "Cannot read property 'path' of undefined":
                                    case "(in promise) DOMException: The play() request was interrupted by a new load request.":
                                        return "当前列表没有歌曲!";
                                }
                            }
                        }
                        break;
                }
                tp.call(this);
            };
        }

    }(HTMLAudioElement));


    // 酷狗音乐
    var kuGou = new Player("KuGou");


    // 对外开放 Player, Song, List 的构造方法
    w.zp.PlayerHandle = {
        newPlayer: function (id) {
            // id: 元素id名
            return new Player(id);
        },
        newList: function (option, obj) {
            obj = obj || w;
            // 不知道算不算bug的问题, listFn 我传不进去参数
            var list = new listFn();
            list.init(option);
            return list;
        },
        newSong: function (option) {
            return new Song(option);
        }
    };
}));

