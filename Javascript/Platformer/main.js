let canvas = document.getElementById("game");
canvas.style.position = "absolute";

canvas.style.margin = "auto";

canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "grey";
canvas.width = 720;
canvas.height = 720;

let ctx = canvas.getContext("2d");


let level =
[
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0,0,0,0,0,1],
	[0,0,0,3,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
	[1,1,1,1]
];

let tiles = [];

function MakeLevel(WhatLevel,pushto){
	for(let x=0; x<WhatLevel.length; x++){
		for(let y=0; y<WhatLevel[x].length; y++){
			if(WhatLevel[x][y] === 1){
				pushto.push(new Rect(y*32,x*32,32,32));
			}
			if(WhatLevel[x][y] === 2){
				pushto.push(new Tri(y*32,x*32,32,32,0));
			}
			if(WhatLevel[x][y] === 3){
				pushto.push(new Tri(y*32+32,x*32,32,32,1));
			}
		}
	}
}

// let p1 = new Platform(32,0,128,128);
// let r1 = new Rect(196,128,32,32);
// let t1 = new Tri(128,128,32,32,1);

let player = new Player(0,0,32,32);

function line_intersects(b1,b2) {

    var s1_x, s1_y, s2_x, s2_y;
    s1_x = b1.x2 - b1.x1;
    s1_y = b1.y2 - b1.y1;
    s2_x = b2.x2 - b2.x1;
    s2_y = b2.y2 - b2.y1;

    var s, t;
    s = (-s1_y * (b1.x1 - b2.x1) + s1_x * (b1.y1 - b2.y1)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (b1.y1 - b2.y1) - s2_y * (b1.x1 - b2.x1)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }

    return false; // No collision
}

function start(){
	MakeLevel(level,tiles);
	update();
}

function update(){
	requestAnimationFrame(update);
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// t1.draw(ctx);
	
	
	// alert(player instanceof Player);
	for(let key in player.body.body){
		for(let key1 in tiles){
			if(tiles[key1] instanceof Tri){
				if(line_intersects(player.body.body[key],tiles[key1].body[2])){
					
					// player.updatePos(0,player.MaxSpd);
					player.spd.y *= 0;
					player.updatePos(0,-1 - player.spd.y - player.g);
					
				}
				if(line_intersects(player.body.body[key],tiles[key1].body[1])){
					
					player.updatePos(0,-player.MaxSpd);
					
				}
				if(line_intersects(player.body.body[key],tiles[key1].body[0])){
					
					player.updatePos(player.MaxSpd,0);
					
				}
			}
			if(tiles[key1] instanceof Rect){
				
				// if(line_intersects(player.body.body[key],tiles[key1].body[3])){
					
				// 	player.updatePos(-player.MaxSpd,0);
					
				// }
				// if(line_intersects(player.body.body[key],tiles[key1].body[2])){
					
				// 	player.updatePos(player.MaxSpd,0);
					
				// }
				if(line_intersects(player.body.body[key],tiles[key1].body[1])){
					
					player.updatePos(0,player.MaxSpd);
					
				}
				if(line_intersects(player.body.body[key],tiles[key1].body[0])){
					
					// player.g = 0;
					// player.body.body[1] = tiles[key1].body[0];
					
					player.updatePos(0,-player.spd.y - player.g);
					player.spd.y = 0;
				}
				
			}
		}
	}
	
	for(let key in tiles){
		tiles[key].draw(ctx);
	}
	player.update(ctx);
}


document.addEventListener("keydown",(evt)=>{
	if(evt.key === "a"){
		player.spd.x = -player.MaxSpd;
	}if(evt.key === "d"){
		player.spd.x = player.MaxSpd;
	}
	
	if(evt.key === " "){
		// player.g = 0.2;
		for(let key in player.body.body){
			// player.body.body[key].x1 += 10;
			// player.body.body[key].x2 += 10;
			player.body.body[key].y1 -= 10;
			player.body.body[key].y2 -= 10;
			
		}
		player.spd.y = -10;
	}
	
});
document.addEventListener("keyup",(evt)=>{
	if(evt.key === "a"){
		player.spd.x = 0;
	}if(evt.key === "d"){
		player.spd.x = 0;
	}
	
	
});

start();