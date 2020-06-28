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
        ctx.strokeStyle = "black";
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.strokeRect(this.x,this.y,this.w,this.h);
        ctx.restore();
    }
}

class Text {
	constructor(text,x,y,size,c) {
		this.text = text;
		this.x = x;
		this.y = y;
		this.size = size;
		this.c = c;
	}
	draw(ctx) {
		ctx.save();
		ctx.font =`${this.size}px Arial`;
		ctx.fillStyle = this.c;
		ctx.fillText(this.text, this.x, this.y);
		ctx.save();
	}
}

class Button {
	constructor(text,rect) {
		this.text = text;
		this.rect = rect;
	}
	draw(ctx) {
		this.rect.draw(ctx);
		this.text.draw(ctx);
	}
}

class Tile{
    constructor(x,y,w,h,c){
        this.rect = new Rect(x,y,w,h,c);
        this.collision = {};
		this.empty = false;
    }
    updatePos(){
        this.collision = {
		  Left : new Rect(this.rect.x-2.5,this.rect.y+2.5,5,this.rect.h-5,"white"),
		  Right : new Rect(this.rect.x+this.rect.w,this.rect.y+2.5,5,this.rect.h-5,"white"),
		  Top : new Rect(this.rect.x+2.5,this.rect.y,this.rect.h-5,5,"white"),
		  Bottom : new Rect(this.rect.x+2.5,this.rect.y+this.rect.h-5,this.rect.w-2.5,5,"white")
		}
    }
    draw(ctx){
		this.rect.draw(ctx);
		//for(let key in this.collision){
		//	this.collision[key].draw(ctx);
		//}
    }
    update(ctx){
		this.updatePos();
		this.draw(ctx);
    }
}
class ResourceGenerator{
	constructor(Tile,CollectedDrop,DestroyedDrop){
		this.tile = Tile;
		this.collectedDrop = CollectedDrop;
		this.destroyedDrop = DestroyedDrop;
	}
	draw(ctx){
		this.tile.update(ctx);
	}
	update(ctx){
		this.draw(ctx);
	}
}

class Block {
	constructor(Tile,Item,Type) {
		this.tile = Tile;
		this.item = Item;
		this.type = Type;
	}
	draw(ctx) {
		this.tile.update(ctx);
	}
	update(ctx) {
		this.draw(ctx);
	}
}

class Player{
	constructor(x,y,w,h,c,MaxSpd){
		this.rect = new Rect(x,y,w,h,c);
		this.maxSpd = MaxSpd;
		this.spd = {x:0,y:0};
		this.canJump = false;
		this.G = 0.25;

		this.Inv = new Inventory();
		this.CurrentSlot = 0;

		this.keys = {
			w:false,
			a:false,
			d:false,
			up:false,
			left:false,
			right:false,
		};
	}
	updatePos(){
		if(this.keys.a || this.keys.left){
			this.spd.x = -this.maxSpd;
		}else if(this.keys.d || this.keys.right){
			this.spd.x = this.maxSpd;
		}else{
			this.spd.x = 0;
		}
		if(this.keys.w || this.keys.up){
			if(this.canJump){
				this.spd.y = -this.maxSpd;
				this.canJump = false;
			}
		}
		
		
		if(this.spd.y <= 100){
			this.spd.y += this.G;
		}
		this.rect.x += this.spd.x;
		this.rect.y += this.spd.y;
		
	}
	
	drawInv(x, y, scl) {	
		let i = 0;
		for (let key in this.Inv.Items) {
			ctx.save();
			ctx.font = "32px Arial";
			if (this.CurrentSlot == this.Inv.Items[key].id) {
				ctx.fillText(`Held Item:${this.Inv.Items[this.CurrentSlot].name}`, canvas.width-400, y);
			}
			ctx.fillText(`${this.Inv.Items[key].name}:${this.Inv.Items[key].amount}`,x,y+(i*scl));
			ctx.fillText(`${this.Inv.Items[key].name}:${this.Inv.Items[key].amount}`,x,y+(i*scl));
			ctx.restore();
			i++;
		}
	}
	draw(ctx) {
		this.rect.draw(ctx);
	}
	update(ctx){
		this.updatePos();
		this.draw(ctx);
	}
}
