

; (function (w, callback, undefined) {

    var zp = {
        toString: function () {
            return "[" + (this._name || typeof this) + " " + this.constructor.name ? this.constructor.name : this.constructor._name + "]";
        }
    };
    Object.defineProperty(w, "zp", {
        value: zp
    });

    // 继承
    Function.prototype.setInherit = function (sup, option) {
        var _fn_ = Object.create(sup);
        _fn_.constructor = this;
        this.prototype = _fn_;
        for (var key in option) {
            _fn_[key] = option[key];
        }
    };

    // 做一些兼容的操作
    if (w.requestAnimationFrame == null) {
        w.requestAnimationFrame = w.requestAnimationFrame || function (callback) { window.setTimeout(callback, 20); };
        w.cancelAnimationFrame = w.clearTimeout;
    }

    // 开始主要的操作
    callback(w, undefined);

}(window, function (w, undefined) {

    // 各个演员的原型
    var _fbFn_ = {
        prototype: w.zp,
        _name: "_fbFn_",
        x: 0,
        y: 0,
        speed: -2,
        _init: function () {
            this.x = this.option.x || this.x;
            this.y = this.option.y || this.y;
            this.count = this.option.count || this.count;
            this.speed = this.option.speed || this.speed;
        },
        draw: function () {
            this.ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
            this.x += this.speed;
            this.judgeXY();
        },
        judgeXY: function () {
            if (-this.img.width >= this.x) {
                this.x = (this[this.constructor._name.toLowerCase() + "Count"] - 1) * this.img.width;
            }
        }
    }, txt;

    // 构造函数(共同部分)
    function _FbFn_(option) {
        this.option = option;
        this.img = option.img;
        this._init();
    }

    // 天空
    function Sky(option) {
        _FbFn_.call(this, option);
    }
    Sky._name = "Sky";
    Sky.setInherit(_fbFn_);

    // 大地
    function Land(option) {
        _FbFn_.call(this, option);
    }
    Land._name = "Land";
    Land.setInherit(_fbFn_);

    // 管道
    function Pipe(option) {
        _FbFn_.call(this, option);
        this._initHeight();
    }
    Pipe._name = "Pipe";
    Pipe.setInherit(_fbFn_, {
        draw: function () {
            // 绘制管道路径
            var w = this.img[0].width;
            var h = this.img[0].height;
            this.ctx.rect(this.x, this.y, w, this.topH);
            this.ctx.rect(this.x, this.y + this.topH + this.space, w, h);

            this.ctx.drawImage(this.img[1], 0, h - this.topH, w, this.topH, this.x, this.y, w, this.topH);
            this.ctx.drawImage(this.img[0], this.x, this.y + this.topH + this.space, w, h);
            this.x += this.speed;
            this.judgeXY();
        },
        _initHeight: function () {
            this.topH = Math.random() * (this.topMax - this.topMin) + this.topMin;
            this.bottomH = this.canvas.height - this.topH - this.landH - this.space;
        },
        judgeXY: function () {
            if (-this.img[0].width >= this.x) {
                // 重置高度
                this._initHeight();
                var count = this[this.constructor._name.toLowerCase() + "Count"] - 1;
                this.x = (count + 1) * this.gap + count * this.img[0].width
            }
        }
    });

    // 小鸟
    function Bird(option) {
        _FbFn_.call(this, option);
    }
    Bird._name = "Bird";
    Bird.setInherit(_fbFn_, {
        _init: function () {
            _fbFn_._init.call(this);
            this.w = this.img.width / 3;            // 图片的宽度
            this.h = this.img.height;               // 图片的高度
            this.index = 0;                         // 显示图片的位置索引
            this.count = 0;                         // 控制小鸟的帧速
            this.aspeed = this.option.aspeed;       // 加速度 大约 16.7ms
            this.stepTime = Math.ceil(200 / 16.7);  // 小鸟的帧速 200ms 一次
            this.maxAngle = Math.PI / 2 * .9;       // 最大角度
            this.maxSpeed = 8;                      // 最大速度
        },
        draw: function () {
            // 控制速度
            this.speed += this.aspeed;
            this.y += this.speed;
            // 留在底部
            if (this.y > 0 && this.y < this.canvas.height - this.h) {
                // 控制帧速
                if (!(++this.count % this.stepTime)) {
                    ++this.index;
                }

                // 控制角度
                this.ctx.save();
                this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
                this.ctx.rotate(this.speed / this.maxSpeed * this.maxAngle);

                this.ctx.drawImage(this.img,
                    (this.index % 3) * this.w, 0, this.w, this.h,
                    - this.w / 2, - this.h / 2, this.w, this.h);
                this.ctx.restore();
                return;
            }
            if (this.y >= this.canvas.height - this.h) {
                this.y = this.canvas.height - this.h;
            } else {
                this.y = 0;
            }
            this.ctx.drawImage(this.img,
                (this.index % 3) * this.w, 0, this.w, this.h,
                this.x, this.y, this.w, this.h);
        },
        isDied: function () {
            return this.ctx.isPointInPath(this.x + this.w / 2, this.y + this.h / 2) || this.y >= this.canvas.height - this.landH;
        }
    });

    // 操作所有元素的函数(导演)
    function FlapyBird(id, imgs) {
        this.imgs = imgs;
        try {
            this.canvas = document.querySelector(id);
        } catch (e) {
            this.canvas = id;
        }
        this.ctx = this.canvas.getContext("2d");
        this._fbFn_ = _fbFn_;
        this._init();
        this._initEvents();
    }
    FlapyBird.setInherit(w.zp, {
        _init: function () {

            _fbFn_.canvas = this.canvas;
            _fbFn_.ctx = this.ctx;

            this.isPaused = false;      // 是否暂停
            this.isWD = false;          // 无敌
            this._flag_2 = true;        // 无敌一次
            this.sky = [];              // 背景天空
            this.land = [];             // 背景大地
            this.pipe = [];             // 背景管道
            this.bird = [];             // 小鸟
            this.players = [this.sky, this.pipe, this.land, this.bird];     // 演员集合
            this.time = {
                start: new Date(),
                end: undefined,
                getTimed: function () {
                    return new Date(this.end - this.start).toTimeString().slice(3, 8);
                }
            };

            this.createPlayer();        // 创建演员

            // 判断高度太高就修改
            this.isHeightTooLong();
            // 开始动画
            this.action();
        },
        _initFn: function () {
            _fbFn_.landH = this.imgs.land.height;                   // 大地的高度
            _fbFn_.space = 100;                                     // 管道中的间隙
            _fbFn_.topMax = 270 / 600 * this.canvas.height;         // 下管道最大值
            _fbFn_.topMin = _fbFn_.topMax - 170;                    // 上管道最小值
            _fbFn_.gap = 120;                                       // 上管道与下管道的间隙
            _fbFn_.leftSpace = 200;                                 // 管道开始时候距离左边的距离
            _fbFn_.landCount = Math.ceil(this.canvas.width / this.imgs.land.width) + 1;                     // 大地的数量
            _fbFn_.skyCount = Math.ceil(this.canvas.width / this.imgs.sky.width) + 1;                       // 天空的数量
            _fbFn_.pipeCount = Math.ceil(this.canvas.width / (this.imgs.pipe1.width + _fbFn_.gap)) + 1;     // 管道的数量
            _fbFn_.birdCount = 1;                                   // 小鸟的数量
        },

        // 创建演员
        createPlayer: function () {
            this._initFn();

            var that = this,
                keys = ["Sky", "Land", "Pipe", "Bird"];

            // 创建天空
            create("Sky", function (i) {
                return {
                    img: this.imgs.sky,
                    x: i * this.imgs.sky.width
                };
            });

            // 创建大地
            create("Land", function (i) {
                return {
                    img: this.imgs.land,
                    x: i * this.imgs.land.width,
                    y: this.canvas.height - this.imgs.land.height,
                };
            })

            // 创建管道
            create("Pipe", function (i) {
                return {
                    img: [this.imgs.pipe1, this.imgs.pipe2],
                    x: (i + 1) * _fbFn_.gap + i * this.imgs.pipe1.width + _fbFn_.leftSpace
                };
            })

            // 创建小鸟
            create("Bird", function (i) {
                return {
                    img: this.imgs.birds,
                    x: 50,
                    y: 100,
                    speed: 2,
                    aspeed: .03
                };
            })

            function create(key, callback) {
                var k = key.toLocaleLowerCase();
                for (var i = 0, len = _fbFn_[k + "Count"]; i < len; i++) {
                    that[k][i] = new FlapyBird.prototype[key](callback.call(that, i));
                }
            }
        },

        // 递归绘图
        _action: function () {

            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.beginPath();
            this.players.forEach(function (ele) {
                ele.forEach(function (ele) {
                    ele.draw();
                });
            });

            // 绘制时间
            this.time.end = new Date();
            txt = this.time.getTimed();
            this.ctx.save();
            this.ctx.textBaseline = "top";
            this.ctx.font = "25px 微软雅黑"
            this.ctx.fillStyle = "red";
            this.ctx.fillText(txt, this.canvas.width - 20 - this.ctx.measureText(txt).width, 10);
            this.ctx.restore();

            // 判断小鸟是否死亡
            if (this.bird[0].isDied() && !this.isWD) {
                console.warn(" Game Over!");
                console.warn(" 重新开始输入 " + this._name + "._init()");
                return;
            } else if (this.isPaused) { // 是否暂停
                return;
            }

            this.timer = w.requestAnimationFrame(this.action.bind(this))
        },
        _initResize: function () {
            // 判断高度太高就修改
            this.isHeightTooLong();
            this._initFn();

            // 天空
            reset.call(this, "Sky", function (i) {
                return {
                    img: this.imgs.sky,
                    x: this.sky[i - 1].x + this.imgs.sky.width
                };
            });

            // 大地
            reset.call(this, "Land", function (i) {
                return {
                    img: this.imgs.land,
                    x: this.land[i - 1].x + this.imgs.land.width,
                    y: this.land[i - 1].y,
                };
            });

            // 管道
            reset.call(this, "Pipe", function (i) {
                return {
                    img: [this.imgs.pipe1, this.imgs.pipe2],
                    x: this.pipe[i - 1].x + this.imgs.pipe1.width + _fbFn_.gap
                };
            });

            function reset(k, callback) {
                var key = k.toLowerCase();
                this[key].sort(function (a, b) {
                    return a.x - b.x;
                });
                for (var i = 0, len = _fbFn_[key + "Count"]; i < len; i++) {
                    if (i >= this[key].length) {
                        this[key][i] = new FlapyBird.prototype[k](callback.call(this, i));
                    } else if (this[key][i].y) {
                        this[key][i].y = this.canvas.height - this.imgs[key].height;
                    }
                }
                this[key].length = _fbFn_[key + "Count"];
            }
        },
        action: function () {
            // 开始动画
            w.cancelAnimationFrame(this.timer);     // 取消动画, 不然会叠加
            this._action();
        },

        // 开挂
        wd: function () {
            this.isPaused = false;
            this.isWD = true;
            this.action();
        },
        _initEvents: function () {

            // 小鸟的点击事件
            this.canvas.addEventListener("click", function birdFlyTop() {
                this.bird[0].speed = -1.8;
            }.bind(this));

            // 按下空格 游戏暂停 向上箭头跳起
            document.querySelector("body").addEventListener("keydown", function pasued(e) {
                switch (e.keyCode) {
                    case 32:            // 空格
                        this.isPaused = !this.isPaused;
                        if (!this.isPaused) {
                            this.action();
                        } else {
                            console.warn(" 游戏暂停!");
                        }
                        break;
                    case 38:            // 向上
                        this.canvas.click();
                        break;
                    case 13:            // 回车无敌
                        if (this.isWD) {
                            this.isWD = false;
                        } else {
                            this.wd();
                        }
                        break;
                    case 192:           // 数字键1的左边 ` 单次无敌
                        if (this._flag_2) {
                            this._flag_2 = false, this.wd();
                            window.setTimeout(function () {
                                this.isWD = false;
                                this._flag_2 = true;
                            }.bind(this), 500);
                        }
                    default:
                        console.log(e.keyCode);
                }
            }.bind(this));
        },
        isHeightTooLong: function () {
            if (this.canvas.height > this.imgs.sky.height + _fbFn_.landH) {
                console.warn("canvas 的高度太高, 改为 " + (this.imgs.sky.height + _fbFn_.landH) + "!");
                this.canvas.height = this.imgs.sky.height + _fbFn_.landH;
                this._init();
            }
        },

        // 对外公开各个构造函数
        Sky: Sky,
        Land: Land,
        Pipe: Pipe,
        Bird: Bird
    });

    // 对外公开 FlapyBird 构造函数
    w.FlapyBird = FlapyBird;
}));

