class Player{
	constructor(x,y,w,h,c,image){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.movementKeys = {
			a : false,
			d : false,
			space : false,
		};
		
		
		this.spd = {
			x:0,
			y:0,
		};
		this.MaxSpd = 2.5;
		
		this.jumpPower = 5;
		this.canJump = true;
		this.g = 0.1;
		
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
		
		this.spd.y += this.g;
		
		this.x += this.spd.x;
		this.y += this.spd.y;
		this.CheckKeys();
		// alert();
	}
	update(ctx){
		this.updatePos();
		this.draw(ctx);
	}
}