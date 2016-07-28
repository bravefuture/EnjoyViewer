(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Enjoy", [], factory);
	else if(typeof exports === 'object')
		exports["Enjoy"] = factory();
	else
		root["Enjoy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _viewer = __webpack_require__(1);

	var _viewer2 = _interopRequireDefault(_viewer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(2);
	exports.default = { Viewer: _viewer2.default };
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	var win = $(window),
	    doc = $(document),
	    html = $('html');

	var Viewer = function () {
		// 构造函数
		function Viewer(args) {
			_classCallCheck(this, Viewer);

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
				callback: function callback() {}
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

		_createClass(Viewer, [{
			key: 'init',
			value: function init() {
				var _self = this,
				    img = new Image(),
				    imgData = this.imgData,
				    imgDataLen = imgData.length;
				img.onload = function () {
					//取图片高度(所有图片高度必须一样高)
					_self.imgH = this.height * _self.imgW / this.width;
					_self.scrollLoadImg();
					_self.pageJump(_self.jumpNum);
					_self.scaling(_self.scale);
					_self.setFullScreen();
					_self.pageDrag();
				};
				//如果前几张图片不存在，会继续加载一下张图
				var imgError = function imgError(i) {
					img.onerror = function () {
						img.onerror = null;
						i++;
						img.src = imgData[i];
						if (i < imgDataLen) {
							imgError(i);
						}
					};
				};
				imgError(0);
				//加载第一图片
				img.src = this.imgData[0];
			}
			/**
	   * [scrollLoadImg 滚动加载图片]
	   * @return {[type]} [description]
	   */

		}, {
			key: 'scrollLoadImg',
			value: function scrollLoadImg() {
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
				for (var i = 0; i < this.imgTotal; i++) {
					imgData[imgData.length] = '<div class="viewer-item" style="width:' + this.imgW + 'px;height:' + this.imgH + 'px"><img data-src="' + this.imgData[i] + '" src="' + this.blankImg + '" class="viewer-img" style="width:100%;" alt=""/></div>';
				}
				this.viewerContent.html(imgData.join(''));
				//滚动加载图
				this.viewerContent.on('scroll.scrollLoadImg', function () {
					var that = $(this);
					if (timer) {
						clearTimeout(timer);
					}
					timer = setTimeout(function () {
						viewerContentST = that.scrollTop();
						that.find('.viewer-img').each(function (i, v) {
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
								img.onload = function () {
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

		}, {
			key: 'pageJump',
			value: function pageJump(num) {
				var _self = this;
				num = num || 1;
				this.pageNum.val(num);
				var sTTo = function sTTo(num) {
					_self.viewerContent.scroll();
					_self.viewerContent.scrollTop($('.viewer-item').outerHeight(true) * (num - 1));
					_self.viewerContentOT = _self.viewerContent.offset().top;
				};
				sTTo(num);
				this.arrowRight.on('click', function (e) {
					num = _self.pageNum.val();
					if (num < _self.imgTotal) {
						num++;
						sTTo(num);
						_self.pageNum.val(num);
					}
					e.preventDefault();
				});
				this.arrowLeft.on('click', function (e) {
					num = _self.pageNum.val();
					if (num > 1) {
						num--;
						sTTo(num);
						_self.pageNum.val(num);
					}
					e.preventDefault();
				});
				//绑定回车事件
				this.pageNum.on('focus.pageNum', function () {
					doc.on('keyup.pageNum', function (e) {
						var code = e.keyCode || e.which || e.charCode;
						if (code === 13) {
							num = _self.pageNum.val();
							if (isNaN(num)) {
								return;
							}
							num = num <= 0 ? 1 : num;
							num = num > _self.imgTotal ? _self.imgTotal : num;
							_self.pageNum.val(num);
							sTTo(num);
						}
					});
				});
				this.pageNum.on('blur.pageNum', function () {
					doc.off('keyup.pageNum');
				});
			}
			/**
	   * [updateNum 更新页数]
	   * @return {[type]} [description]
	   */

		}, {
			key: 'updateNum',
			value: function updateNum() {
				var imgH = this.viewerContent.find('.viewer-item').outerHeight(),
				    viewerContentST = this.viewerContent.scrollTop(),
				    num = Math.ceil((viewerContentST - imgH) / imgH) + 1;
				if (num === 0) {
					num = 1;
				}
				this.pageNum.val(num);
			}
			/**
	   * [scaling 缩放]
	   * @return {[type]} [description]
	   */

		}, {
			key: 'scaling',
			value: function scaling(percentageVal) {
				percentageVal = percentageVal || '100';
				this.percentage.val(percentageVal + '%');
				var scalingBarW = this.scalingBar.width(),
				    scalingBarH = this.scalingBar.height(),
				    scalingLineW = this.scalingLine.width(),
				    scalingLinePL = this.scalingLine.position().left,
				    _self = this;
				this.scalingBar.on('mousedown.bar', function (e) {
					var scalingLinePT = _self.scalingLine.position().top,
					    scalingLineOL = _self.scalingLine.offset().left;
					doc.on('mousemove.bar', function (e) {
						window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						var left = e.pageX - scalingLineOL + scalingBarW / 2,
						    top = scalingLinePT - scalingBarH / 2;
						if (left <= scalingLinePL) {
							left = scalingLinePL;
						}
						if (left >= scalingLinePL + scalingLineW - scalingBarW) {
							left = scalingLinePL + scalingLineW - scalingBarW;
						}
						//设置百分比
						var percentageVal = (_self.rangeTo - _self.rangeFrom) * (left - scalingLinePL) / (scalingLineW - scalingBarW) + _self.rangeFrom;
						_self.percentage.val(parseInt(percentageVal) + '%');
						//设置图片大小
						$('.viewer-item').css({
							width: percentageVal / 100 * _self.imgW,
							height: percentageVal / 100 * _self.imgH
						});
						_self.scalingBar.css({
							top: top,
							left: left
						});
						_self.viewerContent.scroll();
					});
					doc.off('mouseup.bar').bind('mouseup.bar', function () {
						doc.off('mousemove.bar');
					});
				});
				//设置scalingBar位置
				var setScalingBarPo = function setScalingBarPo(percentageVal) {
					var left = (percentageVal - _self.rangeFrom) * (scalingLineW - scalingBarW) / (_self.rangeTo - _self.rangeFrom) + scalingLinePL;
					_self.scalingBar.css({
						left: left
					});
				};
				setScalingBarPo(100);
				//绑定回车事件
				var scaleTo = function scaleTo() {
					percentageVal = parseInt(_self.percentage.val());
					percentageVal = percentageVal > _self.rangeTo ? _self.rangeTo : percentageVal;
					percentageVal = percentageVal < _self.rangeFrom ? _self.rangeFrom : percentageVal;
					_self.percentage.val(percentageVal + '%');
					setScalingBarPo(percentageVal);
					$('.viewer-item').css({
						width: percentageVal / 100 * _self.imgW,
						height: percentageVal / 100 * _self.imgH
					});
					_self.viewerContent.scroll();
				};
				scaleTo();
				this.percentage.on('focus.percentage', function () {
					doc.on('keyup.percentage', function (e) {
						var code = e.keyCode || e.which || e.charCode;
						if (code === 13) {
							scaleTo();
						}
					});
				});
				this.percentage.on('blur.percentage', function () {
					doc.off('keyup.percentage');
				});
			}
			/**
	   * [updateViewerContentData 更新ViewerContent数据]
	   */

		}, {
			key: 'updateViewerContentData',
			value: function updateViewerContentData() {
				this.viewerContentOT = this.viewerContent.offset().top;
				this.viewerContentH = this.viewerContent.height();
			}
			/**
	   * [setFullScreen 设置全屏]
	   */

		}, {
			key: 'setFullScreen',
			value: function setFullScreen() {
				var _self = this,
				    timer = null;
				//存原始样式
				var viewerWrapW = _self.viewerWrap.width(),
				    viewerWrapH = _self.viewerWrap.height();
				_self.viewerWrap.before('<div class="viewer-record-pos" style="width:0px;height:0px;overflow:hidden;"></div>');
				var viewerRecordPos = $('.viewer-record-pos');
				//重置样式
				var setFullScreenData = function setFullScreenData() {
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
				this.fullScreen.on('click', function () {
					setFullScreenData();
					win.on('scroll.fullScreen, resize.fullScreen', function () {
						if (timer) {
							clearTimeout(timer);
						}
						timer = setTimeout(function () {
							setFullScreenData();
						}, 100);
					});
				});
				//退出全屏
				doc.on('keyup.exitFullScreen', function (e) {
					var code = e.keyCode || e.which || e.charCode;
					if (code === 27) {
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

		}, {
			key: 'pageDrag',
			value: function pageDrag() {
				var _self = this;
				$('.viewer-item').on('mousedown.pageDrag', function (e) {
					var startX = e.pageX + _self.viewerContent.scrollLeft(),
					    startY = e.pageY + _self.viewerContent.scrollTop();
					doc.on('mousemove.pageDrag', function (e) {
						window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						var moveX = startX - e.pageX,
						    moveY = startY - e.pageY;
						_self.viewerContent.scrollLeft(moveX);
						_self.viewerContent.scrollTop(moveY);
					});
					doc.off('mouseup.pageDrag').bind('mouseup.pageDrag', function () {
						doc.off('mousemove.pageDrag');
					});
					return false;
				});
			}
		}]);

		return Viewer;
	}();

	exports.default = Viewer;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\nhtml {\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  font-size: 100%; }\n\na {\n  cursor: pointer;\n  outline: 0 none; }\n\n:active {\n  outline: 0; }\n\n:visited {\n  outline: 0; }\n\n:link, :visited, ins {\n  text-decoration: none; }\n\n[hidden] {\n  display: none; }\n\nbody {\n  margin: 0;\n  background: #FFF;\n  font-family: Arial, '\\5FAE\\8F6F\\96C5\\9ED1'; }\n\ndl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, select, textarea, p, blockquote, th, td,\narticle, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n  margin: 0;\n  padding: 0; }\n\nfieldset, iframe {\n  border: 0 none; }\n\nimg {\n  border: 0 none;\n  -ms-interpolation-mode: bicubic;\n  vertical-align: middle; }\n\naddress, caption, cite, code, dfn, em, i, th, var, optgroup {\n  font-style: normal; }\n\nh1, h2, h3, h4, h5, h6, code, kbd, samp, tt, sup, sub, small, input, button, textarea, select {\n  font-size: 100%; }\n\nabbr, acronym {\n  border: 0 none;\n  font-variant: normal; }\n\ninput, button, textarea, select, optgroup, option {\n  font-family: inherit;\n  font-size: inherit;\n  font-style: inherit;\n  font-weight: inherit; }\n\ntextarea {\n  overflow: auto;\n  vertical-align: top;\n  resize: vertical; }\n\ntextarea, input, select {\n  outline: 0 none; }\n\nol, ul, li, menu {\n  list-style: none outside none; }\n\ntable {\n  width: 100%;\n  border-collapse: collapse;\n  border-spacing: 0; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after, q:before, q:after {\n  content: '';\n  content: none; }\n\nmark {\n  background-color: #FF6; }\n\ndel {\n  text-decoration: line-through; }\n\nabbr[title], dfn[title] {\n  border-bottom: 1px dotted;\n  cursor: help; }\n\ninput, select, button {\n  vertical-align: middle; }\n\nbutton {\n  width: auto;\n  cursor: pointer;\n  overflow: visible; }\n\ninput[type=checkbox],\ninput[type=radio] {\n  box-sizing: border-box; }\n\nbutton::-moz-focus-inner,\ninput[type=file] > input[type=button]::-moz-focus-inner {\n  border: 0 none;\n  padding: 0; }\n\n.viewer-control {\n  *zoom: 1; }\n  .viewer-control:before, .viewer-control:after {\n    display: table;\n    content: \"\";\n    line-height: 0; }\n  .viewer-control:after {\n    clear: both; }\n\n.viewer-control .arrow-left, .viewer-control .arrow-right, .viewer-control .input-text, .viewer-control span, .viewer-control .scaling, .viewer-control .full-screen, .viewer-control .fit-width {\n  float: left;\n  display: inline; }\n\n.viewer {\n  width: 800px;\n  border: #8a8a8a 1px solid;\n  box-shadow: 2px 2px 5px #8a8a8a; }\n\n.viewer-control {\n  height: 25px;\n  line-height: 25px;\n  border-bottom: #8a8a8a 1px solid;\n  background-color: #f9f9f9;\n  font-size: 12px; }\n  .viewer-control .arrow-left, .viewer-control .arrow-right {\n    width: 0;\n    height: 0;\n    overflow: hidden;\n    border: #f9f9f9 6px solid;\n    display: block;\n    cursor: pointer;\n    margin: 6px 0 0 0; }\n  .viewer-control .arrow-left {\n    border-right-color: #6b6b6b;\n    margin-right: 8px; }\n  .viewer-control .arrow-right {\n    border-left-color: #6b6b6b;\n    margin-left: 8px; }\n  .viewer-control .input-text {\n    width: 38px;\n    padding-left: 5px;\n    height: 19px;\n    border: #d3d5d6 1px solid;\n    color: #0b333c;\n    margin-top: 2px; }\n  .viewer-control span {\n    margin-left: 5px; }\n  .viewer-control .line {\n    display: block;\n    width: 1px;\n    height: 21px;\n    overflow: hidden;\n    border-left: #999 1px dotted;\n    border-right: #999 1px dotted;\n    margin-top: 2px; }\n  .viewer-control .scaling {\n    width: 95px;\n    height: 25px;\n    float: left;\n    position: relative; }\n  .viewer-control .scaling-line {\n    width: 76px;\n    height: 1px;\n    overflow: hidden;\n    border: #919999 1px solid;\n    border-radius: 2px;\n    position: absolute;\n    left: 10px;\n    top: 11px; }\n  .viewer-control .scaling-bar {\n    width: 8px;\n    height: 8px;\n    overflow: hidden;\n    border: #4a75bf 1px solid;\n    border-radius: 100%;\n    position: absolute;\n    left: 10px;\n    top: 7px;\n    background-color: #73b0e1;\n    cursor: pointer;\n    box-shadow: 1px 1px 2px #73b0e1; }\n  .viewer-control .full-screen {\n    width: 13px;\n    height: 12px;\n    overflow: hidden;\n    margin: 6px 0 0 7px;\n    cursor: pointer; }\n    .viewer-control .full-screen i {\n      display: block;\n      overflow: hidden; }\n  .viewer-control .fs-t {\n    width: 9px;\n    height: 6px;\n    border: #666 2px solid; }\n  .viewer-control .fs-c {\n    width: 7px;\n    height: 1px;\n    border-top: #b2b2b2 1px solid;\n    margin: 0 auto; }\n  .viewer-control .fs-b {\n    width: 9px;\n    height: 1px;\n    border-top: #878787 1px solid;\n    margin: -1px auto 0; }\n  .viewer-control .fit-width {\n    width: 13px;\n    height: 13px;\n    border: #8a8a8a 1px solid;\n    margin: 5px 0 0 8px;\n    cursor: pointer;\n    overflow: hidden;\n    position: relative; }\n    .viewer-control .fit-width i {\n      display: block;\n      position: absolute; }\n  .viewer-control .fw-l-arrow, .viewer-control .fw-r-arrow {\n    width: 0;\n    height: 0;\n    overflow: hidden;\n    border: #f9f9f9 3px solid; }\n  .viewer-control .fw-l-arrow {\n    border-right-color: #5f5f5f;\n    top: 4px;\n    left: -3px; }\n  .viewer-control .fw-r-arrow {\n    border-left-color: #5f5f5f;\n    top: 4px;\n    right: -3px; }\n  .viewer-control .fw-l-line, .viewer-control .fw-r-line {\n    height: 0px;\n    width: 3px;\n    overflow: hidden;\n    border-top: #5f5f5f 1px solid;\n    left: 3px;\n    top: 6px; }\n  .viewer-control .fw-r-line {\n    left: 7px; }\n\n.viewer-content {\n  height: 893px;\n  background-color: #abb4b4;\n  overflow-y: auto; }\n  .viewer-content .viewer-item {\n    margin: 6px auto 0;\n    overflow: hidden;\n    background: url(\"/src/images/loading.gif?v=201606031701\") no-repeat center 20px; }\n    .viewer-content .viewer-item img {\n      width: 100%; }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;