let canvas = document.getElementById("game");
canvas.style.cursor = "none";
canvas.style.backgroundColor = "skyblue";
canvas.style.position = "absolute";
canvas.style.margin = 0;
canvas.style.padding = 0;
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let RandomNum = Math.trunc((Math.random() + 1));
let y = canvas.height/64;
let btnY = 0;
let i =0;

function TestCollision(e1,e2){
	return e1.x < e2.x + e2.w && e1.x + e1.w > e2.x && e1.y < e2.y + e2.h && e1.y + e1.h > e2.y;
}

//ToDo List

//Add a visual ui for crafting.
//Add Music.

//Done List

//Add building.
//Add a tile param to the Item class
//Add Tools.
//Add Durability for blocks.
//Eventually add the inventory system.
//Add Radius for mining.
//Add tile drops to the blocks in there constructor
//Added Biomes to the world gen.
//Add the player into the world class so that it has differnt spawnpoints also add mining.
//And fix the collision system.


World = {
	w:128,h:4,scl:32,
	player:new Player(0,0,32,64,"Coral",32),
	mouse:new Mouse(canvas.width/2,canvas.height/3,16,16,"black"),
	state:{
		MainMenu:true,
		WorldSelect:false,
		Controls:false,
		Pause:false,
		Play:false
	},
	Buttons:{
		MainMenu:[],
		Controls:[],
		WorldSelect:{
			Menu:[],
			Worlds:[],
		},
		Pause:[],

	},
	SelectedWorld:0,
}

start = () =>{
	World.Buttons.MainMenu.push(new Button(canvas.width/2-380,64,416,32,"rgba(0,0,0,0)","64px Arial","Terracraft V2.0","black"));
	World.Buttons.MainMenu.push(new Button(canvas.width/2-416/2,canvas.height/3+128,416,32,"rgba(0,0,0,0.1)","32px Arial","Quit","black"));
	World.Buttons.MainMenu.push(new Button(canvas.width/2-416/2,canvas.height/3+64,416,32,"rgba(0,0,0,0.1)","32px Arial","Controls","black"));
	World.Buttons.MainMenu.push(new Button(canvas.width/2-416/2,canvas.height/3,416,32,"rgba(0,0,0,0.1)","32px Arial","Play","black"));

	World.Buttons.WorldSelect.Menu.push(new Button(canvas.width/2-380,64,416,32,"rgba(0,0,0,0)","64px Arial","World Select","black"));
	World.Buttons.WorldSelect.Menu.push(new Button(canvas.width/2-416/2,canvas.height/3,416,32,"rgba(0,0,0,0.1)","32px Arial","Create New World","black"));
	World.Buttons.WorldSelect.Menu.push(new Button(canvas.width/2-416/2,canvas.height/3+128,416,32,"rgba(0,0,0,0.1)","32px Arial","Back To MainMenu","black"));

	World.Buttons.Controls.push(new Button(0,64,0,0,"rbga(0,0,0,0)","64px Arial","Controls"));
	World.Buttons.Controls.push(new Button(0,128,0,0,"rgba(0,0,0,0)","32px Arial","Movement: WASD",12));
	World.Buttons.Controls.push(new Button(0,128+128,0,0,"rgba(0,0,0,0)","32px Arial","Mine blocks:Left Click",12));
	World.Buttons.Controls.push(new Button(0,128+256,0,0,"rgba(0,0,0,0)","32px Arial","Place blocks:Right Click",12));
	World.Buttons.Controls.push(new Button(0,128+384,0,0,"rgba(0,0,0,0)","32px Arial","Inventory Controls:Use ; to go up and use . to go down",12));
	World.Buttons.Controls.push(new Button(0,canvas.height-48,416,32,"rgba(0,0,0,0.1)","32px Arial","Back","black"));


	World.Buttons.Pause.push(new Button(canvas.width/2-380,64,416,32,"rgba(0,0,0,0)","64px Arial","Pause","black"));
	World.Buttons.Pause.push(new Button(canvas.width/2-416/2,canvas.height/3,416,32,"rgba(0,0,0,0.1)","32px Arial","Play","black"));
	World.Buttons.Pause.push(new Button(canvas.width/2-416/2,canvas.height/3+128,416,32,"rgba(0,0,0,0.1)","32px Arial","Quit","black"));
}

update = () =>{
	requestAnimationFrame(update);
	ctx.clearRect(0,0,canvas.width,canvas.height);

	if(World.state.MainMenu){
		for(let key in World.Buttons.MainMenu){
		  World.Buttons.MainMenu[key].update(ctx);
			if(World.Buttons.MainMenu[key].CheckIfHoveredOn(World.mouse.rect) && World.Buttons.MainMenu[key].text.t === "Play" && World.mouse.lClick){
				//World.Worlds.push(new WorldGen(canvas.height/(World.scl*2),32,32));

				World.mouse.lClick = false;
				World.state.MainMenu = false;
				World.state.WorldSelect = true;
				World.state.Pause = false;
				World.state.Play = false;
			}
			if(World.Buttons.MainMenu[key].CheckIfHoveredOn(World.mouse.rect) && World.Buttons.MainMenu[key].text.t === "Controls" && World.mouse.lClick){
				World.mouse.lClick = false;
				World.state.MainMenu = false;
				World.state.WorldSelect = false;
				World.state.Controls = true;
				World.state.Pause = false;
				World.state.Play = false;
			}
		}
	}

	if(World.state.WorldSelect){
		for(let key in World.Buttons.WorldSelect.Menu){
			World.Buttons.WorldSelect.Menu[key].update(ctx);
			if(World.Buttons.WorldSelect.Menu[key].CheckIfHoveredOn(World.mouse.rect)){
				if(World.mouse.lClick){
					if(World.Buttons.WorldSelect.Menu[key].text.t === "Create New World"){
						//World.Worlds.push(new WorldGen(canvas.height/(World.scl*2),32,32));
						World.Buttons.WorldSelect.Worlds.push(new WorldGen(32,1500,32,128,0,32*btnY,128,32,"rgba(0,0,0,0.1)","32px Arial",`World${btnY}`,"black"));
						btnY += 1;
						World.mouse.lClick = false;
					}
					if(World.Buttons.WorldSelect.Menu[key].text.t === "Back To MainMenu"){
						World.state.MainMenu = true;
						World.state.WorldSelect = false;
						World.state.Pause = false;
						World.state.Play = false;
					}

				}
			}
		}
		for(let key in World.Buttons.WorldSelect.Worlds){
			World.Buttons.WorldSelect.Worlds[key].button.update(ctx);
			if(World.Buttons.WorldSelect.Worlds[key].button.CheckIfHoveredOn(World.mouse.rect) && World.mouse.lClick){
				World.state.MainMenu = false;
				World.state.WorldSelect = false;
				World.state.Pause = false;
				World.state.Play = true;

				World.SelectedWorld = key;
			}
		}
	}

	if(World.state.Controls){
		for(let key in World.Buttons.Controls){
			World.Buttons.Controls[key].update(ctx);
			if(World.Buttons.Controls[key].CheckIfHoveredOn(World.mouse.rect) && World.Buttons.Controls[key].text.t === "Back" && World.mouse.lClick){
				World.mouse.lClick = false;
				World.state.MainMenu = true;
				World.state.WorldSelect = false;
				World.state.Controls = false;
				World.state.Pause = false;
				World.state.Play = false;
			}
		}

	}

	if(World.state.Pause){
		for(let key in World.Buttons.Pause){
			World.Buttons.Pause[key].update(ctx);
			if(World.Buttons.Pause[key].CheckIfHoveredOn(World.mouse.rect) && World.Buttons.Pause[key].text.t === "Play" && World.mouse.lClick){
				World.state.MainMenu = false;
				World.state.Pause = false;
				World.state.Play = true;
			}else if(World.Buttons.Pause[key].CheckIfHoveredOn(World.mouse.rect) && World.Buttons.Pause[key].text.t === "Quit" && World.mouse.lClick){
				World.state.MainMenu = true;
				World.state.Pause = false;
				World.state.Play = false;
				World.SelectedWorld = null;
			}
		}
	}

	if(World.state.Play){
		ctx.save();

		ctx.translate(-World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.x,-World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.y);
		World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.MoveCameraRidged(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect,canvas);

		for(let key in World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid){
			//console.log(!TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key],World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].rect))
			if(TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key],{x:World.mouse.rect.x + World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.x,y:World.mouse.rect.y + World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.y,w:World.mouse.rect.w,h:World.mouse.rect.h}) && !TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key],World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].rect)){
				World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key].c = "Yellow";
				if(World.mouse.rClick && World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots[World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected].item.tile !== undefined){
					World.mouse.rClick = false;
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles.push(new Tile(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key].x,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key].y,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key].w,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key].h,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots[World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected].item.tile.rect.c,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots[World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected].item.tile.name,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots[World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected].item.tile.defaultDurability));
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Remove(new Item(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots[World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected].item.name,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots[World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected].item.id,1,64,undefined));
				}
			}else{
				World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.grid[key].c = "black";
			}
		}


		for(let key in World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles){
			if(TestCollision({x:World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.x,y:World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.y,w:canvas.width,h:canvas.height},World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].rect)){
				World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].update(ctx);

				if(TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].collision.ColTop,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect)){
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.canJump = true;
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.spd.y = 0;
					if(!World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.space){
							World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect.y = World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].rect.y-World.player.rect.h;
					}else{
						World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect.y -= 10;
					}
				}
				if(TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].collision.ColRight,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect)){
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect.x -= 	World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.MaxSpd;
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.spd.x = 0;
				}
				if(TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].collision.ColLeft,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect)){
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect.x += 	World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.MaxSpd;
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.spd.x = 0;
				}
				if(TestCollision(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].collision.ColBottom,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.rect)){
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.spd.y = 0;
				}
			}

			if(TestCollision({x:World.mouse.rect.x + World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.x,y:World.mouse.rect.y + World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.y,w:World.mouse.rect.w,h:World.mouse.rect.h},World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].rect) && TestCollision({x:World.mouse.rect.x + World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.x,y:World.mouse.rect.y + World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.camera.y,w:World.mouse.rect.w,h:World.mouse.rect.h},World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.miningRadius) && World.mouse.lClick){

				//World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.updateBlockText(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key],ctx);

				if(i % World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.tool.Spd=== 0){
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].durability -= World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.tool.BlockDmg;
				}
				if(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].durability <= 0){
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Add(new Item(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].itemDrop.name,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].itemDrop.id,1,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key].itemDrop.stackAmount,World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles[key]));
					World.Buttons.WorldSelect.Worlds[World.SelectedWorld].Tiles.splice(key,1);
				}
			}

		}
		for(let key in World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.crafting.recipes){
			if(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.crafting.recipes[key].CheckIfHoveredOn(World.mouse.rect)&& World.mouse.lClick){
				World.mouse.lClick = false;
				World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.CraftSomething(key);
			}
		}
		World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.update(ctx);


		ctx.restore();
		World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.drawInv(ctx);
		if(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected < 0){
			World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected = World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots.length-1;
		}
		if(World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected >= World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.inv.Slots.length){
			World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected = 0;
		}

	}
	World.mouse.update(ctx);
	i++
}

window.onresize = function(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
};

document.onmousemove = function(evt){
World.mouse.rect.x = evt.clientX - World.mouse.rect.w/2;
World.mouse.rect.y = evt.clientY - World.mouse.rect.h/2;
}

document.addEventListener("mousedown",(evt)=>{
switch (evt.which) {
  case 1:
	World.mouse.lClick = true;
  break;
  case 2:
  break;
  case 3:
	World.mouse.rClick = true;
  break;
}
})

document.addEventListener("mouseup",(evt)=>{
switch (evt.which) {
  case 1:
	World.mouse.lClick = false;
  break;
  case 2:

  break;
  case 3:
	World.mouse.rClick = false;
  break;
}
})

document.addEventListener("keydown",(evt)=>{
switch(evt.key){
	case "p":
		if(World.state.Play === true){
		  World.state.MainMenu = false;
		  World.state.Pause = true;
		  World.state.Play = false;
		}
	break;
	case "a":
	if(World.state.Play)
	  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.a = true;
	break;
	case "d":
	if(World.state.Play)
	 World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.d = true;
	break;
	case " ":
	if(World.state.Play)
	  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.space = true;
	break;
	case "l":
	if(World.state.Play)

	  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected -= 1;
	break;
	case ",":
	if(World.state.Play)

	  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.SlotSelected += 1;
	break;

}
});

document.addEventListener("keyup",(evt)=>{
	switch(evt.key){
		case "a":
		if(World.state.Play)
		  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.a = false;
		break;
		case "d":
		if(World.state.Play)
		  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.d = false;
		break;
		case " ":
		if(World.state.Play)
		  World.Buttons.WorldSelect.Worlds[World.SelectedWorld].player.movementKeys.space = false;
		break;
	}
});

start();
update();
