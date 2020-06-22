let canvas = document.getElementById("game");
canvas.style.position = "absolute";
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "skyblue";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");
let scl = 32;
let mouse = {
    rect:new Rect(0,0,16,16,"black"),
    gridX:0,
	gridY: 0,
	BlockX: 0,
	BlockY:0,
    left:false,
    right:false,
	onBlock: false,
	canMine:false,
	onBlockType: "none",
	BlockOn: "none",
	Move:(evt)=>{
		mouse.rect.x = ((evt.clientX))-mouse.rect.w/2;
		mouse.rect.y = ((evt.clientY))-mouse.rect.h/2;
		if(mouse.rect.x+Camera.x < 0){
			mouse.gridX = Math.trunc((evt.clientX+Camera.x)/scl)-1;
		}else{
			mouse.gridX = Math.trunc((evt.clientX+Camera.x)/scl);
		}
		if(mouse.rect.y+Camera.y < 0){
			mouse.gridY = Math.trunc((evt.clientY+Camera.y)/scl)-1;
		}else{
			mouse.gridY = Math.trunc((evt.clientY+Camera.y)/scl);
		}
		mouse.BlockX = mouse.gridX * scl;
		mouse.BlockY = mouse.gridY * scl;
	},
}
let Camera = {
    x:0,
    y:0,
}
let State = {
    Play:true,
    Debug:false,
}

let blocks = [
	new Block(new Tile(-2 * scl, 1 * scl, scl, scl, "Brown"), new Item(0, "Dirt", 1,"Block","Brown"),"Block"),
	new Block(new Tile(-1 * scl, 1 * scl, scl, scl, "Brown"), new Item(0, "Dirt", 1,"Block","Brown"),"Block"),
	new Block(new Tile( 0 * scl, 1 * scl, scl, scl, "Brown"), new Item(0, "Dirt", 1,"Block","Brown"),"Block"),
	new Block(new Tile( 1 * scl, 1 * scl, scl, scl, "Brown"), new Item(0, "Dirt", 1,"Block","Brown"),"Block"),
	new Block(new Tile( 2 * scl, 1 * scl, scl, scl, "Brown"), new Item(0, "Dirt", 1,"Block","Brown"),"Block"),
];

let ResourceBlocks = [
	new ResourceGenerator(new Tile(0 * scl, 0 * scl, scl, scl, "chocolate"), new Item(0,"Dirt",1,"Block","Brown"),new Item(1,"Dirt Generator",1,"ResourceGenerator","Chocolate",0,"Dirt","Block","Brown")), 
	new ResourceGenerator(new Tile(-1 * scl, 0 * scl, scl, scl, "Grey"), new Item(2, "Stone", 1,"Block","DarkGrey"),new Item(3,"Stone Generator",1,"ResourceGenerator","Grey",2, "Stone","Block","DarkGrey")),
	new ResourceGenerator(new Tile(-2 * scl, 0 * scl, scl, scl, "silver"), new Item(4, "Iron", 1,"Block","LightGrey"),new Item(5,"Iron Generator",1,"ResourceGenerator","silver",4, "Iron","Block","LightGrey")),
];
let lastUpdate = Date.now();
let delta = 0;
let player = new Player(0,-scl*2,scl,scl*1.5,"Coral",5);
player.G = 0.25;
let mouseCollision = false;




function TestCollision(e1,e2){
    return e1.x < e2.x + e2.w && e1.x + e1.w > e2.x && e1.y < e2.y + e2.h && e1.y + e1.h > e2.y
}

//Change the Add and Remove Function To Better Suite the Blocks class

function setup(){
	//player.Inv.Add(new Block());
	setInterval(()=>{
		mouse.canMine = true;
	}, 500);
}
function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let time = Date.now();
	delta = time - lastUpdate;
	Camera.x = player.rect.x-canvas.width/2;
	Camera.y = player.rect.y-canvas.height/2;
    if(State.Play){
		ctx.save();

		player.drawInv(0,32, 32);
        ctx.translate(-Camera.x,-Camera.y);
		
		if (mouse.left) {
			//If you are able to this is where you get all your resources when you are on top of one of the resource generators
			if (mouse.onBlockType == "ResourceGenerator" && mouse.canMine) {
				player.Inv.Add(mouse.BlockOn.collectedDrop);
				mouse.canMine = false;
			}
			if (!mouse.onBlock) {
				if (!TestCollision({ x:mouse.BlockX, y:mouse.BlockY, w:scl,h:scl},player.rect)) {
					for (let key in player.Inv.Items) {
						if (player.CurrentSlot == player.Inv.Items[key].id) {
							if (player.Inv.Items[player.CurrentSlot] !== undefined) {
								if (player.Inv.Items[player.CurrentSlot].spawnType == "Block") {
									if (player.Inv.Items[player.CurrentSlot].amount > 0) {
										blocks.push(new Block(new Tile(mouse.gridX * scl, mouse.gridY * scl, scl, scl, player.Inv.Items[player.CurrentSlot].color), new Item(player.Inv.Items[player.CurrentSlot].id, player.Inv.Items[player.CurrentSlot].name, 1, player.Inv.Items[player.CurrentSlot].spawnType,player.Inv.Items[player.CurrentSlot].color)));
										player.Inv.Remove(new Item(player.Inv.Items[player.CurrentSlot].id,0,0,0,0));
										continue;
									}
								}
								if (player.Inv.Items[player.CurrentSlot].spawnType == "ResourceGenerator") {
									if (player.Inv.Items[player.CurrentSlot].amount > 0) {
										//Push a new Resource Block instead of a regular block
										ResourceBlocks.push(new ResourceGenerator(
															new Tile(mouse.gridX * scl, mouse.gridY * scl, scl, scl, player.Inv.Items[player.CurrentSlot].color),
										 /*Collected Drop*/ new Item(player.Inv.Items[player.CurrentSlot].collectedId, player.Inv.Items[player.CurrentSlot].collectedName, 1, player.Inv.Items[player.CurrentSlot].collectedSpawntype ,player.Inv.Items[player.CurrentSlot].collectedColor),
										 
										 /*Destroyed Drop*/new Item(player.Inv.Items[player.CurrentSlot].id, player.Inv.Items[player.CurrentSlot].name, 1, player.Inv.Items[player.CurrentSlot].spawnType,player.Inv.Items[player.CurrentSlot].color,
																	player.Inv.Items[player.CurrentSlot].collectedId, player.Inv.Items[player.CurrentSlot].collectedName, player.Inv.Items[player.CurrentSlot].collectedSpawntype ,player.Inv.Items[player.CurrentSlot].collectedColor)));
										
										player.Inv.Remove(new Item(player.Inv.Items[player.CurrentSlot].id,0,0,0,0));
										continue;
									}
								}
							}
						}
					}
				}
			}
		}
		for(let key in blocks){
			for(let key1 in blocks){
				if(blocks[key] !== blocks[key1]){
					if(blocks[key].tile.rect.x == blocks[key1].tile.rect.x && blocks[key].tile.rect.y == blocks[key1].tile.rect.y){
						mouseCollision = true;
						player.Inv.Add(blocks[key1].item);
						delete blocks[key1];
					}else{
						mouseCollision = false;
					}
				}
			}
			if (!blocks[key].tile.empty) {
				if(TestCollision(blocks[key].tile.rect,{x:Camera.x,y:Camera.y,w:canvas.width,h:canvas.height})){
					blocks[key].update(ctx);
					if(TestCollision(blocks[key].tile.collision.Top,player.rect)){
						player.canJump = true;
						player.rect.y -= player.G;
						player.spd.y *= -player.G/2;
						if(player.spd.y < 0.1){
							player.spd.y = 0;
							player.rect.y = blocks[key].tile.collision.Top.y - player.rect.h;
						}
					}
					if(TestCollision(blocks[key].tile.collision.Bottom,player.rect)){
						player.spd.y = 0;
					}
					if(TestCollision(blocks[key].tile.collision.Left,player.rect) || TestCollision(blocks[key].tile.collision.Right,player.rect)){
						player.rect.x -= player.spd.x;
					}
					if (TestCollision({ x: mouse.BlockX, y: mouse.BlockY, w: 16, h: 16 }, blocks[key].tile.rect)) {
						mouse.onBlock = true;
						if (mouse.right) {
							player.Inv.Add(blocks[key].item);
							blocks[key].tile.empty = true;
							mouse.onBlock = false;
							continue;
						}
					}else if(TestCollision({ x: mouse.BlockX, y: mouse.BlockY, w: 16, h: 16 },{x:player.rect.x-(player.rect.w*1.5),y:player.rect.y-(player.rect.h*1.5),w:player.rect.w*4,h:player.rect.h*4})){
						mouse.onBlock = true;
					}else{
						mouse.onBlock = false;
					}
				}
			}else{
				delete blocks[key];
			}
			
		}
			mouse.onBlock = false;
			mouse.BlockOn = "";
			mouse.onBlockType = "";
		for (let key in ResourceBlocks) {
			if (ResourceBlocks[key].tile.empty) {
				delete ResourceBlocks[key];
				continue;
			}
			if (TestCollision(ResourceBlocks[key].tile.rect, { x: Camera.x, y: Camera.y, w: canvas.width, h: canvas.height })) {
				ResourceBlocks[key].update(ctx);
				if (TestCollision(ResourceBlocks[key].tile.collision.Top, player.rect)) {
					player.canJump = true;
					player.rect.y -= player.G;
					player.spd.y *= -player.G / 2;
					if (player.spd.y < 0.1) {
						player.spd.y = 0;
						player.rect.y = ResourceBlocks[key].tile.collision.Top.y - player.rect.h;
					}
				}
				if (TestCollision(ResourceBlocks[key].tile.collision.Bottom, player.rect)) {
					player.spd.y = 0;
				}
				if (TestCollision(ResourceBlocks[key].tile.collision.Left, player.rect) || TestCollision(ResourceBlocks[key].tile.collision.Right, player.rect)) {
					player.rect.x -= player.spd.x;
				}
			}
			for (let key1 in ResourceBlocks) {
				if (ResourceBlocks[key] !== ResourceBlocks[key1]) {
					if (ResourceBlocks[key].tile.rect.x == ResourceBlocks[key1].tile.rect.x && ResourceBlocks[key].tile.rect.y == ResourceBlocks[key1].tile.rect.y) {
						mouseCollision = true;
						player.Inv.Add(ResourceBlocks[key1].collectedDrop);
						delete ResourceBlocks[key1];
					} else {
						mouseCollision = false;
					}
				}
			}
			if (TestCollision({ x: mouse.BlockX, y: mouse.BlockY, w: 16, h: 16 }, ResourceBlocks[key].tile.rect)) {
				temp = ResourceBlocks[key].type;
				mouse.onBlock = true;
				mouse.BlockOn = ResourceBlocks[key];
				mouse.onBlockType = ResourceBlocks[key].destroyedDrop.spawnType;
				if (mouse.right) {
					player.Inv.Add(new Item(
											//Regular Item
											ResourceBlocks[key].destroyedDrop.id,
											ResourceBlocks[key].destroyedDrop.name,
											ResourceBlocks[key].destroyedDrop.amount,
											ResourceBlocks[key].destroyedDrop.spawnType,
											ResourceBlocks[key].destroyedDrop.color,
											//Collected Item
											ResourceBlocks[key].destroyedDrop.collectedId,
											ResourceBlocks[key].destroyedDrop.collectedName,
											"Block",
											ResourceBlocks[key].destroyedDrop.collectedColor,
											));
					ResourceBlocks[key].tile.empty = true;
					mouse.onBlock = false;
					continue;
				}
			}
			ResourceBlocks[key].update(ctx);
		}
		player.update(ctx);
		//player.drawGui(ctx);
        ctx.restore();
		if(State.Debug){
            ctx.save();
            ctx.font = "32px Arial";
            ctx.fillText(`MouseX: ${mouse.rect.x}`,0,scl*1);
            ctx.fillText(`MouseY: ${mouse.rect.y}`,0,scl*2);
            ctx.fillText(`GridX: ${mouse.gridX}`,0,scl*3);
            ctx.fillText(`GridY: ${mouse.gridY}`,0,scl*4);
            ctx.fillText(`BlockX: ${mouse.BlockX}`,0,scl*5);
            ctx.fillText(`BlockY: ${mouse.BlockY}`,0,scl*6);
            ctx.fillText(`Left Mouse Button: ${mouse.left}`,0,scl*7);
            ctx.fillText(`Right Mouse Button: ${mouse.right}`,0,scl*8);
            ctx.fillText(`CameraX: ${Camera.x}`,0,scl*9);
            ctx.fillText(`CameraY: ${Camera.y}`,0,scl*10);
            ctx.fillText(`Delta: ${delta}`,0,scl*11);
            ctx.fillText(`Player SpdX: ${player.spd.x}`,0,scl*12);
            ctx.fillText(`Player SpdY: ${player.spd.y}`,0,scl*13);
            ctx.fillText(`Player X: ${player.rect.x}`,0,scl*14);
            ctx.fillText(`Player Y: ${player.rect.y}`,0,scl*15);
			ctx.fillText(`Mouse Over Block: ${mouse.onBlock}`, 0, scl * 16);
			ctx.fillText(`Block Mouse On Type: ${mouse.onBlockType}`, 0, scl * 17);
			ctx.fillText(`Block Mouse On : ${mouse.BlockOn}`, 0, scl * 18);
            ctx.fillText(`Mouse Collision: ${mouseCollision}`,0,scl*19);
            ctx.restore();
        }
	}
	else {
        ctx.save();
        ctx.font = "32px Arial";
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("Paused",canvas.width/2+scl*-2,canvas.height/2+scl*0);
        ctx.fillText("Press 'P' to resume",canvas.width/2+scl*-4,canvas.height/2+scl*1);
        ctx.restore();
    }
    mouse.rect.draw(ctx);
	lastUpdate = time;
}
document.addEventListener("mousemove",mouse.Move)
document.addEventListener("mousedown",(evt) =>{
    switch(evt.which){
        case 1:
            mouse.left = true;
            break; 
        case 3:
            mouse.right = true;
            break; 
    }
})
document.addEventListener("mouseup",(evt) =>{
    switch(evt.which){
        case 1:
            mouse.left = false;
            break;
        case 3:
            mouse.right = false;
            break;
    }
})
document.addEventListener("keydown",(evt)=>{
	switch(evt.key){
        case "p": 
            State.Play = !State.Play;
            break;
		case "w":
			player.keys.w = true;
			break;
		case "a":
			player.keys.a = true;
			break;
		case "d":
			player.keys.d = true;
			break;
		case "ArrowUp":
			player.keys.up = true;
			break;
		case "ArrowLeft":
			player.keys.left = true;
			break;
		case "ArrowRight":
			player.keys.right = true;
			break;
    }
	switch(evt.code){
        case "ControlRight":
            State.Debug = !State.Debug;
            break;
    }
});
document.addEventListener("keyup",(evt) =>{
    switch(evt.key){
		case "w":
			player.keys.w = false;
			break;
		case "a":
			player.keys.a = false;
			break;
		case "d":
			player.keys.d = false;
			break;
		case "ArrowUp":
			player.keys.up = false;
			break;
		case "ArrowLeft":
			player.keys.left = false;
			break;
		case "ArrowRight":
			player.keys.right = false;
			break;
    }
   
})

document.addEventListener('wheel', (evt) => {
	if (evt.deltaY < 0) {
		player.CurrentSlot -= 1;
		if (player.CurrentSlot < 0) {
			player.CurrentSlot = player.Inv.Items.length - 1;
		}
	} else if (evt.deltaY > 0) {
		player.CurrentSlot += 1;
		if (player.CurrentSlot > player.Inv.Items.length - 1) {
			player.CurrentSlot = 0;
		}

	}
})

setup();
update();