class Line{
	constructor(sx,sy,ex,ey){
		this.x1 = sx;
		this.y1 = sy;
		this.x2 = ex;
		this.y2 = ey;
	}
	draw(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.x1,this.y1);
		ctx.lineTo(this.x2,this.y2);
		ctx.stroke();
		ctx.restore();
	}
}
class Platform{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.line = new Line(this.x,this.y,this.x+this.w,this.y+this.h);
	}
	draw(ctx){
		this.line.draw(ctx);
	}
	
}
class Tri{
	constructor(x,y,w,h,r){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.body = undefined;
		this.r = r;
		if(this.r === 0){
			this.body =
			[
				new Line(this.x,this.y,this.x,this.y+this.h),
				new Line(this.x,this.y,this.x+this.w,this.y+this.h),
				new Line(this.x+this.w,this.y+this.h,this.x,y+this.h)
			];
		}
		if(this.r === 1){
			this.body =
			[
				new Line(this.x,this.y,this.x,this.y+this.h),
				new Line(this.x,this.y,this.x-this.w,this.y+this.h),
				new Line(this.x-this.w,this.y+this.h,this.x,y+this.h)
			];
		}
	}
	draw(ctx){
		for(let key in this.body){
			this.body[key].draw(ctx);
		}
	}
}
class Rect{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.body =
		[
		//Top
		new Line(this.x,this.y,this.x+this.w,this.y)
		,
		//bottom
		new Line(this.x+this.w,this.y+this.h,this.x,this.y+this.h)
		,
		//Right
		new Line(this.x+this.w,this.y,this.x+this.w,this.y+this.h)
		,
		//Left
		new Line(this.x,this.y,this.x,this.y+this.h)
		];
	}
	draw(ctx){
		for(let key in this.body){
			this.body[key].draw(ctx);
		}
	}
}

