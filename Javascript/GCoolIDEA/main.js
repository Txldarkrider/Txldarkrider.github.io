let canvas = document.getElementById("game");
canvas.style.position = "absolute";
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "#555";
canvas.width = window.innerWidth/3;
canvas.height = window.innerHeight/1.5;
let ctx = canvas.getContext("2d");

//Test if two rectangles overlap and then returns true(they overlap) or false(they dont overlap)
Math.testCollision = function(rect1,rect2){
	return rect1.x < rect2.x + rect2.w &&
   rect1.x + rect1.w > rect2.x &&
   rect1.y < rect2.y + rect2.h &&
   rect1.y + rect1.h > rect2.y;
}

Math.Mag = function(x,y){
	return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}

//Gets a random float number based on the min and max you put in.
Math.getRandomFloat = function(min, max) {
    return Math.random() * (max - min) + min;
}
//Gets a random int based on the min and max you put in.
Math.getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//just classes nothing really to explain the constructors set most of the values and then u can also set them in like the update
//or anything like that
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
}

class Ellipse{
	constructor(x,y,r,c){
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
	}
	draw(ctx){
		ctx.save();
		ctx.fillStyle = this.c;
		ctx.strokeStyle = this.c;
		ctx.beginPath();
		ctx.arc(this.x, this.y,this.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.restore()
	}
}

class Ball{
	constructor(ellipse,maxspd){
		this.ellipse = ellipse;
		this.maxSpd = maxspd;
		this.originalSpot = {x:this.ellipse.x,y:this.ellipse.y}
		this.collision = {
			left: new Rect(this.ellipse.x,this.ellipse.y,5,this.ellipse.r,"rgba(0,0,0,0.25)"),
			right: new Rect(this.ellipse.x,this.ellipse.y,5,this.ellipse.r,"rgba(0,0,0,0.25)"),
			top: new Rect(this.ellipse.x,this.ellipse.y,5,this.ellipse.r,"rgba(0,0,0,0.25)"),
			bottom: new Rect(this.ellipse.x,this.ellipse.y,5,this.ellipse.r,"rgba(0,0,0,0.25)"),
		}
		this.spd = {x:-this.maxSpd,y:this.maxSpd};
		this.i = 0;
	}
	draw(ctx){
		//draws the ellipse
		this.ellipse.draw(ctx);
		//looping through the collisions and drawing them
		for(let key in this.collision){
			this.collision[key].draw(ctx);
		}
	}
	collide(canvas,other){
		//is testing if the ellipse is touching the edge of the canvas
		if(this.ellipse.x + this.ellipse.r + this.spd.x > canvas.width || this.ellipse.x + this.spd.x < this.ellipse.r){
			this.spd.x *= -1;
		}
		if(this.ellipse.y + this.ellipse.r + this.spd.y > canvas.height || this.ellipse.y + this.spd.y < this.ellipse.r){
			this.spd.y *= -1;
		}
	}
	updatePos(){
		//Moves the object using the spd that we have set for it
		this.ellipse.x += this.spd.x;
		this.ellipse.y += this.spd.y;
		this.collision = {
			left: new Rect(this.ellipse.x-this.ellipse.r-this.ellipse.r/16,this.ellipse.y-this.ellipse.r-2.5,this.ellipse.r,this.ellipse.r*2+5,"rgba(0,0,0,0)"),
			
			right: new Rect(this.ellipse.x+this.ellipse.r-this.ellipse.r,this.ellipse.y-this.ellipse.r-2.5,this.ellipse.r,this.ellipse.r*2+5,"rgba(0,0,0,0)"),
			
			top: new Rect(this.ellipse.x-this.ellipse.r-2.5,this.ellipse.y-this.ellipse.r-this.ellipse.r/16,this.ellipse.r*2+5,this.ellipse.r,"rgba(0,0,0,0)"),
			
			bottom: new Rect(this.ellipse.x-this.ellipse.r-2.5,this.ellipse.y+this.ellipse.r-this.ellipse.r,this.ellipse.r*2+5,this.ellipse.r,"rgba(0,0,0,0)"),
		}
		if(this.spd.x >= 10){
			this.spd.x = 10;
		}else if(this.spd.x <= -10){
			this.spd.x = -10;
		}
		if(this.spd.y >= 10){
			this.spd.y = 10;
		}else if(this.spd.y <= -10){
			this.spd.y = -10;
		}
	}
	update(canvas,other){
		this.collide(canvas,other);
		this.updatePos();
	}
}
let balls = []
function setup(){
	//pushes a bunch of balls into the balls array with a bunch of random values
	for(let i=0; i<10; i++){
		//balls.push(new Ball(new Ellipse(96,(i*256)+128,32,`rgb(${Math.getRandomInt(100,255)},${Math.getRandomInt(100,255)},${Math.getRandomInt(100,255)})`),5));
		balls.push(new Ball(new Ellipse(Math.getRandomInt(96,canvas.width-96),Math.getRandomInt(96,canvas.height-96),Math.getRandomInt(32,64),`rgb(${Math.getRandomInt(100,255)},${Math.getRandomInt(100,255)},${Math.getRandomInt(100,255)})`),5));
	}
}


function update(){
	//asks the browser 'hey can i update now' and does when it says 'yeah sure buddy go ahead and update'
	requestAnimationFrame(update);
	//Clears the screen by drawing the background color that you have set in styling over everything to make it look like it cleared everthing
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//loops through the entire balls array.
	for(let key in balls){
		//draws and update the balls.
		balls[key].draw(ctx);
		balls[key].update(canvas);
		//loops through the balls array again.
		for(let key1 in balls){
			//checks to see if the current ball the first key is on isnt the same as the other ball if we dont have this then it would try to collide with itself
			// and we dont want that.
			if(balls[key] != balls[key1]){
				//Test collision on all of the collisions that we have set up
				if(Math.testCollision(balls[key].collision.left,balls[key1].collision.right)){
					//if they are colliding then we push them apart by adding the either positive or negative maxspd to make it look 
					//like they are bouncing/repeling each other when they touch.
					balls[key].spd.x += balls[key].maxSpd;
					//balls[key].spd.x *= -1;
				}else if(Math.testCollision(balls[key].collision.right,balls[key1].collision.left)){
					balls[key].spd.x += -balls[key].maxSpd;
					//balls[key].spd.x *= -1;
				}
				if(Math.testCollision(balls[key].collision.top,balls[key1].collision.bottom)){
					balls[key].spd.y += balls[key].maxSpd;
					//balls[key].spd.y *= -1;
				}else if(Math.testCollision(balls[key].collision.bottom,balls[key1].collision.top)){
					balls[key].spd.y += -balls[key].maxSpd;
					//balls[key].spd.y *= -1;
				}
			}
		}
	}
}
//starts the whole program.
setup();
update();