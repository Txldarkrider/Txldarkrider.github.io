Math.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

Math.getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
}

class Text{
	constructor(x,y,Font,Text,Color,MaxW){
		this.x = x;
		this.y = y;
		this.f = Font;
		this.t = Text;
		this.c = Color;
		
		if(MaxW === null){
			this.MaxW = 100000;
		}else{
			this.MaxW = MaxW;
		}
	}
	draw(ctx){
		ctx.save();
		ctx.font = this.f;
		ctx.fillStyle = this.c;
		ctx.fillText(this.t,this.x,this.y,this.MaxW);
		ctx.restore();
	}
	updatePos(x,y){
		this.x = x;
		this.y = y;
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Rect{
	constructor(x,y,w,h,c){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}
	draw(ctx){
		ctx.save();
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.restore();
	}
	updatePos(x,y){
		this.x = x;
		this.y = y;
	}
	update(ctx){
		this.draw(ctx);
	}
}

class CraftingButton{
	constructor(x,y,w,h,c,recipes){
		this.recipes = [];
		
		this.inv = new Inventory(9,1,9);
		
		this.inv.Recipes = recipes;
		for(i = 0; i < this.inv.Recipes.length; i++){
			this.recipes.push(new Button(x,y+(i*h),w,h,"rgba(0,0,0,0.1)","32px Arial",`Needed:${this.inv.Recipes[i].inp[0].name} Amount:${this.inv.Recipes[i].inp[0].amount} Output:${this.inv.Recipes[i].out[0].name}  Amount:${this.inv.Recipes[i].out[0].amount}`,"black"));
		}
	}
	draw(ctx){
		for(let key in this.recipes){
			this.recipes[key].update(ctx);
		}
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Outline{
	constructor(x,y,w,h,c){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}
	draw(ctx){
		ctx.save();
		ctx.strokeStyle = this.c;
		ctx.strokeRect(this.x,this.y,this.w,this.h);
		ctx.restore();
	}
	updatePos(x,y){
		this.x = x;
		this.y = y;
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Mouse{
	constructor(x,y,w,h,c){
		this.rect = new Rect(x,y,w,h,c);
		this.lClick = false;
		this.rClick = false;
	}
	draw(ctx){
		this.rect.update(ctx);
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Button{
	constructor(x,y,w,h,RectColor,text,Font,TextColor,MaxW){
		this.rect = new Rect(x,y,w,h,RectColor);
		if(MaxW === null){
			this.MaxW = 100000;
		}else{
			this.MaxW = MaxW;
		}
		this.text = new Text(x+w/2.5,(y+h),text,Font,TextColor,this.MaxW);
		
	}
	CheckIfHoveredOn(Elem){
		if(this.rect.c != "rgba(0,0,0,0)"){
			if (this.rect.x < Elem.x + Elem.w && this.rect.x + this.rect.w > Elem.x && this.rect.y < Elem.y + Elem.h && this.rect.y + this.rect.h > Elem.y) {
	    	this.rect.c = "rgba(100,100,0,0.25)"
				return true;
			}else{
				this.rect.c = "rgba(0,0,0,0.1)";
				return false;
			}
		}
	}
	draw(ctx){
		this.text.update(ctx);
		this.rect.update(ctx);
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Item{
	constructor(Name,Id,Amount,StackAmount,Tile){
		this.name = Name;
		this.id = Id;
		this.amount = Amount;
		this.stackAmount = StackAmount;
		this.tile = Tile;
	}
}

class Tool{
	constructor(Name,Id,ToolSpd,BlockDmg){
		this.itemDrop = new Item(Name,Id,1,1);
		this.Spd = ToolSpd;
		this.BlockDmg = BlockDmg;
	}
}

class Tile{
	constructor(x,y,w,h,c,name,d){
		this.rect = new Rect(x,y,w,h,c);
		this.name = name;
		this.defaultDurability = d;
		this.durability = d;
		this.itemDrop = new Item(this.name,this.name,1,64);
		this.collision = {
			ColTop : new Rect(this.rect.x+5,this.rect.y,this.rect.w-10,5,"white"),
			ColBottom : new Rect(this.rect.x+5,this.rect.y+this.rect.h-5,this.rect.w-10,5,"white"),
			ColRight : new Rect(this.rect.x,this.rect.y+5,5,this.rect.h-10,"white"),
			ColLeft : new Rect(this.rect.x+this.rect.w-5,this.rect.y+5,5,this.rect.h-10,"white"),
		};
	}
	draw(ctx){
		this.rect.update(ctx);
		// this.collision.ColTop.update(ctx);
		// this.collision.ColBottom.update(ctx);
		// this.collision.ColRight.update(ctx);
		// this.collision.ColLeft.update(ctx);
	}
	updatePos(){
		this.collision = {
			ColTop : new Rect(this.rect.x+5,this.rect.y,this.rect.w-10,5,"white"),
			ColBottom : new Rect(this.rect.x+5,this.rect.y+this.rect.h-5,this.rect.w-10,5,"white"),
			ColRight : new Rect(this.rect.x,this.rect.y+5,5,this.rect.h-10,"white"),
			ColLeft : new Rect(this.rect.x+this.rect.w-5,this.rect.y+5,5,this.rect.h-10,"white"),
		};
	}
	update(ctx){
		this.updatePos();
		this.draw(ctx);

	}
}

class Camera{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    // MoveCameraSmooth(player,canvas){
    //     if(player.x + this.x < window.innerWidth * 0.50){
    //         this.x += player.maxSpd.x;
    //       }
    //       if(player.x + this.x > window.innerWidth * 0.50){
    //         this.x -= player.maxSpd.x;
    //       }
    //       if(player.y + this.y < window.innerHeight * 0.50){
    //         this.y += player.maxSpd.y;
    //       }
    //       if(player.y + this.y > window.innerHeight * 0.50){
    //         this.y -= player.maxSpd.y;
    //     }
    // }
    MoveCameraRidged(player,canvas){
        this.x = player.x - canvas.width/2;
        this.y = player.y - canvas.height/2;
    }
}

class Inventory{
	constructor(SlotAmount,rows,columns){
		this.SlotAmount = SlotAmount;
		this.rows = rows;
		this.columns = columns;
		this.Slots = [];
		this.Recipes =[];
	}
	Add(Item){
		for(let key in this.Slots){
			if(Item.id !== this.Slots[key].item.id){
				if(this.Slots[key].item.name === null){
					this.Slots[key].item = Item;
					return;
				}
			}else{
				if(this.Slots[key].item.amount + Item.amount <= this.Slots[key].item.stackAmount){
					this.Slots[key].item.amount += Item.amount;
					return;
				}
			}
		}
	}
	Remove(Item){
		for(let key in this.Slots){
			if(Item.id === this.Slots[key].item.id){
				if(this.Slots[key].item.amount - Item.amount > 0){
					this.Slots[key].item.amount -= Item.amount;
					return true;
				}else if(this.Slots[key].item.amount - Item.amount <= 0){
					this.Slots[key].item.name = null;
					this.Slots[key].item.id = null;
					this.Slots[key].item.amount = null;
					this.Slots[key].item.tile = undefined;
					return true;
				}else{
					return false;
				}
			}
		}
	}
	CraftSomething(id){
		for(let key in this.Slots){
			if(this.Recipes[id].inp.length === 1){
				if(this.Slots[key].item.id === this.Recipes[id].inp[0].id){
					if(this.Slots[key].item.amount >= this.Recipes[id].inp[0].amount){
						this.Add(new Item(this.Recipes[id].out[0].name,this.Recipes[id].out[0].id,this.Recipes[id].out[0].amount,this.Recipes[id].out[0].stackAmount,this.Recipes[id].out[0].tile));
						this.Remove(this.Recipes[id].inp[0]);
					}
				}
			}
			if(this.Recipes[id].inp.length === 2){
				if(this.Slots[key].item.id === this.Recipes[id].inp[0].id){
					if(this.Slots[key].item.amount >= this.Recipes[id].inp[0].amount){
						for(let key1 in this.Slots){
							if(this.Slots[key1].item.id === this.Recipes[id].inp[1].id){
								if(this.Slots[key1].item.amount >= this.Recipes[id].inp[1].amount){
									this.Add(new Item(this.Recipes[id].out[0].name,this.Recipes[id].out[0].id,this.Recipes[id].out[0].amount,this.Recipes[id].out[0].stackAmount,this.Recipes[id].out[0].tile));
									this.Remove(this.Recipes[id].inp[0]);
									this.Remove(this.Recipes[id].inp[1]);
								}
							}
						}
					}
				}
			}
		}
	}
}

class InventorySlot{
	constructor(x,y,w,h){
		this.item = {
			name:null,
			id:null,
			amount:null,
		};
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.selected = false;
		this.c = "black";
	}
	draw(ctx){
		if(this.selected === true){
			this.c = "Yellow";
		}else{
			this.c = "Black";
		}
		ctx.save();
		
		ctx.strokeStyle = this.c;
		
		ctx.strokeRect(this.x,this.y,this.w,this.h);
		
		ctx.restore();
		
		if(this.item.name !== null){
		ctx.save();
		ctx.font = `Bold ${16}px Georgia`;
		// ctx.scale(2,2);
		ctx.fillText(`${this.item.name}`,this.x,(this.y+(this.h/4)));
		ctx.font = `Bold ${10}px Georgia`;
		ctx.fillText(`Amount: ${this.item.amount}`,this.x,(this.y+(this.h/1.5)));
		ctx.restore();
		}
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Player{
	constructor(x,y,w,h,Color,scl){
		this.rect = new Rect(x,y,w,h,Color);
		
		this.miningRadius = new Rect(x,y,w*3,h*2,"rgba(0,0,0,0.1)");
		
		this.blockDurability = new Text(0,canvas.height-scl*2,"32px Arial","Hello","black")
		this.blockName = new Text(0,canvas.height-scl*3,"32px Arial","Hello","black");
		
		this.tool = new Tool("Wood Pick","Wood Pick",15,1);
		this.grid = [];
		this.scl = scl;
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		this.grid.push(new Outline(0,0,scl,scl));
		
		this.SlotSelected = 0;
		
		this.inv = new Inventory(9,1,9);
		
		this.inv.Recipes.push(
			{inp:[new Item("Bark","bark",1,64,undefined)],out:[new Item("Planks","planks",4,64,new Tile(0,0,32,32,"brown","planks",3))]},
			{inp:[new Item("Planks","planks",4,64,undefined)],out:[new Item("Crafting Table","craftingtable",1,64,new Tile(0,0,32,32,"carmal","crafting table",3))]}
		);
		
		this.crafting = new CraftingButton(128,0,128,64,"rgba(0,0,0,0.1)",this.inv.Recipes);
		
		for(let i=0; i<this.inv.rows; i++){
			for(let j=0; j<this.inv.columns; j++){
				this.inv.Slots.push(new InventorySlot(i*w*4,j*w*4,w*4,w*4));
			}
		}
		
		this.camera = new Camera(this.rect.x,this.rect.y);
		this.g = 0.5;
		this.MaxSpd = 4;
		this.spd = {
			x:0,y:0,
		}
		this.movementKeys = {
			a : false,
			d : false,
			space : false,
		};
		this.jumpPower = 7;
		this.canJump = true;
	}
	updateBlockText(Block,ctx){
		this.blockDurability = Block.durability;
		this.blockName = Block.name;
		this.drawBlockText(ctx);
	}
	drawBlockText(ctx){
		//this.blockDurability.update(ctx);
		//this.blockName.update(ctx);
	}
	drawGrid(ctx){
		for(let key in this.grid){
			this.grid[key].update(ctx);
		}
	}
	updateGridPos(){
		let moduloOfPlayerX = (this.rect.x % this.scl/8);
		let moduloOfPlayerY = (this.rect.y % this.scl/16);
		if(moduloOfPlayerX === 0){
			this.grid[0].x = this.rect.x;
			this.grid[1].x = this.rect.x;
			this.grid[2].x = this.rect.x;
			this.grid[3].x = this.rect.x+this.scl;
			this.grid[4].x = this.rect.x+this.scl;
			this.grid[5].x = this.rect.x+this.scl;
			this.grid[6].x = this.rect.x-this.scl;
			this.grid[7].x = this.rect.x-this.scl;
			this.grid[8].x = this.rect.x-this.scl;
			this.grid[9].x = this.rect.x;
			this.grid[10].x = this.rect.x+this.scl;
			this.grid[11].x = this.rect.x-this.scl;
		}
		if(moduloOfPlayerY === 0){
			this.grid[0].y = this.rect.y;
			this.grid[1].y = this.rect.y+this.scl;
			this.grid[2].y = this.rect.y-this.scl;
			this.grid[3].y = this.rect.y;
			this.grid[4].y = this.rect.y+this.scl;
			this.grid[5].y = this.rect.y-this.scl;
			this.grid[6].y = this.rect.y;
			this.grid[7].y = this.rect.y+this.scl;
			this.grid[8].y = this.rect.y-this.scl;
			this.grid[9].y = this.rect.y+this.scl*2;
			this.grid[10].y = this.rect.y+this.scl*2;
			this.grid[11].y = this.rect.y+this.scl*2;
			
		}
	}
	
	drawInv(ctx){
		if(this.SlotSelected === 0){
			this.inv.Slots[8].selected = false;
			this.inv.Slots[0].selected = true;
			this.inv.Slots[1].selected = false;
		}else if(this.SlotSelected === 1){
			this.inv.Slots[0].selected = false;
			this.inv.Slots[1].selected = true;
			this.inv.Slots[2].selected = false;
		}else if(this.SlotSelected === 2){
			this.inv.Slots[1].selected = false;
			this.inv.Slots[2].selected = true;
			this.inv.Slots[3].selected = false;
		}else if(this.SlotSelected === 3){
			this.inv.Slots[2].selected = false;
			this.inv.Slots[3].selected = true;
			this.inv.Slots[4].selected = false;
		}else if(this.SlotSelected === 4){
			this.inv.Slots[3].selected = false;
			this.inv.Slots[4].selected = true;
			this.inv.Slots[5].selected = false;
		}else if(this.SlotSelected === 5){
			this.inv.Slots[4].selected = false;
			this.inv.Slots[5].selected = true;
			this.inv.Slots[6].selected = false;
		}else if(this.SlotSelected === 6){
			this.inv.Slots[5].selected = false;
			this.inv.Slots[6].selected = true;
			this.inv.Slots[7].selected = false;
		}else if(this.SlotSelected === 7){
			this.inv.Slots[6].selected = false;
			this.inv.Slots[7].selected = true;
			this.inv.Slots[8].selected = false;
		}else if(this.SlotSelected === 8){
			this.inv.Slots[7].selected = false;
			this.inv.Slots[8].selected = true;
			this.inv.Slots[0].selected = false;
		}
		
		this.crafting.update(ctx);
		
		for(let key in this.inv.Slots){
			this.inv.Slots[key].update(ctx);
		}
	}
	draw(ctx){
		this.miningRadius.update(ctx);
		this.drawGrid(ctx);
		this.rect.update(ctx);
	}
	CheckKeys(){
		if(this.movementKeys.a){
			this.spd.x = -this.MaxSpd;
		}
		if(this.movementKeys.d){
			this.spd.x = this.MaxSpd;
		}
		if(!this.movementKeys.a && !this.movementKeys.d){
			this.spd.x = 0;
		}
		if(this.movementKeys.space && this.canJump){
			this.canJump = false;
			this.spd.y = -this.jumpPower;
		}
	}
	updatePos(){
		
		this.rect.x += this.spd.x;
		this.spd.y += this.g;
		this.rect.y += this.spd.y;
		this.miningRadius = new Rect(this.rect.x-this.rect.w*7,this.rect.y-this.rect.h*2,this.rect.w*15,this.rect.h*5,"rgba(0,0,0,0.1)");
		this.CheckKeys();
	}
	update(ctx){
		this.updateGridPos();
		this.updatePos();
		this.draw(ctx);
	}
}

class WorldGen{
  constructor(Wy,Ww,scl,BiomeSize,x,y,w,h,c,text,font,textColor){
	this.player = new Player(0,0,scl/1.5,scl*2,"Coral",scl);
	this.button = new Button(x,y,w,h,c,text,font,textColor);
	this.y = Wy;
	this.w = Ww;
	this.scl = scl;
	this.Tiles = [];
	this.BiomeSize = BiomeSize;
	this.Biome = "Plains";
	
	for(let i=0; i<this.w; i++){
		if(i % this.BiomeSize === 0){
			let RandomBiome = Math.getRandomInt(0,3); // Max Will Be 2 Min Will Be 0
			
			if(RandomBiome === 0){
				this.Biome = "Plains";
			}else if(RandomBiome === 1){
				this.Biome = "Hills";
			}else if(RandomBiome === 2){
				this.Biome = "Desert";
			}
		}
		
		if(this.Biome === "Plains"){
			let RandomNum = Math.getRandomInt(0,10);
			if(RandomNum >= 0 && RandomNum <= 1){
				this.y += 1;
			}else if(RandomNum >= 5 && RandomNum <= 6){
				this.y -= 1;
			}else{
				this.y += 0;
			}
			let OtherRandomNum = Math.getRandomInt(0,50)
			if(OtherRandomNum >= 45){	
				this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*1,this.scl,this.scl,"#765c48","bark",3));
				this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*2,this.scl,this.scl,"#765c48","bark",3));
				this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*3,this.scl,this.scl,"#765c48","bark",3));
				this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*4,this.scl,this.scl,"lightGreen","leaves",1));
				this.Tiles.push(new Tile(i*this.scl+this.scl*1,this.y*this.scl-this.scl*4,this.scl,this.scl,"lightGreen","leaves",1));
				this.Tiles.push(new Tile(i*this.scl-this.scl*1,this.y*this.scl-this.scl*4,this.scl,this.scl,"lightGreen","leaves",1));
				this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*5,this.scl,this.scl,"lightGreen","leaves",1));
			}
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl,this.scl,this.scl,"Green","grass",1));
	  
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*1,this.scl,this.scl,"Brown","dirt",2));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*2,this.scl,this.scl,"Brown","dirt",2));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*3,this.scl,this.scl,"Brown","dirt",2));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*4,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*5,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*6,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*7,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*8,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*9,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*10,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*11,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*12,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*13,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*14,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*15,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*16,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*17,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*18,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*19,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*20,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*21,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*22,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*23,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*24,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*25,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*26,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*27,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*28,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*29,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*30,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*31,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*32,this.scl,this.scl,"grey","stone",3));
		}
		if(this.Biome === "Hills"){
			let RandomNum = Math.getRandomInt(0,10);
			if(RandomNum >= 0 && RandomNum <= 1){
				this.y += 1;
			}else if(RandomNum >= 2 && RandomNum <= 3){
				this.y -= 1;
			}else if(RandomNum >= 4 && RandomNum <= 5){
				this.y -= 2;
			}else if(RandomNum >= 6 && RandomNum <= 7){
				this.y += 2;
			}else{
				this.y += 0;
			}
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl,this.scl,this.scl,"Green","grass",1));
			
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*1,this.scl,this.scl,"Brown","dirt",2));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*2,this.scl,this.scl,"Brown","dirt",2));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*3,this.scl,this.scl,"Brown","dirt",2));
			
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*4,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*5,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*6,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*7,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*8,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*9,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*10,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*11,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*12,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*13,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*14,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*15,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*16,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*17,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*18,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*19,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*20,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*21,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*22,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*23,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*24,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*25,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*26,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*27,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*28,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*29,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*30,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*31,this.scl,this.scl,"grey","stone",3));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*32,this.scl,this.scl,"grey","stone",3));
		}
		if(this.Biome === "Desert"){
		let RandomNum = Math.getRandomInt(0,10);
		if(RandomNum >= 0 && RandomNum <= 1){
			this.y += 1;
		}else if(RandomNum >= 2 && RandomNum <= 3){
			this.y -= 1;
		}else{
			this.y += 0;
		}
		let OtherRandomNum = Math.getRandomInt(0,50)
		if(OtherRandomNum >= 45){	
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*1,this.scl,this.scl,"rgb(0,155,0)","cactus",1));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*2,this.scl,this.scl,"rgb(0,155,0)","cactus",1));
			this.Tiles.push(new Tile(i*this.scl,this.y*this.scl-this.scl*3,this.scl,this.scl,"rgb(0,155,0)","cactus",1));
		}
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl,this.scl,this.scl,"#c2b280","sand",2));
  
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*1,this.scl,this.scl,"#c2b280","sand",2));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*2,this.scl,this.scl,"#c2b280","sand",2));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*3,this.scl,this.scl,"#c2b280","sand",2));
		
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*4,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*5,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*6,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*7,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*8,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*9,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*10,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*11,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*12,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*13,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*14,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*15,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*16,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*17,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*18,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*19,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*20,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*21,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*22,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*23,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*24,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*25,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*26,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*27,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*28,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*29,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*30,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*31,this.scl,this.scl,"#a88f59","sandstone",3));
		this.Tiles.push(new Tile(i*this.scl,this.y*this.scl+this.scl*32,this.scl,this.scl,"#a88f59","sandstone",3));
	}
    }
  }
}