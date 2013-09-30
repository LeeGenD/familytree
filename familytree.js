/*
  familytree 0.1.0 <http://leegend.github.com>
  Copyright (c) 2013 Li Quan (@leegend)
*/
(function(window,document){

var _familytree = {},
_frameImg,
some1
;

_frameImg = document.createElement("img");
_frameImg.src = "./img/frame.png";
document.body.appendChild(_frameImg);

_familytree.fn = function(){
	//save data
	var ft_stack = [];
	
};

_familytree.fn.Extend = function(options, defaults){
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			defaults[key] = options[key];
		}	
	}
	return defaults;
}

_familytree.main = function(canvas){
	var _canvas = canvas;
};

_familytree.main.member = function(){
	
	var member_stack = [];
	var member_relation = [];
	
	function addMember(info,opt){
		var options = {
			type:"normal",//random
			minX:0,
			minY:0,
			maxX:0,
			maxY:0,
		}
		var information = {
			"name":	"member",
			"sex":	"unknow",
			"age":	"unknow",
			"img":	"",
			"data":	{
				posX:500,
				posY:200,
				position:	"normal",
			}
		}
		
		options = _familytree.fn.Extend(opt,options);
		
		if( options.type == "random" ){
			var x = options.minX + Math.random() * ( options.maxX - options.minX ),
			y = options.minY + Math.random() * ( options.maxY - options.minY );
			information.data.posX = x , information.data.posY = y;
		}
		
		information = _familytree.fn.Extend(info ,information);
		
		member_stack.push(information);
	}
	
	function addRelation( m1, m2, description ){
		var relation = {
			"m1":	m1,
			"m2":	m2,
			"description":	description,
		}
		member_relation.push( relation );
	}
	
	function setMemberPos(member,x,y){
		//alert( member.data.position );
		if( member.data.position == "fixed" ){
			return false;
		}
		member.data.posX = x;
		member.data.posY = y;
		return member;
	}
	
	function getAllMember(){
		return member_stack;
	}
	
	function getRelation(){
		return member_relation;
	}
	
	return {
		"addMember":	addMember,
		"getAllMember":	getAllMember,
		"setMemberPos":	setMemberPos,
		"addRelation":	addRelation,
		"getRelation":	getRelation,
	}
}

//canvas的操作
_familytree.main.cvs = function(dom){
	var cvs,
	ctx,
	_width,
	_height,
	_moveX = 0, _moveY = 0,
	_zoomPer = 1,
	_this = this;
	
	function init(dom){
		//false,"",null,undefined
		if( !dom ){
			return this;
		}
		if( dom.tagName != "CANVAS" ){
			return this;
		}
		cvs = dom, ctx = dom.getContext("2d"), _width = dom.getAttribute("width"), _height = dom.getAttribute("height");
		
		ctx.strokeStyle="#dadada";
		/*
		cvs.addEventListener("mousemove",shift.move);
		cvs.addEventListener("mousedown",shift.start);
		cvs.addEventListener("mouseup",shift.end);
		*/
		shift.bind(document.body);
		zoom.bind(document.body);
	}
	
	function _shift(event){
		var x = event.clientX,
		y = event.clientY;
		_moveX = -x+500, _moveY = -y+500;
	}
	
	var shift = (function(){
		var _startX = 0,
		_startY = 0,
		_distanceX = 0,
		_distanceY = 0,
		_boundary = {
			"minX":	-9999,
			"maxX":	9999,
			"minY":	-9999,
			"maxY":	9999,
		},
		_shiftBool = false;
		
		function setMoveOffset(x,y){
			var moveX = _moveX - x,
			moveY = _moveY - y;
			if( moveX > _boundary.minX && moveX < _boundary.maxX ){
				_moveX -= x;
			}
			if( moveY > _boundary.minY && moveY < _boundary.maxY ){
				_moveY -= y;
			}
		}
		function start(event){
			_shiftBool = true;
			var x = event.clientX,
			y = event.clientY;
			_startX = x, _startY = y;
		}
		function move(event){
			if( !_shiftBool ){
				return false;
			}
			var x = event.clientX,
			y = event.clientY;
			
			_distanceX = x - _startX, _distanceY = y - _startY;
			
			setMoveOffset( _distanceX, _distanceY);
			
			_startX = x, _startY = y;
		}
		function end(){
			_shiftBool = false;
		}
		function bind(dom){
			dom.addEventListener("mousemove",move);
			dom.addEventListener("mousedown",start);
			dom.addEventListener("mouseup",end);
		}
		function setBoundary(minX,maxX,minY,maxY){
			if( minX !== false ){
				_boundary.minX = minX;
			}
			if( maxX !== false ){
				_boundary.maxX = maxX;
			}
			if( minY !== false ){
				_boundary.minY = minY;
			}
			if( maxY !== false ){
				_boundary.maxY = maxY;
			}
		}
		
		return {
			"start":	start,
			"move":	move,
			"end":	end,
			"bind":	bind,
			"setBoundary":	setBoundary,
		}
	})()
	
	var zoom = (function(){
		var _zoomPercentage = 1,
		a;
		
		function enlarge(event){
			_zoomPercentage += 0.1;
			if( _zoomPercentage >= 1 ){
				_zoomPercentage = 1;
			}
		}
		
		function reduce(event){
			_zoomPercentage -= 0.1;
			if( _zoomPercentage <= 0.1 ){
				_zoomPercentage = 0.1;
			}
		}
		
		function zoom(e){
			e.wheel = (e.wheelDelta? e.wheelDelta : -e.detail) > 0? 1 : -1;// 通过事件判断鼠标滚轮反向，1是向上，-1是向下
			e.wheelDir = e.wheel > 0? 'up' : 'down';    //这个只是描述 e.wheel的值和滚轮方向的关系
			
			if( e.wheelDir == "up" ){
				enlarge();
			}
			else if( e.wheelDir == "down" ){
				reduce();
			}
			_zoomPer = _zoomPercentage;
		}
		
		function bind(dom){
			dom.addEventListener( "DOMMouseScroll", zoom);
		}
		
		return {
			"zoomPercentage":	_zoomPercentage,
			"bind":	bind,
		}
	})()
	
	function drawPhotoFrame(x,y){
		ctx.drawImage( _frameImg, x, y, 180*_zoomPer, 207*_zoomPer);
	}
	
	function drawHead(head_img,x,y){
		ctx.drawImage( head_img, x, y, 137*_zoomPer, 137*_zoomPer);
	}
	
	function drawLine(x1,y1,x2,y2,width){
		x1 += _moveX+90, y1 += _moveY+206, x2 += _moveX+90, y2 += _moveY+206;
		x1 *= _zoomPer, y1 *= _zoomPer, x2 *= _zoomPer, y2 *= _zoomPer;
		
		width = typeof width == Number ? width : 5; 
		ctx.beginPath();
	    ctx.lineWidth=width;
	    ctx.moveTo(x1,y1);
	    ctx.lineTo(x2,y2);
	    ctx.stroke();
	}
	
	function drawAllLine(){
	
	}
	
	function drawMember(head_img,x,y){
		x += _moveX, y += _moveY;
		x *= _zoomPer, y *= _zoomPer;
		
		drawHead(head_img,x+22,y+12);
		drawPhotoFrame(x,y);
	}
	
	function clear(){
		//alert(width);
		ctx.clearRect( 0, 0, _width, _height);
	}
	
	init(dom);
	
	return {
		"drawLine":	drawLine,
		"drawHead":	drawHead,
		"drawMember":	drawMember,
		"clear":	clear,
		"setBoundary"	:shift.setBoundary,
	}
	
}

//计算导向力的函数
_familytree.main.force_directed = (function(){
	
	function getDistance(x1,y1,x2,y2){
		var d2 = Math.pow( x1-x2, 2) + Math.pow( y1-y2, 2);
		return Math.sqrt(d2);
	}
	
	//gravitation:the farther the bigger
	function getGravitation(x1,y1,x2,y2,min_distance){
		var distance = getDistance(x1,y1,x2,y2);
		//alert("g_"+distance);
		if( min_distance > distance || !min_distance ){
			return {
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0,
		}
		}
		var factor = {
			x:(x1-x2)/distance,
			y:(y1-y2)/distance,
		}
		return {
			x1: - distance * factor.x,
			y1: - distance * factor.y,
			x2: distance * factor.x,
			y2: distance * factor.y,
		}
	}	
	
	//Repulsion:the closer the bigger
	function getRepulsion(x1,y1,x2,y2,dis){
		var distance = getDistance(x1,y1,x2,y2);
		var factor = {
			x:(x1-x2)/distance,
			y:(y1-y2)/distance,
		}
		distance = dis - distance;
		distance = distance > 0 ? distance : 0;
		//alert("r_"+distance);
		return {
			x1: distance * factor.x,
			y1: distance * factor.y,
			x2: - distance * factor.x,
			y2: - distance * factor.y,
		}
	}
	
	return {
		"getGravitation":	getGravitation,
		"getRepulsion":		getRepulsion,
	}
})()

//_familytree.fn.cvs(document.getElementById("ft_canvas"));
window.familytree = function(canvas,opts,member_data,relations){
	var _canvas = _familytree.main.cvs(canvas),
	_member = _familytree.main.member(),
	options = {
	
	},
	some;
	
	options = _familytree.fn.Extend(opts, options);
	
	function drawAllLine(){
		var member = _member.getAllMember();
		for( var _i = 0; _i = member.length ; _i++ ){
			_canvas.drawLine(0,0,10,10);
		}
	}
	
	function drawAllMember(){
		_canvas.clear();
		var member = _member.getAllMember(),
		relations = _member.getRelation();
		for( var _i = 0; _i < relations.length ; _i++ ){
			var m1 = relations[ _i ].m1,
			m2 = relations[ _i ].m2,
			x1 = m1.data.posX,
			y1 = m1.data.posY,
			x2 = m2.data.posX,
			y2 = m2.data.posY;
			_canvas.drawLine( x1, y1, x2, y2, 10);
			//alert( x1+","+y1+","+x2+","+y2 );
		}
		for( var _i = 0; _i < member.length ; _i++ ){
			var m = member[ _i ];
			_canvas.drawMember( m.img , m.data.posX , m.data.posY );
		}
	}
	
	function forceMove(){
		var member = _member.getAllMember(),
		member_len = member.length,
		first_member = member[0],
		relations = _member.getRelation(),
		relations_len = relations.length;
		
		var zero = {
			x1:	0,
			y1:	0,
			x2:	0,
			y2:	0,
		}
		
		//所有元素之间都有斥力
		for( var _i = 0; _i < member_len ; _i++ ){
			var m1 = member[ _i],
			x1 = m1.data.posX,
			y1 = m1.data.posY;
			
			for( var _j = _i+1; _j < member_len ; _j++ ){
				var m2 = member[ _j],
				x2 = m2.data.posX,
				y2 = m2.data.posY;
			
			
				var repulsion = _familytree.main.force_directed.getRepulsion(x1,y1,x2,y2,1000);
			
				//var alert_div = document.getElementById("alert");
				//alert_div.innerHTML = JSON.stringify(gravitation)+JSON.stringify(repulsion);
				//repulsion = zero;
				//gravitation = zero;
			
				_member.setMemberPos( m1, x1+(repulsion.x1*0.01), y1+(repulsion.y1*0.01));
				_member.setMemberPos( m2, x2+(repulsion.x2*0.01), y2+(repulsion.y2*0.01));
			}
			
			/*
			var gravitation = _familytree.main.force_directed.getGravitation(x1,y1,1000,1000,200);
			_member.setMemberPos( m1, x1+(gravitation.x1*0.01), y1+(gravitation.y1*0.01));
			*/
			
			//第一个点作为中心点
			if( _i == 0 ){
				continue;
			}
			var repulsion = _familytree.main.force_directed.getRepulsion(x1,y1,first_member.data.posX,first_member.data.posY,1000);
			_member.setMemberPos( m1, x1+(repulsion.x1*0.01), y1+(repulsion.y1*0.01));
		}
		
		//只有有关系元素的有引力
		for( var _i = 0; _i < relations.length ; _i++ ){
			//alert( JSON.stringify( relations[ _i] ) );
			var m1 = relations[ _i ].m1,
			m2 = relations[ _i ].m2,
			x1 = m1.data.posX,
			y1 = m1.data.posY,
			x2 = m2.data.posX,
			y2 = m2.data.posY;
			
			var gravitation = _familytree.main.force_directed.getGravitation(x1,y1,x2,y2,100),
			repulsion = _familytree.main.force_directed.getRepulsion(x1,y1,x2,y2,300);
			
			var alert_div = document.getElementById("alert");
			alert_div.innerHTML = JSON.stringify(gravitation)+JSON.stringify(repulsion);
			//repulsion = zero;
			//gravitation = zero;
			
			_member.setMemberPos( m1, x1+(gravitation.x1*0.01), y1+(gravitation.y1*0.01));
			_member.setMemberPos( m2, x2+(gravitation.x2*0.01), y2+(gravitation.y2*0.01));
		}
		
		//设置边界（需优化）
		var minX = minY = 9999,
		maxX = maxY = -9999;
		for( var _i = 0; _i < member_len ; _i++ ){
			var m = member[ _i],
			x = m.data.posX,
			y = m.data.posY;
			if( x < minX ){
				minX = x;
			}
			if( x > maxX ){
				maxX = x;
			}
			if( y < minY ){
				minY = y;
			}
			if( y > maxY ){
				maxY = y;
			}
		}
		_canvas.setBoundary( minX, maxX, minY, maxY);
		//alert( _canvas.setBoundary );
	}
	
	function Animation(){
		drawAllMember();
		forceMove();
	}
	
	function initData(){
		for( var _i = 0; _i < member_data.length ; _i++ ){
			_member.addMember( member_data[ _i ] , {
				"type":"random",
				"minX":100,
				"maxX":900,
				"minY":100,
				"maxY":300,
			
			});
		}
		var member = _member.getAllMember();
		for( var _i = 0; _i < relations.length ; _i++ ){
			_member.addRelation( member[ relations[_i][0] ], member[ relations[_i][1] ], "relation");
		}
	}
	initData();
	
	setInterval(Animation,10);
	
}

})(window,document);