(function() {
    //强行暴露变量
    window.Carousel = Carousel;
    //轮播图
    function Carousel(JSON) {
        this.$dom = $("#" + JSON.id);
        this.$imagesUl = null;
        this.pictureLength = JSON.images.length;
        this.images = JSON.images;
        this.width = JSON.width;
        this.height = JSON.height;
        this.$leftBtn = null;
        this.$rightBtn = null;
        this.animateDuration = JSON.animateDuration;
        this.$circleOl = null;
        this.$circleLis = null;
        this.interval = JSON.interval;
        this.idx = 0;
        //图片数量
        this.pictureLength = JSON.images.length;
        //图片地址数组
        this.imagesURLArr = JSON.images;
        //初始化
        this.init();
        //绑定监听
        this.bindEvent();
        //定时器
        this.autoPlay();
    }
    //初始化
    Carousel.prototype.init = function() {
        //创建dom上树
        this.$imagesUl = $("<ul></ul>");
        this.$dom.append(this.$imagesUl);
        //创建li节点
        for (var i = 0; i < this.pictureLength; i++) {
            $("<li><img src='" + this.imagesURLArr[i] + "'/></li>").appendTo(this.$imagesUl)
        }
        //获得引用
        this.$imagesUlLis = this.$imagesUl.find("li");
        //布局
        this.$dom.css({
            "width": this.width,
            "height": this.height,
            "position": "relative",
            "overflow": "hidden"
        });
        //猫腻 ，藏起来
        this.$imagesUlLis.css({
            "left": this.width,
            "position": "absolute",
            "left": this.width,
            "top": 0
        });
        this.$imagesUlLis.eq(0).css("left", 0);
        //创建按钮
        this.$leftBtn = $("<a href='javascript:;' class='leftBtn'></a>");
        this.$rightBtn = $("<a href='javascript:;' class='rightBtn'></a>");
        this.$leftBtn.appendTo(this.$dom);
        this.$rightBtn.appendTo(this.$dom);
        //小圆点
        this.$circleOl = $("<ol class='circls'></ol>");
        this.$circleOl.appendTo(this.$dom);
        for (var i = 0; i < this.pictureLength; i++) {
            $("<li></li>").appendTo(this.$circleOl);
        }
        //获得引用
        this.$circleLis = this.$circleOl.find("li");
        this.$circleLis.eq(0).addClass("active");
    };
    //监听
    Carousel.prototype.bindEvent = function() {
            var self = this;
            this.$rightBtn.click(function() {
                if (self.$imagesUlLis.is(":animated")) {
                    return;
                }
                self.showNext();
            })
            this.$leftBtn.click(function() {
                    if (self.$imagesUlLis.is(":animated")) {
                        return;
                    }
                    self.showPrev();
                })
                //原点
            this.$circleLis.click(function() {
                    self.show($(this).index());
                })
                //鼠标滑上停止
            this.$dom.mouseenter(function() {
                clearInterval(self.timer);
            });
            this.$dom.mouseleave(function() {
                self.autoPlay();
            });
        }
        //展示下一张
    Carousel.prototype.showNext = function() {
            this.$imagesUlLis.eq(this.idx).animate({
                "left": -this.width
            }, this.animateDuration);
            this.idx++;
            if (this.idx > this.pictureLength - 1) {
                this.idx = 0;
            }
            this.$imagesUlLis.eq(this.idx).css("left", this.width).animate({
                "left": 0
            }, this.animateDuration);
            this.changeCir();
        }
        //展示上一张
    Carousel.prototype.showPrev = function() {
            this.$imagesUlLis.eq(this.idx).animate({
                "left": this.width
            }, this.animateDuration);
            this.idx--;
            if (this.idx < 0) {
                this.idx = this.pictureLength - 1;
            }
            this.$imagesUlLis.eq(this.idx).css("left", -this.width).animate({
                "left": 0
            }, this.animateDuration);
            this.changeCir();
        }
        //展示任意
    Carousel.prototype.show = function(number) {
            var old = this.idx;
            this.idx = number;
            //判断
            if (this.idx > old) {
                this.$imagesUlLis.eq(old).animate({
                    "left": -this.width
                }, this.animateDuration);
                this.$imagesUlLis.eq(this.idx).css("left", this.width).animate({
                    "left": 0
                }, this.animateDuration);
            } else if (this.idx < old) {
                this.$imagesUlLis.eq(old).animate({
                    "left": this.width
                }, this.animateDuration);
                this.$imagesUlLis.eq(this.idx).css("left", -this.width).animate({
                    "left": 0
                }, this.animateDuration);
            }
            //小圆点变色
            this.changeCir();
        }
        //小圆点变色
    Carousel.prototype.changeCir = function() {
            this.$circleLis.eq(this.idx).addClass("active").siblings().removeClass('active');
        }
        //自动轮播
    Carousel.prototype.autoPlay = function() {
        var self = this;
        this.timer = setInterval(function() {
            self.showNext();
        }, this.interval);
    }
})();