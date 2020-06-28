class Rect{
	constructor(x,y,w,h,c){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}
	draw(ctx){
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	update(ctx){
		this.draw(ctx);
	}
}
class Tile{
	constructor(x,y,w,h,c,image,id,ShowCollision,hasCollision){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.id = id;
		this.hasCollision = hasCollision;
		this.ShowCollision = ShowCollision;
		
		
	
		this.collision = {
			ColTop : new Rect(this.x+5,this.y,this.w-10,5,"white"),
			ColBottom : new Rect(this.x+5,this.y+this.h-5,this.w-10,5,"white"),
			ColRight : new Rect(this.x,this.y+5,5,this.h-10,"white"),
			ColLeft : new Rect(this.x+this.w-5,this.y+5,5,this.h-10,"white"),
		};
		if(c === undefined){
			this.c = "black";
		}else{
			this.c = c;
		}
		if(image !== undefined){
			this.image = new Image();
			this.image.src = image;
		}
	}
	draw(ctx){
		if(this.image === undefined){
			ctx.fillStyle = this.c;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}else{
			ctx.drawImage(this.image,this.x,this.y,this.w,this.h);
		}
		if(this.ShowCollision){
			for(let key in this.collision){
				this.collision[key].update(ctx);
			}
		}
	}
	update(ctx){
		this.draw(ctx);
	}
}


// class Platform{
// 	constructor(x,y,w,h){
// 		this.x = x;
// 		this.y = y;
// 		this.w = w;
// 		this.h = h;
		
// 		this.line = new Line(this.x,this.y,this.x+this.w,this.y+this.h);
// 	}
// 	draw(ctx){
// 		this.line.draw(ctx);
// 	}
	
// }
// class Tri{
// 	constructor(x,y,w,h,r){
// 		this.x = x;
// 		this.y = y;
// 		this.w = w;
// 		this.h = h;
// 		this.body = undefined;
// 		this.r = r;
// 		if(this.r === 0){
// 			this.body =
// 			[
// 				new Line(this.x,this.y,this.x,this.y+this.h),
// 				new Line(this.x,this.y,this.x+this.w,this.y+this.h),
// 				new Line(this.x+this.w,this.y+this.h,this.x,y+this.h)
// 			];
// 		}
// 		if(this.r === 1){
// 			this.body =
// 			[
// 				new Line(this.x,this.y,this.x,this.y+this.h),
// 				new Line(this.x,this.y,this.x-this.w,this.y+this.h),
// 				new Line(this.x-this.w,this.y+this.h,this.x,y+this.h)
// 			];
// 		}
// 	}
// 	draw(ctx){
// 		for(let key in this.body){
// 			this.body[key].draw(ctx);
// 		}
// 	}
// }