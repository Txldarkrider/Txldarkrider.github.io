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

class Mouse{
    constructor(rect){
        this.rect = rect;
        this.keys = [];
    }
    draw(ctx){
        this.rect.draw(ctx);
    }
}

class Projectile{
    constructor(rect,angle){
        this.rect = rect;
        this.spd = {
            x:Math.cos(angle/180*Math.PI)*5,
            y:Math.sin(angle/180*Math.PI)*5
        }
        this.DeathTimer = 0;
        this.DeathTimeLimit = 100;
        this.canDie = false;
    }
    updatepos(){
        this.rect.x += this.spd.x;
        this.rect.y += this.spd.y;
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
    constructor(rect){
        this.rect = rect;

        this.mouse = new Mouse(new Rect(this.rect.x,this.rect.y,8,8));

        this.shootSpd = 20;

        this.delayShootTimer = 0;

        this.spd = {
            x:0,
            y:0,
        };
        this.maxSpd = 5;
        this.keys = [];
        
        this.projectiles = [];
        this.aimAngle;
    }
    checkMouse(){
        if(this.mouse.keys[1]){
            this.shoot();
        }
    }
    setAimAngle(x,y){
        this.aimAngle = this.getAngleInRadians(x,y)*180/Math.PI;
    }
    getAngleInRadians(x,y){
        return Math.atan2(y,x);
    }
    getAngleInDegrees(x,y){
        return this.getAngleInRadians(x,y)*180/Math.PI;
    }
    shoot(){
        if(this.delayShootTimer % this.shootSpd == 0){
            this.projectiles.push(new Projectile(new Rect(this.rect.x,this.rect.y,16,16,"black"),this.aimAngle));
        }
    }
    drawprojectiles(ctx){
        for(let key in this.projectiles){
            this.projectiles[key].update(ctx);
        }
    }
    killProjectiles(){
        for(let key in this.projectiles){
            if(this.projectiles[key].canDie){
                delete this.projectiles[key];
                continue;
            }
        }
    }
    draw(ctx){
        this.rect.draw(ctx);
    }
    checkkeys(){
        if(this.keys["w"]){
            this.spd.y = -this.maxSpd;
        }else if(this.keys["s"]){
            this.spd.y = this.maxSpd;
        }else{
            this.spd.y = 0;
        }
        if(this.keys["a"]){
            this.spd.x = -this.maxSpd;
        }else if(this.keys["d"]){
            this.spd.x = this.maxSpd;
        }else{
            this.spd.x = 0;
        }   
    }
    checkCollisions(){
        if(this.rect.x >= canvas.width-this.rect.w){
            this.rect.x -= this.maxSpd;
        }else if(this.rect.x <= 0){
            this.rect.x += this.maxSpd;
        }
        if(this.rect.y >= canvas.height-this.rect.h){
            this.rect.y -= this.maxSpd;
        }else if(this.rect.y <= 0){
            this.rect.y += this.maxSpd;
        }
    }
    updatepos(){
        this.rect.x += this.spd.x;
        this.rect.y += this.spd.y;
    }
    update(ctx){
        this.checkkeys();
        this.checkMouse();
        this.updatepos();

        this.checkCollisions();

        this.draw(ctx);
        this.drawprojectiles(ctx);
        this.killProjectiles();

        this.delayShootTimer += 1;
    }
}  