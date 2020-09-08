class Vector2{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
    Add(v2){
        this.x += v2.x;
        this.y += v2.y;
    }
    Get(){
        return {x:this.x,y:this.y};
    }
    Set(x,y){
        this.x = x;
        this.y = y;
    }
}
class Color{
    constructor(){ 
        if(arguments.length === 1){
            this.c = arguments[0];
        }else if(arguments.length === 3){
            this.c = `rgb(${arguments[0]},${arguments[1]},${arguments[2]})`;
        }else if(arguments.length === 4){
            this.c = `rgba(${arguments[0]},${arguments[1]},${arguments[2]},${arguments[3]})`;
        }else{
            this.c = "black";
        }
    }
}
class Rect{
    constructor(pos = new Vector2(), size=new Vector2(32,32),color = new Color()){
        this.pos = pos;
        this.size = size;
        this.c = color.c;
    }
    Draw(ctx){
        ctx.save();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
        ctx.restore();
    }
    Update(ctx){
        this.Draw(ctx);
    }
}

class Mouse{
    constructor(rect = new Rect(new Vector2(),new Vector2(8,8))){
        this.rect = rect;
        this.keys = [];
    }
    Draw(ctx){
        this.rect.Update(ctx);
    }
    Update(ctx){
        this.Draw(ctx);
    }
}

class Camera{
    constructor(pos = new Vector2(), safeZone = new Vector2(), maxSpd = 5){
        this.pos = pos;
        this.size = new Vector2(720,720);
        //this.safeZone = safeZone;
        this.maxSpd = maxSpd;
    }
    UpdatePos(pos){
        this.pos = pos;
    }
}

class Resource{
    constructor(name = new String(),rect = new Rect()){
        this.name = name;
        this.rect = rect;
        this.amount = 1000;
    }
    Draw(ctx){
        this.rect.Update(ctx);
    }
    Update(ctx){
        this.Draw(ctx);
    }
}

class Player{
    constructor(rect = new Rect(),maxSpd = 5){
        this.rect = rect;
        this.maxSpd = maxSpd;
        
        this.camera = new Camera();

        this.spd = new Vector2(0,0);
        this.keys = new Array();
    }
    CheckKeys(){
        if(this.keys["w"]){
            this.spd.y = -this.maxSpd;
        }else if(this.keys["s"]){
            this.spd.y = this.maxSpd;
        }else{
            this.spd.y = 0
        }
        if(this.keys["a"]){
            this.spd.x = -this.maxSpd;
        }else if(this.keys["d"]){
            this.spd.x = this.maxSpd;
        }else{
            this.spd.x = 0
        }
    }
    UpdatePos(){
        this.rect.pos.Add(this.spd);
    }
    Draw(ctx){
        this.rect.Update(ctx);
    }
    Update(ctx){
        this.CheckKeys();
        this.UpdatePos();
        this.camera.UpdatePos(this.rect.pos);
        this.Draw(ctx);
    }
}
