/**
 * [仿pdf阅读器]
 * @update: 2016.06.30
 * @author: yongcheng0660@163.com
 * @github: https://github.com/bravefuture
 * html结构：
<div class="viewer">
	<div class="viewer-control">
		<div class="scaling">
			<div class="scaling-line"></div>
			<div class="scaling-bar"></div>
		</div>
		<input type="text" class="input-text percentage" />
		<div class="full-screen">
			<i class="fs-t"></i>
			<i class="fs-c"></i>
			<i class="fs-b"></i>
		</div>
		<span class="line"></span>
		<i class="arrow-left"></i>
		<input type="text" class="input-text page-num" /> <span>/</span> <span class="page-total"></span>
		<i class="arrow-right"></i>
	</div>
	<div class="viewer-content">
	</div>
</div>
 * 	
 * 实例化
var viewer = new Enjoy.Viewer({
	viewerWrap: '.viewer',
	viewerControl: '.viewer-control',
	viewerContent: '.viewer-content',
	arrowLeft: '.arrow-left',
	arrowRight: '.arrow-right',
	pageNum: '.page-num',
	pageTotal: '.page-total',
	percentage: '.percentage',
	scalingLine: '.scaling-line',
	scalingBar: '.scaling-bar',
	fullScreen: '.full-screen',
	rangeFrom: 30,
	rangeTo: 500,
	imgData: ['images/p1.png', 'images/p2.png'],
	callback: function(){},
	viewerH: 893,
	imgW: 655,
	rangeFrom: 30, //以100为基准
	rangeTo: 500,
	blankImg: 'images/blank_img.gif',
	zIndex: 3,
	scale: 100
});
 * 方法：
 * 1. 跳转页
   viewer.pageJump(3);
 * 2. 缩放页
   viewer.scaling(120);
 */
let win = $(window),
	doc = $(document),
	html = $('html');
export default class Viewer{
	// 构造函数
	constructor(args) {
		/**
		 * [args 传参]
		 * @type {[type]}
		 */
		args = $.extend({
			viewerH: 893,
			imgW: 655,
			rangeFrom: 30, //以100为基准
			rangeTo: 500,
			zIndex: 3,
			jumpNum: 1,
			imgData: [],
			callback: function(){}
		}, args || {});
		//版本
		this.version = '0.0.1';
		//获取dom
		this.viewerWrap = $(args.viewerWrap); //不要在此dom设置margin值
		this.viewerControl = $(args.viewerControl);
		this.viewerContent = $(args.viewerContent);
		this.arrowLeft = $(args.arrowLeft);
		this.arrowRight = $(args.arrowRight);
		this.pageNum = $(args.pageNum);
		this.percentage = $(args.percentage);
		this.scalingLine = $(args.scalingLine);
		this.scalingBar = $(args.scalingBar);
		this.pageTotal = $(args.pageTotal);
		this.fullScreen = $(args.fullScreen);
		//获取参数
		this.viewerH = args.viewerH;
		this.imgW = args.imgW;
		this.rangeFrom = args.rangeFrom;
		this.rangeTo = args.rangeTo;
		this.zIndex = args.zIndex;
		this.scale = args.scale;
		this.jumpNum = args.jumpNum;
		this.imgData = args.imgData;
		this.callback = args.callback;
		this.blankImg = args.blankImg; //解决img的src空时在非IE发生2次请求问题
		//执行
		this.init();
	}

	init() {
		var _self = this,
			img = new Image(),
			imgData = this.imgData,
			imgDataLen = imgData.length;
		img.onload = function() {
			//取图片高度(所有图片高度必须一样高)
			_self.imgH = this.height *  _self.imgW / this.width;
			_self.scrollLoadImg();
			_self.pageJump(_self.jumpNum);
			_self.scaling(_self.scale);
			_self.setFullScreen();
			_self.pageDrag();
		};
		//如果前几张图片不存在，会继续加载一下张图
		var imgError = function(i) {
			img.onerror = function() {
				img.onerror = null;
				i++;
				img.src = imgData[i];
				if (i < imgDataLen) {
					imgError(i);
				}					
			}
		}
		imgError(0);
		//加载第一图片
		img.src = this.imgData[0];
	}
	/**
	 * [scrollLoadImg 滚动加载图片]
	 * @return {[type]} [description]
	 */
	scrollLoadImg() {
		this.viewerContentOT = this.viewerContent.offset().top;
		this.viewerContentH = this.viewerContent.height();
		var viewerContentST = 0,
			timer = null,
			_self = this;

		//取图片总数
		this.imgTotal = this.imgData.length;
		//设置图片总数
		this.pageTotal.html(this.imgTotal);
		//初始化结构
		var imgData = [];
		for(var i = 0; i < this.imgTotal; i++){
			imgData[imgData.length] = '<div class="viewer-item" style="width:'+ this.imgW +'px;height:'+ this.imgH +'px"><img data-src="'+ this.imgData[i] +'" src="'+ this.blankImg +'" class="viewer-img" style="width:100%;" alt=""/></div>';
		}
		this.viewerContent.html(imgData.join(''));
		//滚动加载图
		this.viewerContent.on('scroll.scrollLoadImg', function(){
			var that = $(this);
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(function(){
				viewerContentST = that.scrollTop();
				that.find('.viewer-img').each(function(i, v) {
					var viewImg = $(this),
						viewImgOT = viewImg.offset().top,
						viewItem = viewImg.parent('.viewer-item'),
						viewItemIndex = viewItem.index() + 1,
						viewImgH = viewItem.outerHeight(true),
						//向下滚动加载图片条件
						isScrollDown = viewImgOT > _self.viewerContentOT && viewImgOT < _self.viewerContentOT + _self.viewerContentH,
						//向上滚动加载图片条件
						isScrollUp = viewerContentST < viewItemIndex * viewImgH && viewItemIndex * viewImgH - _self.viewerContentH <= viewerContentST,
						//当快速拉滚动条时可见区域在一张图片中
						isScrollOver = viewImgOT < _self.viewerContentOT && viewImgH + viewImgOT - _self.viewerContentOT - _self.viewerContentH > 0;
		            if (isScrollDown || isScrollUp || isScrollOver) {
		                var img = new Image();
		                img.onload = function() {
		                    viewImg.attr('src', viewImg.data('src')).hide().fadeIn(300);
		                    viewImg.removeClass('viewer-img');
		                    //回调函数
		                    _self.callback(viewItemIndex - 1);
		                };
		                img.src = viewImg.data('src');
		            }
		        });
		        _self.updateNum();
			}, 100);
		}).scroll();
	}
	/**
	 * [pageJump 页面跳转]
	 * @return {[type]} [description]
	 */
	pageJump(num) {
		var	_self = this;
		num = num || 1; 
		this.pageNum.val(num);
		var sTTo = function(num){
			_self.viewerContent.scroll();
			_self.viewerContent.scrollTop($('.viewer-item').outerHeight(true) * (num - 1));
			_self.viewerContentOT = _self.viewerContent.offset().top;
		};
		sTTo(num);
		this.arrowRight.on('click', function(e){
			num = _self.pageNum.val();
			if(num < _self.imgTotal){
				num++;
				sTTo(num);
				_self.pageNum.val(num);		
			}
			e.preventDefault();
		});
		this.arrowLeft.on('click', function(e){
			num = _self.pageNum.val();
			if(num > 1){
				num--;
				sTTo(num);
				_self.pageNum.val(num);					
			}
			e.preventDefault();
		});
		//绑定回车事件
		this.pageNum.on('focus.pageNum', function(){
			doc.on('keyup.pageNum', function(e){
				var code = e.keyCode || e.which || e.charCode;
				if(code === 13){
					num = _self.pageNum.val();
					if(isNaN(num)){
						return;
					}
					num = num <= 0? 1 : num;
					num = num > _self.imgTotal? _self.imgTotal : num;
					_self.pageNum.val(num);
					sTTo(num);
				}
			});
		});
		this.pageNum.on('blur.pageNum', function(){
			doc.off('keyup.pageNum');
		});
	}
	/**
	 * [updateNum 更新页数]
	 * @return {[type]} [description]
	 */
	updateNum() {
		var imgH = this.viewerContent.find('.viewer-item').outerHeight(),
			viewerContentST = this.viewerContent.scrollTop(),
			num = Math.ceil((viewerContentST - imgH) / imgH) + 1;
		if(num === 0){
			num = 1;
		}
		this.pageNum.val(num);
	}
	/**
	 * [scaling 缩放]
	 * @return {[type]} [description]
	 */
	scaling(percentageVal) {
		percentageVal = percentageVal || '100';
		this.percentage.val(percentageVal + '%');
		var scalingBarW = this.scalingBar.width(),
			scalingBarH = this.scalingBar.height(),
			scalingLineW = this.scalingLine.width(),
			scalingLinePL = this.scalingLine.position().left,
			_self = this;
        this.scalingBar.on('mousedown.bar', function(e){
			var scalingLinePT = _self.scalingLine.position().top,
				scalingLineOL = _self.scalingLine.offset().left;
            doc.on('mousemove.bar', function(e){
            	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                var left = e.pageX - scalingLineOL + scalingBarW / 2,
                	top = scalingLinePT - scalingBarH / 2;
                if(left <= scalingLinePL){
                	left = scalingLinePL;
                }
                if(left >= scalingLinePL + scalingLineW - scalingBarW){
                	left = scalingLinePL + scalingLineW - scalingBarW;
                }
                //设置百分比
                var percentageVal = (_self.rangeTo - _self.rangeFrom) * (left - scalingLinePL) / (scalingLineW - scalingBarW) + _self.rangeFrom;
                _self.percentage.val(parseInt(percentageVal) + '%');
                //设置图片大小
                $('.viewer-item').css({
                	width: percentageVal / 100  * _self.imgW,
                	height: percentageVal / 100  * _self.imgH
                });
                _self.scalingBar.css({
                    top: top,
                    left: left
                });
            	_self.viewerContent.scroll();
            });
            doc.off('mouseup.bar').bind('mouseup.bar', function(){
                doc.off('mousemove.bar');
            });
        });
        //设置scalingBar位置
        var setScalingBarPo = function(percentageVal){
        	var left = (percentageVal - _self.rangeFrom) * (scalingLineW - scalingBarW) / (_self.rangeTo - _self.rangeFrom) + scalingLinePL; 
            _self.scalingBar.css({
                left: left
            });	        	
        };
        setScalingBarPo(100);
		//绑定回车事件
		var scaleTo = function(){
			percentageVal = parseInt(_self.percentage.val());
			percentageVal = percentageVal > _self.rangeTo? _self.rangeTo : percentageVal;
			percentageVal = percentageVal < _self.rangeFrom? _self.rangeFrom : percentageVal;
			_self.percentage.val(percentageVal + '%');
			setScalingBarPo(percentageVal);
			$('.viewer-item').css({
            	width: percentageVal / 100  * _self.imgW,
            	height: percentageVal / 100  * _self.imgH
            });
        	_self.viewerContent.scroll();
		};
		scaleTo();
		this.percentage.on('focus.percentage', function(){
			doc.on('keyup.percentage', function(e){
				var code = e.keyCode || e.which || e.charCode;
				if(code === 13){
					scaleTo();
				}
			});
		});
		this.percentage.on('blur.percentage', function(){
			doc.off('keyup.percentage');
		});
	}
	/**
	 * [updateViewerContentData 更新ViewerContent数据]
	 */
	updateViewerContentData() {
		this.viewerContentOT = this.viewerContent.offset().top;
		this.viewerContentH = this.viewerContent.height();
	}
	/**
	 * [setFullScreen 设置全屏]
	 */
	setFullScreen() {
		var _self = this,
			timer = null;
		//存原始样式
		var viewerWrapW = _self.viewerWrap.width(),
			viewerWrapH = _self.viewerWrap.height();
		_self.viewerWrap.before('<div class="viewer-record-pos" style="width:0px;height:0px;overflow:hidden;"></div>');
		var viewerRecordPos = $('.viewer-record-pos');
		//重置样式
		var setFullScreenData = function(){
			html.css({
				'overflow': 'hidden'
			});
			var viewerRecordPosOL = viewerRecordPos.offset().left - win.scrollLeft(),
				viewerRecordPosOT = viewerRecordPos.offset().top - win.scrollTop();
			//设置最小宽度
			var minW = win.width() < viewerWrapW ? viewerWrapW : win.width();
			_self.viewerWrap.css({
				position: 'relative',
				zIndex: _self.zIndex,
				width: minW,
				height: win.height(),
				margin: 0,
				left: 0 - viewerRecordPosOL,
				top: 0 - viewerRecordPosOT
			});
			_self.viewerContent.css({
				height: win.height() - _self.viewerControl.height()
			});
			_self.updateViewerContentData();
		};
		this.fullScreen.on('click', function(){
			setFullScreenData();
			win.on('scroll.fullScreen, resize.fullScreen', function(){					
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(function(){
					setFullScreenData();
				}, 100);
			});
		});
		//退出全屏
		doc.on('keyup.exitFullScreen', function(e){
			var code = e.keyCode || e.which || e.charCode;
			if(code === 27){
				html.css({
					'overflow': 'auto'
				});
				win.off('scroll.fullScreen, resize.fullScreen');
				_self.viewerWrap.css({
					position: 'static',
					width: viewerWrapW,
					height: viewerWrapH
				});
				_self.viewerContent.css({
					height: _self.viewerH
				});
				_self.updateViewerContentData();					
			}
		});
	}
	/**
	 * [pageDrag 页面拖动]
	 * @return {[type]} [description]
	 */
	pageDrag() {
		var _self = this;
		$('.viewer-item').on('mousedown.pageDrag', function(e){
			var startX = e.pageX + _self.viewerContent.scrollLeft(),
				startY = e.pageY + _self.viewerContent.scrollTop();
            doc.on('mousemove.pageDrag', function(e){
            	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            	var moveX = startX - e.pageX,
            		moveY = startY - e.pageY;
            	_self.viewerContent.scrollLeft(moveX);
            	_self.viewerContent.scrollTop(moveY);
            });
            doc.off('mouseup.pageDrag').bind('mouseup.pageDrag', function(){
                doc.off('mousemove.pageDrag');
            });
            return false;
        });
	}

}
