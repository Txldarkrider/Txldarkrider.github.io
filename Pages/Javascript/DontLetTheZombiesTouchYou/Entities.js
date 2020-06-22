class Projectile{
	constructor(x,y,w,h,c,t,angle){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.t = t;
		this.maxSpd = 2;
		this.i = 0;
	
		this.spd = {
			x:Math.cos(angle/180*Math.PI)* this.maxSpd,
			y:Math.sin(angle/180*Math.PI)* this.maxSpd
		};
	}
	updatePos(){
		this.x += this.spd.x;
		this.y += this.spd.y;
	}
	draw(ctx){
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	update(ctx){
		this.updatePos();
		this.draw(ctx);
		this.i++;
	}
}

class Player{
	constructor(x,y,w,h,c){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.keys = {};
		this.bullets = [];
		this.spd = {
			x:0,
			y:0
		};
		this.score = 0;
		this.maxSpd = 5;
		this.spdboost = 1;
		this.aimangle = 0;
		this.defaultspd = 5;
		this.dodge = false;
		this.damage = 1;
	}
	getKeyDown(evt){
		if(evt.key === "w"){
			this.spd.y = -this.maxSpd;
		}
		if(evt.key === "s"){
			this.spd.y = this.maxSpd;
		}
		if(evt.key === "a"){
			this.spd.x = -this.maxSpd;
		}
		if(evt.key === "d"){
			this.spd.x = this.maxSpd;
		}
	}
	getKeyUp(evt){
		if(evt.key === "w"){
			this.spd.y = 0;
		}
		if(evt.key === "s"){
			this.spd.y = 0;
		}
		if(evt.key === "a" || evt.key === "d"){
			this.spd.x = 0;
		}
	}
	mouseMove(evt){
		this.aimangle = Math.trunc(Math.atan2((evt.clientY - document.getElementById('game').getBoundingClientRect().top)-this.y,(evt.clientX - document.getElementById('game').getBoundingClientRect().left)-this.x) / Math.PI * 180);
	}
	mouseDown(evt){
		// alert(evt.which);
		switch(evt.which){
			case 1:
				
				this.shootProjectile();
				break;
			case 2:
				
				break;
			case 3:
				this.dodge = true;
				break;
		}
	}
	mouseUp(evt){
		// alert(evt.which);
		switch(evt.which){
			case 1:
				
				// this.shootProjectile();
				break;
			case 2:
				
				break;
			case 3:
				// this.spdboost = 1;
				break;
		}
	}
	shootProjectile(){
		this.bullets.push(new Projectile(this.x,this.y,16,16,"black","Regular",this.aimangle));
	}
	collideWithEdgesOfArena(a){
		if(this.x + this.w >= a.width){
		this.x -= this.maxSpd;
		}
		if(this.x <= 0){
			this.x += this.maxSpd;
		}
		if(this.y + this.h >= a.height){
			this.y -= this.maxSpd;
		}
		if(this.y <= 0){
			this.y += this.maxSpd;
		}
	}
	updatePos(){
		if(this.dodge === true){
			this.spdboost = 20;
			this.dodge = false;
		}else{
			this.spdboost = 1;
		}
		this.x += this.spd.x * this.spdboost;
		this.y += this.spd.y * this.spdboost;
	}
	draw(ctx,canvas){
		
		ctx.save();
		ctx.font = "64px Georgia";
		ctx.fillStyle = "black";
		ctx.fillText(`Kills: ${this.score}`,canvas.width/3,64);
		ctx.restore();
		
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.save();
		for(let key in this.bullets){
			this.bullets[key].update(ctx);
			if(this.bullets[key].i >= 100){
				delete this.bullets[key];
			}
		}
		ctx.restore();
		
	}
	update(ctx,canvas,a){
		this.draw(ctx,canvas);
		this.updatePos();
		this.collideWithEdgesOfArena(a);
	}
}

class Camera{
	constructor(){
		
	}
}

class Enemy{
	constructor(x,y,w,h,c,t,target){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.t = t;
		this.spd = {
			x:0,
			y:0
		};
		this.hp = 1;
		this.maxSpd = 2.5;
		this.target = target;
	}
	moveTowardTarget(target){
		if(target.x < this.x){
			this.spd.x = -this.maxSpd;
		}
		if(target.x > this.x){
			this.spd.x = this.maxSpd;
		}
		if(target.y < this.y){
			this.spd.y = -this.maxSpd;
		}
		if(target.y > this.y){
			this.spd.y = this.maxSpd;
		}
	}
	collide(t){
		if(this.x + this.w > t.x && this.x < t.x &&this.y < t.y + t.h && this.y > t.y){
			this.x -= this.maxSpd;
		}
		if(this.x + this.w < t.x && this.x > t.x &&this.y < t.y + t.h && this.y > t.y){
			this.x += this.maxSpd;
		}
	}
	updatePos(){
		this.x += this.spd.x;
		this.y += this.spd.y;
	}
	draw(ctx){
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	update(ctx){
		this.moveTowardTarget(this.target);
		this.updatePos();
		this.draw(ctx);
	}
}