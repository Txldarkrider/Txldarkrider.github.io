//Get reference to the canvas
let canvas = document.getElementById("game");
//Put canvas in the middle of the screen
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "grey";

//Set canvas width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");


let World = {
	scl:32,
	tiles : [],
	LvlNum:0,
	levels :
	[
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1],
		],
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2],
			[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1],
		],
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,1,1,1,0,0,1,0,0,0,0,1,1,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1],
		],
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
		],
		
	]
	
};

function TestCollision(e1,e2){
	return e1.x < e2.x + e2.w && e1.x + e1.w > e2.x && e1.y < e2.y + e2.h && e1.y + e1.h > e2.y;
}

function GenerateWorld(Level,tiles,player,scl){
	for(let i=0; i<Level.length; i++){
		for(let j=0; j<Level[i].length; j++){
			if(Level[i][j] === 1){
				tiles.push(new Tile(j*80,i*32,80,32,"","Assets/SciFiPlatform.png",1,false,true));
			}
			if(Level[i][j] === 2){
				tiles.push(new Tile(j*80,(i*32)-95,32,128,"","Assets/WinningFlag.gif",2,false,false));
			}
			if(Level[i][j] === 99){
				tiles.push(new Tile(j*scl,i*scl,scl,scl,"","",99,false,false));
				player.x = j *scl;
				player.y = i *scl;
			}
		}
	}
}

let player = new Player(0,0,World.scl,World.scl*2,"coral");
// let tile = new Tile(0,0,World.scl,World.scl);

let Setup = () => {
	GenerateWorld(World.levels[World.LvlNum],World.tiles,player,World.scl);
};

let Update = () =>{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(let key in World.tiles){
		World.tiles[key].update(ctx);
		if(World.tiles[key].hasCollision){
			if(TestCollision(World.tiles[key].collision.ColTop,player)){
				player.canJump = true;
				player.spd.y = -player.g-0.5;
				// player.y -= player.g;
			}
			if(TestCollision(World.tiles[key].collision.ColRight,player)){
				player.x -= player.MaxSpd;
			}
			if(TestCollision(World.tiles[key].collision.ColLeft,player)){
				player.x += player.MaxSpd;
			}
			if(TestCollision(World.tiles[key].collision.ColBottom,player)){
				player.spd.y = 0;
			}
		}
		if(World.tiles[key].id === 2 && TestCollision(World.tiles[key],player)){
			World.tiles = [];
			World.LvlNum += 1;
			GenerateWorld(World.levels[World.LvlNum],World.tiles,player,World.scl);
		}
		
	}
	
	player.update(ctx);
	if(player.y >= 1000){
		for(let key in World.tiles){
			if(World.tiles[key].id === 99){
				player.x = World.tiles[key].x;
				player.y = World.tiles[key].y;
			}
		}
	}
};

document.addEventListener("keydown",(evt)=>{
	if(evt.key === "a"){
		player.movementKeys.a = true;
	}
	if(evt.key === "d"){
		player.movementKeys.d = true;
	}
	if(evt.key === " "){
		// alert();
		player.movementKeys.space = true;
	}
});
document.addEventListener("keyup",(evt)=>{
	if(evt.key === "a"){
		player.movementKeys.a = false;
	}
	if(evt.key === "d"){
		player.movementKeys.d = false;
	}
	if(evt.key === " "){
		player.movementKeys.space = false;
	}
});

Setup();
setInterval(Update,60/1000);
