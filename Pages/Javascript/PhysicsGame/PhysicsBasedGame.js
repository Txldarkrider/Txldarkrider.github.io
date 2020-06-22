let Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;

let engine;
let world;
let boxes = [];
let ground;
let walls = [];
let randomfloors = [];
let particles = [];

function setup(){
    createCanvas(720,720);
    engine = Engine.create();
    let prev = null;
    
    for(let x=20; x<480; x+=40){
        
        let fixed = false;
        if(!prev){
            fixed = true;
        }else{
            fixed = false;
        }
        
        let p = new Particle(x+300,200,10,fixed);
        
        
        particles.push(p);
        if(prev !== null){
        let options = {
            bodyA:p.body,
            bodyB:prev.body,
            length:25,
            stiffness:0.5,
        };
        
        let constraint = Constraint.create(options);
        World.add(engine.world,constraint);
        }
        prev = p;
            
    }
    randomfloors.push(new Boundary(128/2,480,128,10,35));
    
    ground = new Boundary(width/2,height-5,width,40,0);
    walls.push(new Boundary(0,height/2,40,height*10,0));
    walls.push(new Boundary(width,height/2,40,height*10,0));
    
    World.add(engine.world,walls);
    World.add(engine.world,ground);
}

function draw(){
    Engine.update(engine);
    background('grey');
    for(let key in boxes){
        boxes[key].show();
    }
    for(let key in walls){
        walls[key].show();
    }
    for(let key in randomfloors){
        randomfloors[key].show();
    }
    for(let key in particles){
        particles[key].show();
    }
    // line(particles[0].body.position.x,particles[0].body.position.y,particles[1].body.position.x,particles[1].body.position.y);
    ground.show();
} 

function mousePressed(){
    boxes.push(new Box(mouseX,mouseY,20,20));
}