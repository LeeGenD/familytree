function FamilyTree(){
    
    var that = _family = this;
    
    this.node_array = [],
    this.node_move_left = [], this.node_move_top = [],
    this.default_head_img = document.createElement( "img");
    this.default_head_img.src = "./element/head/default.png";
    
    this.canvas = document.getElementById("node_canvas"),
    this.ctx = document.getElementById("node_canvas").getContext("2d"),
    this.info_canvas = document.getElementById("node_info"),
    
    this.img_fix = {
	top : 10, left : 19,
    },
    this.zoom_fac = 1;//缩放比例
    this.size = {
	width : 200, height : 234,
	half_width : 100 , half_height : 117,
	o_width : 200,

	img_width : 166,
    },
    this.remote = this.size.width*5,//care
    this.banner_width = 166,
    this.banner_height = 166,
    this.diswidth_banner_body = ( this.banner_width - this.size.width) / 2,
    this.disheight_banner_body = 130,
    this.line = {
	width : 5,
	bg_width : 2,
    },
    this.gravity = 96, this.mass = 3, this.max_distance = 512;

    this.NodeInfo = function(){
	var that = this;
	//base_info
	/*
	[
		{
			type: xxx, value:yyy,
		
		}
	,...]
	*/
	this.base_info = [];
	this.younger = 1;//是否有小弟
	this.child = 1;//是否已产生小弟
	this.children = null;//子节点信息
	this.canvas = document.getElementById("node_info");
	this.ctx = null;//this.canvas.getContext("2d");
	return this;
    };
    this.NodeInfo.prototype = {
	init : function( data){
	    if( !data){
		this.name = "UniqueStudio";
		return this;
	    }
	    this.name=data.name;
	    this.base_info = data.base_info;
		this.children = data.children;
	    if(data.younger!="0")this.younger=1;
	    else this.younger = 0;
	    var len = _family.Random(0,1000);//care
	    var img = document.createElement("img");
	    img.src = "./element/head/"+data.imgname;
	    this.img = img;
	    img.onerror = (function( info){
		return function(){
		    info.img = null;
		}
	    })(this)
	    return this;
	}
    };

    this.TreeNode = function( id, left, top, node, father){
	var that = this;
	this.tree_node = node;
	this.left = left;
	this.top = top;
	this.id = id;
	this.node = node;
	
	this.width = null;
	
	this.father = father||null;
	this.neighbors = 1;
	this.child = 1;
	this.info = new _family.NodeInfo();
	this.birth = false;
	
	return this;
	    
    };
    this.TreeNode.prototype = {
	set_info : function( data){
	    this.info.init( data);
	    return this;
	},
    }
    this.TreeNode.prototype.create_children = function( data){
	var len = data.length;
	this.info.child = 0;
	//this.info.younger = 0;//care
	var i, angle;
	
	var x1,y1,x2,y2,distance;
	if( this.father != null){
	    x1 = this.left;
	    y1 = this.top;
	    x2 = this.father.left;
	    x2 = this.father.top;
	    distance = _family.Distance.point_to_point( x1, y1, x2, y2);
	}
	else angle = _family.Random( 0, 360)*0.017453293;
	
	angle = _family.Random( 0, 360)*0.017453293;
	
	var angle_plus = 360 / len * 0.017453293;

	for( i = 0; i < len; i++){
	    distance = _family.Random(5,15);
	    var child_node = new _family.TreeNode( this.id+"_"+i, this.left+distance*Math.sin( angle), this.top+distance*Math.cos( angle), null, this);
	    child_node.set_info( data[ i]);
	    _family.node_array.push( child_node);
	    _family.node_move_left.push(0);
	    _family.node_move_top.push(0);
	
	    angle += angle_plus;
	}

	this.birth = true;
    }

    var animate = (function(){
	
	function move_init(){
	    for( var i=0,len=_family.node_array.length; i<len; i++){
		_family.node_move_left[ i] = 0;
		_family.node_move_top[ i] = 0;
	    }
	}
	function calculate(){
	    var len = _family.node_array.length;
	    var speed,node1,node2;
	    var x1,y1,x2,y2;
	    var fac = _family.zoom_fac;

	    for( var i = 0; i < len; i++){//care 1 or 0?
		node1 = _family.node_array[ i];
		if( node1.father){
		    node2 = node1.father;
		    speed = _family.Distance.tension( node1.left, node1.top, node2.left, node2.top, 600*fac);
		    _family.node_move_left[ i] += speed.left;
		    _family.node_move_top[ i] += speed.top;
		}

		speed = _family.Distance.root_repulsion( node1.left, node1.top, 30*fac);
		_family.node_move_left[ i] += speed.left;
		_family.node_move_top[ i] += speed.top;
		//console.log("!@#");
		
		//console.log( [speed.left,speed.top]);
		//console.log( _family.node_move_left[0]);

		for( var j = i+1; j < len; j++){
		    node2 = _family.node_array[ j];
		    speed = _family.Distance.repulsion( node1.left, node1.top, node2.left, node2.top, 450*fac);
		    _family.node_move_left[ i] += speed.left;
		    _family.node_move_top[ i] += speed.top;
		    _family.node_move_left[ j] -= speed.left;
		    _family.node_move_top[ j] -= speed.top;
		    
		}
	    }
	    var f_left = _family.node_move_left[ 0],
	    f_top = _family.node_move_top[ 0];

	    for( var i = 0; i < len; i++){//care 1 or 0?
		//_family.node_move_left[ i] -= f_left;
		//_family.node_move_top[ i] -= f_top;
		
		_family.node_move_left[ i] *= 0.5;
		_family.node_move_top[ i] *= 0.5;
		
	    }
	    
	    //_family.node_move_left[ 0] = 0;
	    //_family.node_move_top[ 0] = 0;
	    //console.log( JSON.stringify( _family.node_move_left));
	}

	function apply(){
	    var len = _family.node_array.length;
	    for( var i = 0; i < len; i++){
		var node = _family.node_array[ i];
		node.left += _family.node_move_left[ i] || 0;
		node.top += _family.node_move_top[ i] || 0;
	    }
	}

	return {
	    result : function(){
		move_init();
		calculate();
		apply();
	    }
	}

    })()

    var draw = (function(){
	var _draw = {};
	_draw.canvas = document.getElementById("node_canvas");
	_draw.ctx = document.getElementById("node_canvas").getContext("2d");
	_draw.line_width = 5;
	_draw.line_bg_width = 5;
	_draw.node_size = {
	    width: 200,
	    half_width: 100,
	    height: 234,
	}

	_draw.focus_node = null;
	_draw.focus_pos = {
	    x : null, 
	    y: null,
	};

	function set_focus_node( node, x, y){
	    _draw.focus_node = node;
	    x = x || null;
	    y = y || null;
	    _draw.focus_pos.x = x;
	    _draw.focus_pos.y = y;
	}

	function draw_node( node){

	    var img,fac = _family.zoom_fac;
	    var img_fix_top = _family.img_fix.top * fac,
	    img_fix_left = _family.img_fix.left * fac,
	    img_width = _family.size.img_width * fac;

	    if( fac == 1){
		img = document.getElementById("img");
	    }
	    else if( fac == 0.5){
		img = document.getElementById("img_small");
	    }
	    else{
		img = document.getElementById("img_small2");
	    }//care

	    var font_size = 24*fac;
	    font_size = font_size > 10 ? font_size : 11;
	    var font_fix_left = 15*fac,font_fix_top = 191*fac,
	    img_half_width = _family.size.half_width * fac;

	    _draw.ctx.fillStyle = "#656c74";
	    if( node.info.img){
		_draw.ctx.drawImage( node.info.img, node.left+img_fix_left, node.top+img_fix_top, img_width, img_width);
	    }
	    else{
		_draw.ctx.drawImage( _family.default_head_img, node.left+img_fix_left, node.top+img_fix_top, img_width, img_width);
	    }
	    _draw.ctx.drawImage( img, node.left, node.top, _family.size.width, _family.size.height);
	    _draw.ctx.font = font_size+"px AxureHandwritingRegular";
	    _draw.ctx.textAlign = "center";
	    _draw.ctx.fillText( node.info.name, node.left+img_half_width, node.top+font_fix_top);//care
	    _draw.ctx.beginPath();
	}

	function draw_line(){
	    _draw.ctx.strokeStyle = "#ffffff";
	    var fac = _family.zoom_fac;
	    var half_width = _draw.node_size.half_width * fac,
	    height = (_draw.node_size.height-15) * fac,
	    line2_fix = 3 * fac,
	    line_bg_width = _draw.line_bg_width * fac;


	    for( var i=1,len=_family.node_array.length; i<len; i++){
		var node = _family.node_array[ i];
		if( node.father){
		    _draw.ctx.beginPath();
		    _draw.ctx.lineWidth = line_bg_width;
		    _draw.ctx.moveTo( node.left+half_width, node.top+height);
		    _draw.ctx.lineTo( node.father.left+half_width, node.father.top+height);
		    _draw.ctx.stroke();
		}
	    }
	    _draw.ctx.save();
	    _draw.ctx.strokeStyle = "#dadada";
	    for( var i=1,len=_family.node_array.length; i<len; i++){
		var node = _family.node_array[ i];
		if( node.father){
		    _draw.ctx.beginPath();
		    _draw.ctx.lineWidth = line_bg_width;
		    _draw.ctx.moveTo( line2_fix+node.left+half_width, line2_fix+node.top+height);
		    _draw.ctx.lineTo( line2_fix+node.father.left+half_width, line2_fix+node.father.top+height);
		    _draw.ctx.stroke();
		}
	    }
	    _draw.ctx.save();
	}

	function draw_focus_line(){
	    if( _draw.focus_node){
		var node = _draw.focus_node;
		var fac = _family.zoom_fac;
		var half_width = _draw.node_size.half_width * fac,
		height = (_draw.node_size.height-15) * fac,
		line2_fix = 3 * fac,
		line_bg_width = _draw.line_bg_width * fac;
		
		_draw.ctx.beginPath();
		_draw.ctx.lineWidth = _draw.line_width;
		_draw.ctx.strokeStyle = "#b5d6ff";
		while( node.father){

		    _draw.ctx.moveTo( node.left+half_width, node.top+height);
		    _draw.ctx.lineTo( node.father.left+half_width, node.father.top+height);

		    node = node.father;
		}

		_draw.ctx.stroke();
		_draw.ctx.save();
	    }
	}

	function createImg( src){
	    var img = document.createElement("img");
	    img.src = src;
	    return img;
	}

	function draw_focus_info(){
	    
	    if( !_draw.focus_node){
		return false;
	    }
	    var x = _draw.focus_pos.x || _draw.focus_node.left, 
	    y = _draw.focus_pos.y || _draw.focus_node.top,
	    info = _draw.focus_node.info;

	    var head_height = 23,
	    footer_height = 23,
	    mid_height = 5;
	    
	    var write = function( type, detail){
		if( detail && detail!='0'){
			//draw "type"
			_draw.ctx.font = "normal normal bold 14px AxureHandwritingRegular";
			_draw.ctx.drawImage( info_mid, x, y);
		    _draw.ctx.drawImage( info_mid, x, y + mid_height);
		    _draw.ctx.drawImage( info_mid, x, y + 2*mid_height);
		    _draw.ctx.drawImage( info_mid, x, y + 3*mid_height);
		    _draw.ctx.fillText( type+"：", x+24, y+3*mid_height);
			y += 4*mid_height;
			
			//draw "detail"
			_draw.ctx.font = "14px AxureHandwritingRegular";
			var len = detail.length, type_length = type.length,
			step = 13;
			for( var i = 0; i < len; i += step){
		    _draw.ctx.drawImage( info_mid, x, y);
		    _draw.ctx.drawImage( info_mid, x, y + mid_height);
		    _draw.ctx.drawImage( info_mid, x, y + 2*mid_height);
		    _draw.ctx.drawImage( info_mid, x, y + 3*mid_height);
		    
		    _draw.ctx.fillText( detail.substring( i, i+step), x+24, y+3*mid_height);
		    y += 4*mid_height;
			}
		}
	    }
	    var write_head = function(){
		
		_draw.ctx.drawImage( info_head, x, y);	
		y += head_height;
		
	    }
	    var write_name = function(){
		_draw.ctx.font = "20px AxureHandwritingRegular";

		_draw.ctx.drawImage( info_mid, x, y);
		_draw.ctx.drawImage( info_mid, x, y + mid_height);
		_draw.ctx.drawImage( info_mid, x, y + 2*mid_height);
		
		_draw.ctx.fillText( info.name, x+24, y+6);

		switch(info.team){
		case "pm":_draw.ctx.fillStyle="#f3e2aa";break;
		case "design":_draw.ctx.fillStyle="#ffceba";break;
		case "it":_draw.ctx.fillStyle="#a7dec9";break;
		case "sde":_draw.ctx.fillStyle="#d4e6e8";break;
		case "alg":_draw.ctx.fillStyle="#faf0d7";break;
		case "嵌入式":_draw.ctx.fillStyle="#f3e2aa";break;
		}
		_draw.ctx.fillRect(x+24,y+3*mid_height-4,180,4);
		y += 3*mid_height;
	    }
	    
	    var info_head = document.getElementById("info_head"),//createImg( "./element/header.png"),
	    info_mid = document.getElementById("info_mid"),//createImg( "./element/mid.png"),
	    info_footer = document.getElementById("info_footer");//createImg( "./element/footer.png");

	    _draw.ctx.textAlign = "left";
	    
	    write_head();	   
		write_name();

	    _draw.ctx.font = "14px AxureHandwritingRegular";
	    
		for( var key in info.base_info){
			write( info.base_info[ key]['type'], info.base_info[ key]['value']);
		}
	    
	    //write_name();
	    _draw.ctx.drawImage( info_footer, x, y);
		
	}

	function clear_all(){
	    var height=document.documentElement.clientHeight;
	    var width=document.documentElement.clientWidth;
	    height = $("#node_canvas").height();
	    width = $("#node_canvas").width();
	    //console.log( width+','+height);
	    _draw.ctx.clearRect( 0,0,width,height);
	}

	return {
	    all : function(){
		clear_all();
		
		draw_line();

		draw_focus_line();

		var len = _family.node_array.length;
		for( var i=0; i < len; i++){
		    var node = _family.node_array[ i];
		    draw_node( node);
		}

		draw_focus_info();

	    },

	    set_focus_node : set_focus_node,

	    hi : function(){
		alert("hi");
	    },
	}
    })()

    var listener = (function(){
	
	var _listener = {};
	_listener.canvas = document.getElementById("node_canvas");
	_listener.move_start = false;
	
	_listener.startX = 0;
	_listener.startY = 0;

	function bind( obj, event, func, pop){
	    if( document.addEventListener){
		obj.addEventListener( event, func, pop);
	    }
	    else{
		obj.attachEvent( 'on'+event, func);
	    }
	}

	function remove_event( obj, event, func, pop){
	    if( document.removeEventListener){
		obj.removeEventListener( event, func, pop);
	    }
	    else{
		obj.detachEvent( event, func);
	    }
	}

	function find_node( event){
	    var x = event.clientX, y = event.clientY;
	    var len = _family.node_array.length;
	    for( var i = 0; i < len; i++){
		var node = _family.node_array[ i];
		//alert( [x,y,node.left,node.left + _family.size.width,node.top,node.top+_family.size.height].join(','));
		if( node.left < x && node.left + _family.size.width > x && node.top < y && node.top + _family.size.height > y){
		    return node;
		}
	    }
	    return null;
	}//care
	
	function give_branch( event){

	    var node = find_node( event);
	    if( node && !_listener.move_start){
		_family.give_branch( node);
	    }
	}

	function screen_move_start( event){
	    if( event.button == 1 || event.button == 0){
		
	    }
	    else{
		return false;
	    }
	    _listener.move_start = false;
	    _listener.startX = event.clientX;
	    _listener.startY = event.clientY;
	    bind( _listener.canvas, "mousemove", screen_move, false);
	    //bind( document.body, "mousemove", screen_move, false);
	}
	
	function screen_move( event){
	    _family.move_all( _listener.startX - event.clientX, _listener.startY - event.clientY);
	    _listener.startX = event.clientX;
	    _listener.startY = event.clientY;
	    _listener.move_start = true;
	}

	function screen_move_end( event){
	    _listener.move_start = false;
	    remove_event( _listener.canvas, "mousemove", screen_move, false);
	}

	//鼠标滚轮缩放功能
	function wheel_scale( e){
	    e.stopPropagation();
	    e.preventDefault();
	    var e = window.event || e;
	    var detail = e.wheelDelta || -e.detail;
	    var factor = 2;

	    if( detail < 0){
		if( _family.zoom_fac <= 0.125){
		    return false;
		}
		factor = 0.5;
	    }
	    else if( _family.size.o_width == _family.size.width){
		return false;
	    }

	    _family.zoom( factor, e.clientX, e.clientY);
	}

	function show_hover( event){
	    var node = find_node( event);
	    if( node){
		$(_listener.canvas).css({'cursor':'pointer'});
	    }
	    else{
		$(_listener.canvas).css({'cursor':'default'});
	    }
	    draw.set_focus_node( node, event.clientX, event.clientY);
	}

	bind( _listener.canvas, "click", give_branch, false);
	bind( _listener.canvas, "mousedown", screen_move_start, false);
	bind( _listener.canvas, "mouseup", screen_move_end, false);
	bind( _listener.canvas, "mouseout", screen_move_end, false);
	
	bind( _listener.canvas, "mousewheel", wheel_scale, false);
	bind( _listener.canvas, "DOMMouseScroll", wheel_scale, false);
	
	bind( _listener.canvas, "mousemove", show_hover, false);
	
    })()

    $(document).click( function(){
	//animate.result();
	//draw.all();
    });
    setInterval( function(){
	animate.result();
	draw.all();
    }, 50);
    
}
FamilyTree.prototype.alert = (function(){
    var status = 0;
    return {
	open : function( message){
	    if( status)return 0;
	    var width = 150;
	    var alert_info_width = width - 32;//care
	    $("#alert .content").html( message);
	    $("#alert").css({"width":width+"px"}).animate({"top":"0px"},"slow");
	    status = 1;
	},
	close : function(){
	    if( status)$("#alert").animate({"top":"-56px"},"slow");
	    status = 0;
	},
    }
})()

FamilyTree.prototype.Speed = function( left, top){
    this.left = left;
    this.top = top;
    return this;
}

FamilyTree.prototype.Random = function( min, max){
    return Math.random()*(max-min)+min;
}

FamilyTree.prototype.Distance = {
    //两点的距离
    point_to_point : function( x1, y1, x2, y2){
	var x = x1 - x2;
	var y = y1 - y2;
	return Math.sqrt( x*x+y*y);
    },
    //点到直线的距离【1】若点在直线下则为正值【2】否则为负值
    //line(x1,y1,x2,y2) to point(x3,y3)
    line_to_point : function( x1, y1, x2, y2, x3, y3){
	if( x1 == x2){
	    if( x3 > x1)return -Math.abs(x3-x1);
	    else return Math.abs(x3-x1);
	}
	var k = (y2-y1)/(x2-x1);
	var dis = Math.abs( k*(x3-x1)+y1-y3)/Math.sqrt( k*k+1);
	if( k*(x3-x1)+y1 > y3)return -dis;
	return dis;
    },
    //根节点的斥力
    root_repulsion : function( x, y, power){
	
	power = power || 20;
	
	var f_x = _family.node_array[0].left,
	f_y = _family.node_array[0].top;

	var distance = _family.Distance.point_to_point( x, y, f_x, f_y);
	var repulsive_force = power / distance;
	var df = power - distance;

	if( distance){
	    //repulsive_force *= Math.log( df);
	    return new _family.Speed( 
		repulsive_force * ( x - f_x ), 
		repulsive_force * ( y - f_y )
	    );
	}
	return new _family.Speed( 0, 0);
    },
    //根据两点间的距离给出加速度(斥力)
    repulsion : function( x1, y1, x2, y2, remote){
	
	var distance = _family.Distance.point_to_point( x1, y1, x2, y2);
	
	if( distance > remote){
	    return new _family.Speed( 0, 0);
	}
	// max( df) = 202.5
	var df =  ( remote - distance)*( remote - distance) / 1000;
	if( df > 100){
	    df = 100 + Math.log(df - 100)
	}
	df /= distance;
	return new _family.Speed( df*(x1-x2), df*(y1-y2));
    },

    //拉力
    tension : function( x1, y1, x2, y2, remote){
	var distance = this.point_to_point( x1, y1, x2, y2);
	distance -= remote;
	distance = distance > 0 ? distance : 0;
	var speed = new _family.Speed( -(x1-x2)*distance/4000, -(y1-y2)*distance/4000);
	//console.log( "ten:"+(x1-x2)*distance/4000+","+(y1-y2)*distance/4000);
	return speed;
    },
}
FamilyTree.prototype.create_node = function( data){
    var left = $(window).width()/2-100, top = $(window).height()/2-100;
    var node = new this.TreeNode( 1, left, top, null, null);
    node.set_info( data);
	console.log( data);
    this.node_array.push( node);
    this.node_move_left.push(0);
    this.node_move_top.push(0);
}

FamilyTree.prototype.data = {
	name : "One Piece",
	imgname : "onepeice.png",
	base_info : [{
		type : "背景介绍",
		value : "拥有财富、名声、权力，这世界上的一切的男人--海贼王哥尔·D·罗杰，在被行刑受死之前说了一句话，让全世界的人都涌向了大海。想要我的宝藏吗？如果想要的话，那就到海上去找吧，我全部都放在那里。"
	}],
	children : [
		{
			name : "海军本部",
			imgname : "hjbb.png",
			base_info : [
			
			],
			children : [
				{
					name : "赤犬",
					imgname : "cq.png",
					base_info : [
						{ type : "职位", value : "元帅" },
					],
					children : [
						{
							name : "黄猿",
							imgname : "hy.png",
							base_info : [
								{ type : "职位", value : "大将" }
							]
						},
						{
							name : "藤虎",
							imgname : "th.png",
							base_info : [
								{ type : "职位", value : "大将" }
							]
						},
						{
							name : "绿牛？",
							base_info : [
								{ type : "职位", value : "大将" }
							]
						},
					]
				},
			]
		},
		{
			name : "四皇",
			imgname : "sh.png",
			base_info : [
			],
			children:[
				{
					name : "香克斯",
					imgname : "sks.png",
					base_info : [],
					children : [],
				},
				{
					name : "蒂奇",
					imgname : "hhz.png",
					base_info : [],
					children : [],
				},
				{
					name : "凯多",
					imgname : "kd.png",
					base_info : [],
					children : [],
				},
				{
					name : "夏洛特·玲玲",
					imgname : "bm.png",
					base_info : [],
					children : [],
				}
			]
		},
		{
			name : "王下七武海",
			imgname : "wxqwh.png",
			base_info : [
			],
			children : [
				{
					name : "波雅·汉库克",
					imgname : "hkk.png",
					base_info : [],
					children : [],
				},
				{
					name : "乔拉可尔·米霍克",
					imgname : "mhk.png",
					base_info : [],
					children : [],
				},
				{
					name : "堂吉诃德·多弗朗明哥",
					imgname : "tjkd.png",
					base_info : [],
					children : [],
				},
				{
					name : "巴索罗缪·熊",
					imgname : "x.png",
					base_info : [],
					children : [],
				},
				{
					name : "巴基",
					imgname : "bj.png",
					base_info : [],
					children : [],
				},
				{
					name : "???",
					base_info : [],
					children : [],
				},
				{
					name : "???",
					base_info : [],
					children : [],
				}
			]
		},
		{
			name : "草帽海贼团",
			imgname : "cmhzt.png",
			base_info : [
			
			],
			children : [
				{
					name : "蒙奇·D·路飞",
					imgname : "lf.png",
					base_info : [
						{ type : "职位", value : "船长"},{ type : "爱好", value : "肉"},
					],
					children : [],
				},
				{
					name : "罗罗诺亚·索隆",
					imgname : "sl.png",
					base_info : [
						{ type : "职位", value : "战斗员"},{ type : "爱好", value : "剑术"},
					],
					children : [],
				},
				{
					name : "娜美",
					imgname : "nm.png",
					base_info : [
						{ type : "职位", value : "航海家"},{ type : "爱好", value : "钱"},
					],
					children : [],
				},
				{
					name : "乌索普",
					imgname : "wsp.png",
					base_info : [
						{ type : "职位", value : "狙击手"},{ type : "爱好", value : "说谎"},
					],
					children : [],
				},
				{
					name : "山治",
					imgname : "sz.png",
					base_info : [
						{ type : "职位", value : "厨师"},{ type : "爱好", value : "美女"},
					],
					children : [],
				},
				{
					name : "托尼托尼·乔巴",
					imgname : "qb.png",
					base_info : [
						{ type : "职位", key : "船医"},{ type : "爱好", value : "棉花糖"},
					],
					children : [],
				},
				{
					name : "妮可·罗宾",
					imgname : "lb.png",
					base_info : [
						{ type : "职位", value : "考古学家"},{ type : "爱好", value : "历史"},
					],
					children : [],
				},
				{
					name : "弗兰奇",
					imgname : "flq.png",
					base_info : [
						{ type : "职位", value : "船工"},{ type : "爱好", value : "变态"},
					],
					children : [],
				},
				{
					name : "布鲁克",
					imgname : "blk.png",
					base_info : [
						{ type : "职位", value : "音乐家"},{ type : "爱好", value : "看内裤"},
					],
					children : [],
				},
			
			]
		}
	]
	
};

FamilyTree.prototype.give_branch = function( node){
	if( node.info.children && node.info.children.length ){
		console.log( node.info.children);
		if( node.info.child){
			node.create_children( node.info.children);
		}
		else{
			_family.alert.open("已显示");
			setTimeout( _family.alert.close, 2000);
		}
	}
	else{
		_family.alert.open("没有后续数据");
		setTimeout( _family.alert.close, 2000);
	}
	return 0;
	
    var xmlhttp = null;
    if( window.XMLHttpRequest){
	xmlhttp = new XMLHttpRequest();
    }
    else if( window.ActiveXObject){
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if( xmlhttp != null){
	if( !node.info.child){
	    return 0;
	}
	else if( !node.info.younger){//care
	    this.alert.open("此人没有小弟");
	    setTimeout(this.alert.close,2000);
	    return 0;
	}
	else{
	    this.alert.open("加载中...");
	};
	xmlhttp.onreadystatechange = function(){
	    _family.alert.close();
	    if( xmlhttp.readyState == 4){
		if( xmlhttp.status == 200){
		    var data = JSON.parse( xmlhttp.responseText);
		    if( data.length){
			node.create_children( data);
		    }
		}
	    }
	}
	xmlhttp.open("GET","/givebranch?mydata="+node.info.name,true);
	xmlhttp.send(null);
    }
    else{
	this.alert.open("sorry");
	setTimeout(this.alert.close,2000);
    }
}

FamilyTree.prototype.move_all = function( x, y){
    for( var i=0,len = this.node_array.length; i<len; i++){
	var node = this.node_array[ i];
	node.top -= y;
	node.left -= x;
    }
}
FamilyTree.prototype.zoom = function( factor, orginX, orginY){
    orginX = orginX || 0;
    orginY = orginY || 0;

    this.size.width *= factor;
    this.size.height *= factor;
    this.zoom_fac *= factor;

    for( var count=0,len=this.node_array.length; count<len; count++){
	this.node_array[count].left= orginX + (this.node_array[count].left-orginX) * factor;//2*that.node_array[count].left-left;
	this.node_array[count].top= orginY + (this.node_array[count].top-orginY) * factor;//2*that.node_array[count].top-top;
    }
}

var ft = new FamilyTree;
ft.create_node( FamilyTree.prototype.data);

$(window).resize(resizeCanvas);
 
 function resizeCanvas() {
 
		var canvas = $("#node_canvas");
 
        canvas.attr("width", $(window).get(0).innerWidth);
 
        canvas.attr("height", $(window).get(0).innerHeight);
 
        //context.fillRect(0, 0, canvas.width(), canvas.height());
 
 };
 
 resizeCanvas();