Math.getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
}
Math.getRandomInt = (min, max)=>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Vector{
    constructor(x = 0){
        this.x = x;
    }
    add(vector){
        this.x += vector.x;
    }
    subtract(vector){
        this.x -= vector.x;
    }
}
class Vector2{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
    add(vector2){
        this.x += vector2.x; 
        this.y += vector2.y;
    }
    subtract(vector2){
        this.x -= vector2.x;
        this.y -= vector2.y;
    }
}
class Color{
    constructor(){
        if(arguments.length === 4){
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
            this.a = arguments[3];
            this.c = `rgba(${arguments[0]},${arguments[1]},${arguments[2]},${arguments[3]})`;
        }else if(arguments.length === 3){
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
            this.c = `rgb(${arguments[0]},${arguments[1]},${arguments[2]})`;
        }else if(arguments.length === 1){
            this.c = arguments[0];
        }else{
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.c = `rgb(0,0,0)`;

        }
    }
}
class Rect{
    constructor(pos = new Vector2(),size = new Vector2(),color = new Color()){
        this.pos = pos;
        this.size = size;
        this.color = color;
    }
    draw(ctx){
        ctx.save();
            ctx.fillStyle = this.color.c;
            ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
        ctx.restore();
    }
}
class Mouse{
    constructor(rect = new Rect()){
        this.rect = rect;
    }
    draw(ctx){
        this.rect.draw(ctx);
    }
}
class Projectile{
    constructor(rect = new Rect(),angle = new Vector()){
        this.rect = rect;
        this.spd = new Vector2(Math.cos(angle.x/180*Math.PI)*5,Math.sin(angle.x/180*Math.PI)*5);
        this.DeathTimer = 0;
        this.DeathTimeLimit = 1000;
        this.canDie = false;
    }
    updatepos(){
        this.rect.pos.add(this.spd);
    }
    draw(ctx){
        this.rect.draw(ctx);
    }
    update(ctx){
        this.updatepos();
        this.draw(ctx);
        this.DeathTimer += 1;
        if(this.DeathTimer % this.DeathTimeLimit == 0){
            this.canDie = true;
        }
    }
}
class Player{
    constructor(rect = new Rect(),maxSpd = new Vector2()){
        this.rect = rect;
        this.spd = new Vector2();
        this.maxSpd = maxSpd;

        this.keys = [];
    }
    checkKeys(){
        if(this.keys["w"] || this.keys["ArrowUp"]){
            this.spd.y = -this.maxSpd.y;
        }else if(this.keys["s"] || this.keys["ArrowDown"]){
            this.spd.y = this.maxSpd.y;
        }else{
            this.spd.y = 0;
        }
        if(this.keys["a"] || this.keys["ArrowLeft"]){
            this.spd.x = -this.maxSpd.x;
        }else if(this.keys["d"] || this.keys["ArrowRight"]){
            this.spd.x = this.maxSpd.x;
        }else{
            this.spd.x = 0;
        }
    }
    draw(ctx){
        this.rect.draw(ctx);
    }
    updatePos(){
        this.rect.pos.add(this.spd);
    }
    update(ctx){
        this.checkKeys();
        this.updatePos();
        this.draw(ctx);
    }
}
class Enemy{
    constructor(rect = new Rect()){
        this.rect = rect;
        this.bullets = [];
        this.fireDelayTimer = Math.getRandomInt(-20,20);
        this.fireDelay = Math.getRandomInt(20,100);
    }
    setAimAngle(pos){
        this.aimAngle = new Vector(Math.atan2((pos.y-this.rect.pos.y)+Math.getRandomInt(-32,32),(pos.x-this.rect.pos.x)+Math.getRandomInt(-32,32))*180/Math.PI);
    }
    shoot(){
        this.bullets.push(new Projectile(new Rect(new Vector2(this.rect.pos.x,this.rect.pos.y),new Vector2(8,8)),this.aimAngle))
    }
    draw(ctx){
        this.rect.draw(ctx);
    }
    update(ctx){
        this.draw(ctx);
        this.bullets.forEach(bullet=>{
            bullet.update(ctx);
        })
        if(this.fireDelayTimer % this.fireDelay === 0){
            this.shoot(this.aimAngle);
        }
        this.fireDelayTimer += 1;
    }
}