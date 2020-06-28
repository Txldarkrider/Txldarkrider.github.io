class Box{
    constructor(x,y,w,h){
        this.options ={
          friction:0.5,
          restitution:0.9,
        };
        this.body = Bodies.rectangle(x,y,w,h,this.options);
        this.w = w;
        this.h = h;
        World.add(engine.world,this.body);
    }
    show(){
        let pos = this.body.position;
        let angle = this.body.angle;
        
        push();
        translate(pos.x,pos.y);
        rectMode(CENTER);
        rotate(angle);
        rect(0,0,this.w,this.h);
        pop();
        
    }
}
class Particle{
    constructor(x,y,r,isStatic){
        this.options ={
          friction:0.1,
          restitution:0.5,
          isStatic:isStatic,
        };
        this.body = Bodies.circle(x,y,r,this.options);
        this.r = r;
        World.add(engine.world,this.body);
    }
    show(){
        let pos = this.body.position;
        let angle = this.body.angle;
        
        push();
        translate(pos.x,pos.y);
        rotate(angle);
        ellipse(0,0,this.r*2);
        pop();
        
    }
}