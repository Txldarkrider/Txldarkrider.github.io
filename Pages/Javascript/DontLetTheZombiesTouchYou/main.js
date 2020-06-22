let canvas = document.getElementById("game");

canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "grey";
canvas.width = canvas.height = 720;

let ctx = canvas.getContext("2d");

let p = new Player(canvas.width/2,canvas.height/2,32,32,"coral");
let e = [];

randomnum = (min,max) =>{
    return Math.random() * (max - min) + min;
};

function spawnEnemies(){
	for(let i=0; i<randomnum(5,10); i++){
		
		let x1 = randomnum(-32,-32);
		let x2 = randomnum(canvas.width,canvas.width);
		let p1 = Math.trunc(randomnum(0,5));
		
		if(p1 <= 2){
			
			e.push(new Enemy(x1,randomnum(-32,canvas.height + 32),randomnum(16,32),randomnum(16,32),"green",0,p));
		}
		if(p1 >= 3){
			e.push(new Enemy(x2,randomnum(-32,canvas.height + 32),randomnum(16,32),randomnum(16,32),"green",0,p));
		}
		// alert();
	}
}

function start(){
	spawnEnemies();
	setInterval(spawnEnemies,2500);
	
	update();
}

function TestCollision(e1,e2){
	return (e1.x < e2.x + e2.w && e1.x + e1.w > e2.x && e1.y < e2.y + e2.h && e1.y + e1.h > e2.y);
}

function update(){
	requestAnimationFrame(update);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	p.update(ctx,canvas,{width:canvas.width,height:canvas.height});
	
	for(let key in e){
		e[key].update(ctx);
		if(TestCollision(p,e[key])){
			e = [];
			p.bullets = [];
			p.x = canvas.width/2;
			p.y = canvas.height/2;
			p.score = 0;
			return;
		}
		for(let key1 in p.bullets){
			if(TestCollision(e[key],p.bullets[key1])){
				e[key].hp -= p.damage;
				delete p.bullets[key1];
				p.score += 1;
				if(e[key].hp <= 0){
					delete e[key];
				}
				break;
			}
		}
		for(let key1 in e){
			if(e[key] === e[key1]){continue}else{
				e[key1].collide(e[key]);
			}
		}
	}
}

document.addEventListener("keydown",(evt)=>{
	p.getKeyDown(evt);
});
document.addEventListener("keyup",(evt)=>{
	p.getKeyUp(evt);
});
document.addEventListener("mousemove",(evt)=>{
	// let mx = evt.clientX - document.getElementById('canvas').getBoundingClientRect().left;
	
	p.mouseMove(evt);
});
document.addEventListener("mousedown",(evt)=>{
	p.mouseDown(evt);
});
document.addEventListener("mouseup",(evt)=>{
	p.mouseUp(evt);
});

// You could also use an array
//Mutiple keypresses dectected i dont think i need it yet
// onkeydown = onkeyup = function(e){
//     e = e || event; // to deal with IE
//     p.keys[e.keyCode] = e.type == 'keydown';
   
//   	if(p.keys[16]){
//   		p.maxSpd = p.defaultspd * 2;
//   	}else{
//   		p.maxSpd = p.defaultspd;
//   	}
  	
//   	if(p.keys[65]){
// 			p.spd.x = -p.maxSpd;
// 		}else if(p.keys[68]){
// 			p.spd.x = p.maxSpd;
// 		}
// 		else if(p.keys[87]){
// 			// alert();
// 			p.spd.y = -p.maxSpd;
// 		}else if(p.keys[83]){
// 			p.spd.y = p.maxSpd;
// 		}else {
// 			p.spd.y = 0;
// 			p.spd.x = 0;
// 			p.keys = {};
// 		}
		
		
// };

start();