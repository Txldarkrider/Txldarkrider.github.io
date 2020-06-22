class Player{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.MaxSpd = 5;
		this.g = 1;
		this.spd = {
			x:0,
			y:0,
		};
		this.body = new Rect(this.x,this.y,this.w,this.h);
		
	}
	updatePos(x,y){
		for(let key in this.body.body){
			this.body.body[key].x1 += x;
			this.body.body[key].y1 += y;
		}
		for(let key in this.body.body){
			this.body.body[key].x2 += x;
			this.body.body[key].y2 += y;
		}
	}
	draw(ctx){
		this.body.draw(ctx);
	}
	update(ctx){
		this.spd.y += this.g;
		this.draw(ctx);
		this.updatePos(this.spd.x,this.spd.y);
	}
}