class Boundary{
    constructor(x,y,w,h,angle){
        this.options = {
            isStatic: true,
            angle:angle,
        };
        this.w = w,this.h = h;
        this.body = Bodies.rectangle(x,y,w,h,this.options);
        World.add(engine.world,this.body);
    }
    show(){
        let pos = this.body.position;
        let angle = this.body.angle;
        
        push();
        translate(pos.x,pos.y);
        rectMode(CENTER);
        rotate(angle);
        fill(255,0,0);
        rect(0,0,this.w,this.h);
        pop();
    }
}