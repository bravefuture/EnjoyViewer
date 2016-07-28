# EnjoyViewer 
## 仿pdf阅读器
html结构：
```html
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
```

实例化：
```javascript
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
	callback: function(index){
		console.log && console.log(index);
	},
	viewerH: 893,
	imgW: 655,
	rangeFrom: 30, //以100为基准
	rangeTo: 500,
	blankImg: 'images/blank_img.gif',
	zIndex: 3,
	scale: 100
});
```

方法：
 1. 跳转页
   viewer.pageJump(3);
 2. 缩放页
   viewer.scaling(120);
