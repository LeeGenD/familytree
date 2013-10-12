/*
  familytree 0.1.0 <http://leegend.github.com>
  Copyright (c) 2013 Li Quan (@leegend)
*/
(function(window,document){

var _familytree = {},
some1
;

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
	
	function addMember(info,opt,id){
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
			"id":	id,
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
	
	function inRelation( relation){
		for( _i = 0; _i < member_relation.length; _i++){
			var r = member_relation[ _i];
			if( relation.m1 == r.m1 && relation.m2 == r.m2){
				return true;
			}
			if( relation.m1 == r.m2 && relation.m2 == r.m1){
				return true;
			}
		}
		return false;
	}
	
	function addRelation( m1, m2, description ){
		var relation = {
			"m1":	m1,
			"m2":	m2,
			"description":	description,
		}
		if( ! inRelation( relation) ){
			member_relation.push( relation );
		}
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
	_frameImg,
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
		initImg();
		/*
		cvs.addEventListener("mousemove",shift.move);
		cvs.addEventListener("mousedown",shift.start);
		cvs.addEventListener("mouseup",shift.end);
		*/
		shift.bind(document.body);
		zoom.bind(document.body);
		client.bind(cvs);
	}
	
	function initImg(){
		_frameImg = document.createElement("img");
		_frameImg.src = "./img/frame.png";
		document.body.appendChild(_frameImg);
		
		_this._infoTop = document.createElement("img");
		_this._infoTop.src = "./img/head.png"
		document.body.appendChild(_this._infoTop);
		
		_this._infoMid = document.createElement("img");
		_this._infoMid.src = "./img/mid.png"
		document.body.appendChild(_this._infoMid);
		
		_this._infoBottom = document.createElement("img");
		_this._infoBottom.src = "./img/footer.png"
		document.body.appendChild(_this._infoBottom);
	}
	
	var client = (function(){
		var _clientX = 0, _clientY = 0;
		
		function setClient(event){
			_clientX = event.clientX;
			_clientY = event.clientY;
		}
		
		function getClient(){
			return {
				"x":	_clientX,
				"y":	_clientY,
			}
		}
		
		function getArea(){
			var x = _clientX / _zoomPer - _moveX, y = _clientY / _zoomPer - _moveY;
			
			return {
				"minX":	x - 180,
				"maxX":	x,
				"minY":	y - 207,
				"maxY":	y,
			}
		}
		
		function inArea( x, y){
			var area = getArea();
			if( x > area.minX && x < area.maxX && y > area.minY && y < area.maxY ){
				return true;
			}
		}
		
		function bind(dom){
			dom.addEventListener("mousemove",setClient);
		}		
		
		return {
			"bind":	bind,
			"getClient":	getClient,
			"getArea":	getArea,
			"inArea":	inArea,
		}
	})()
	
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
			
			var minPer = 0.3;
			
			if( _zoomPercentage <= minPer ){
				_zoomPercentage = minPer;
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
			dom.addEventListener( "mousewheel", zoom);
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
	    ctx.lineWidth=width*_zoomPer;
	    ctx.moveTo(x1,y1);
	    ctx.lineTo(x2,y2);
	    ctx.stroke();
	}
	
	function drawMemberInfo(member){
		var myClient = client.getClient(),
		/*
		x = member.data.posX + _moveX + 100,
		y = member.data.posY + _moveY + 100;
		x *= _zoomPer, y *= _zoomPer;
		*/
		x = myClient.x, y = myClient.y;
		
		ctx.drawImage( _this._infoTop, x, y, 228, 18);
		
		ctx.drawImage( _this._infoMid, x, y+18, 229, 15);
		var top_offset = 28;
		ctx.font = "15px AxureHandwritingRegular";
		for(var o in member){
			if( o != "data" && (typeof member[o] == "string" || typeof member[o] == "number")){
				ctx.drawImage( _this._infoMid, x, y+top_offset, 229, 15);
				ctx.fillText( o + ":" + member[o], x+15, y+top_offset);
				top_offset += 15;
			}
		}
		//ctx.drawImage( _this._infoMid, x, y+18, 229, 5);
		ctx.drawImage( _this._infoBottom, x, y+top_offset, 229, 23);
	}
	
	function drawAllLine(){
	
	}
	
	function drawMember(head_img,x,y){
		x += _moveX, y += _moveY;
		x *= _zoomPer, y *= _zoomPer;
		
		drawHead(head_img,x+22*_zoomPer,y+12*_zoomPer);
		drawPhotoFrame(x,y);
	}
	
	function clear(){
		//alert(width);
		ctx.clearRect( 0, 0, _width, _height);
	}
	
	function returnMove(){
		return {
			moveX:	_moveX,
			moveY:	_moveY,
		}
	}
	
	init(dom);
	
	return {
		"drawLine":	drawLine,
		"drawHead":	drawHead,
		"drawMember":	drawMember,
		"drawMemberInfo":	drawMemberInfo,
		"clear":	clear,
		"setBoundary"	:shift.setBoundary,
		"getArea":	client.getArea,
		"inArea":	client.inArea,
		"returnMove":	returnMove,
	}
	
}

//计算导向力的函数
_familytree.main.force_directed = (function(){
	
	function getDistance(x1,y1,x2,y2){
		var d2 = Math.pow( x1-x2, 2) + Math.pow( y1-y2, 2);
		return Math.sqrt(d2);
	}
	
	//gravitation:the farther the bigger
	/*
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
	*/
	function getGravitation(x1,y1,x2,y2,remote){
		var distance = getDistance(x1,y1,x2,y2);
		if( distance < remote){
			return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
			}
		}
		var value = {
			"left":	0,
			"top":	0,
		}
		var speed=(distance/remote-1)*10;
		speed/=distance;
		value.left=speed*(x1-x2);
		value.top=speed*(y1-y2);
		var x = {
			x1: - value.left,
			y1: - value.top,
			x2: value.left,
			y2: value.top,
		};
		//alert( JSON.stringify(x) );
		return {
			x1: - value.left,
			y1: - value.top,
			x2: value.left,
			y2: value.top,
		}
	}
	
	//Repulsion:the closer the bigger
	/*
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
	*/
	
	function Random( x, y){
		return x + Math.random() * ( y - x );
	}
	
	function getRepulsion(x1,y1,x2,y2,remote){
		var value = {
			"left":	0,
			"top":	0,
		}
		var r=1;
		//如果两点重合，让点获得随机的加速度
		if(x1==x2&&y1==y2){
			var sign=Random(0,4);
			if(sign<1){
				value.left=Random(0,r);
				value.top=Random(0,r);
			}
			else if(sign<2){
				value.left=Random(0,r);
				value.top=-Random(0,r)
			}
			else if(sign<3){
				value.left=-Random(0,r);
				value.top=Random(0,r);
			}
			else{
				value.left=-Random(0,r);
				value.top=-Random(0,r);
			}
			/*
			alert( JSON.stringify({x1: - value.left,
				y1: - value.top,
				x2: value.left,
				y2: value.top,}));
			*/
			return {
				x1: value.left,
				y1: value.top,
				x2: - value.left,
				y2: - value.top,
			}
		}

		//如果两点有距离
		var distance = getDistance(x1,y1,x2,y2);
		var speed=(1-distance/remote)*10;
		//如果距离太大则没有加速度
		if(speed<0){
			return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
			}
		}
		speed/=distance;
		value.left=speed*(x1-x2);
		value.top=speed*(y1-y2);
		return {
			x1: value.left,
			y1: value.top,
			x2: - value.left,
			y2: - value.top,
		}
		return value;
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
		},
		fac = 5;
		
		//所有元素之间都有斥力
		for( var _i = 0; _i < member_len ; _i++ ){
			var m1 = member[ _i],
			x1 = m1.data.posX,
			y1 = m1.data.posY;
			
			for( var _j = _i+1; _j < member_len ; _j++ ){
				var m2 = member[ _j],
				x2 = m2.data.posX,
				y2 = m2.data.posY;
			
			
				var repulsion = _familytree.main.force_directed.getRepulsion(x1,y1,x2,y2,900);
			
				//var alert_div = document.getElementById("alert");
				//alert_div.innerHTML = JSON.stringify(gravitation)+JSON.stringify(repulsion);
				//repulsion = zero;
				//gravitation = zero;
			
				_member.setMemberPos( m1, x1+(repulsion.x1*fac), y1+(repulsion.y1*fac));
				_member.setMemberPos( m2, x2+(repulsion.x2*fac), y2+(repulsion.y2*fac));
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
			_member.setMemberPos( m1, x1+(repulsion.x1*fac), y1+(repulsion.y1*fac));
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
			
			var gravitation = _familytree.main.force_directed.getGravitation(x1,y1,x2,y2,200),
			repulsion = _familytree.main.force_directed.getRepulsion(x1,y1,x2,y2,3000);
			
			//repulsion = zero;
			//gravitation = zero;
			
			_member.setMemberPos( m1, x1+(gravitation.x1*fac), y1+(gravitation.y1*fac));
			_member.setMemberPos( m2, x2+(gravitation.x2*fac), y2+(gravitation.y2*fac));
		}
		
		//设置边界（需优化）
		var minX = minY = 9999,
		maxX = maxY = -9999;
		
		var pos = _canvas.getArea();
		var alert_div = document.getElementById("alert");
		//alert_div.innerHTML = JSON.stringify(JSON.stringify(pos));
		//alert_div.innerHTML = JSON.stringify(JSON.stringify(pos)+JSON.stringify(member[0].data));
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
			if( _canvas.inArea( x, y) ){
				_canvas.drawMemberInfo(m);
				//alert_div.innerHTML = JSON.stringify("!!!"+JSON.stringify(pos)+JSON.stringify(m.id));
			}
		}
		//alert_div.innerHTML = JSON.stringify("minX:" + parseInt(minX) + ",maxX:" + parseInt(maxX) + ",minY:" + parseInt(minY) + ",maxY:" + parseInt(maxY) +JSON.stringify(_canvas.returnMove()));
		//_canvas.setBoundary( minX, maxX, minY, maxY);//设置鼠标滑动边界
		//alert( _canvas.setBoundary );
	}
	
	function Animation(){
		drawAllMember();
		forceMove();
	}
	
	function initData(){
		_member.addMember( member_data[ 0 ] , {
			"type":"random",
			"minX":100,
			"maxX":900,
			"minY":100,
			"maxY":300,
		},0);
		/*
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
		*/
	}
	function getRelations(x){
		var relations_arr = [];
		
		for( var _i = 0; _i < relations.length ; _i++ ){
			if( relations[ _i][0] == x ){
				relations_arr.push(relations[ _i][1]);
			}
			if( relations[ _i][1] == x ){
				relations_arr.push(relations[ _i][0]);
			}
		}
		
		return relations_arr;
	}
	function giveBranch(){
		var member = _member.getAllMember();
		//alert( JSON.stringify(member[0]) );
		var member_len = member.length;
		
		for( var _i = 0; _i < member_len; _i++ ){
			var rel_arr = getRelations(member[ _i].id);
			
			for( var _j = 0; _j < rel_arr.length; _j++){
				//alert( _j );
				
				for( var _k = 0; _k < member.length; _k++){
					//alert( member[ _k].id+","+rel_arr[ _j]);
					if( member[ _k].id == rel_arr[ _j] ){
						break;
					}
				}
				
				//alert( _k+",,,"+member.length );
				if( _k == member.length){
					if( rel_arr[ _j] == 7 ){
						//continue;
					}
					_member.addMember( member_data[ rel_arr[ _j] ] , {
						"type":"random",
						"minX":100,
						"maxX":900,
						"minY":100,
						"maxY":300,
					},rel_arr[ _j]);
					//alert( rel_arr[ _j] );
					_member.addRelation( member[ _i], member[ member.length-1], "relation");
				}
				else{
					_member.addRelation( member[ _i], member[ _k], "relation");
				}
				
			}
		}
	}
	document.getElementById("branch_btn").addEventListener("click",giveBranch);
	initData();
	
	setInterval(Animation,20);
	
}

})(window,document);