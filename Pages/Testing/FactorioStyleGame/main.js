let canvas = document.getElementById('game');

canvas.style.position = "absolute";
canvas.style.margin = 'auto';
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "darkgrey";

let ctx = canvas.getContext('2d');

canvas.width = 720;
canvas.height = 720;

let p;

let resources = [];

let gridSize;
let gridPos;
let scl;

let gridPosTaken;

let resourcenames = [
    {name:'Iron',color:'silver'},
    {name:'Wood',color:'brown'},
    {name:'Gold',color:'yellow'}
];

function TestCollision(rect1,rect2){
    return rect1.pos.x < rect2.pos.x + rect2.size.x &&
   rect1.pos.x + rect1.size.x > rect2.pos.x &&
   rect1.pos.y < rect2.pos.y + rect2.size.y &&
   rect1.pos.y + rect1.size.y > rect2.pos.y;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
	Make it so each chunk is in its own array within the resource array then when you generate each chunk check within
	that chunks array to see if any of the blocks are overlapping and if they are then replace that object;
*/

function GenerateResources(gridposOffset,resourcesArr){
	let tempArray = [];
	for(let i=0; i<25; i++){
		let r = Math.trunc(Math.random()*resourcenames.length);
		let rpx = Math.trunc((getRandomInt((gridPos.x+gridposOffset.x) * gridSize,((gridPos.x+gridposOffset.x) * gridSize)+gridSize-scl))/scl);
		let rpy = Math.trunc((getRandomInt((gridPos.y+gridposOffset.y) * gridSize,((gridPos.y+gridposOffset.y) * gridSize)+gridSize-scl))/scl);
		if(tempArray.length > 0){
			for(let j=tempArray.length-1; j>0; j--){
				if(TestCollision(tempArray[j].rect,new Rect(new Vector2(rpx*scl,rpy*scl),new Vector2(scl,scl)))){
					i--;
					console.log("Taken");
					tempArray[j].canDie = true;
					break;
				}
			}
		}
		tempArray.push(
			new Resource(resourcenames[r].name,
			new Rect(
			new Vector2(rpx*scl,rpy*scl),
			new Vector2(32,32),
			new Color(resourcenames[r].color)))
			);
		
	}
	resourcesArr.push(tempArray);
    gridPosTaken[`${(gridPos.x+gridposOffset.x)}${gridPos.y+gridposOffset.y}`] = true;
}

function GenerateChuncks(resourcesArr){
    if(gridPosTaken[`${gridPos.x}${gridPos.y}`] === undefined){
        GenerateResources(new Vector2(0,0),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x-1}${gridPos.y}`] === undefined){
        GenerateResources(new Vector2(-1,0),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x+1}${gridPos.y}`] === undefined){
        GenerateResources(new Vector2(1,0),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x}${gridPos.y-1}`] === undefined){
        GenerateResources(new Vector2(0,-1),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x}${gridPos.y+1}`] === undefined){
        GenerateResources(new Vector2(0,1),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x-1}${gridPos.y-1}`] === undefined){
        GenerateResources(new Vector2(-1,-1),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x-1}${gridPos.y+1}`] === undefined){
        GenerateResources(new Vector2(-1,1),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x+1}${gridPos.y-1}`] === undefined){
        GenerateResources(new Vector2(1,-1),resourcesArr);
    }
    if(gridPosTaken[`${gridPos.x+1}${gridPos.y+1}`] === undefined){
        GenerateResources(new Vector2(1,1),resourcesArr);
    }
	
}


function start(){
    p = new Player(new Rect(new Vector2(),new Vector2(32,32),new Color("Coral")));
    gridPosTaken = [
    ];
    gridPos = new Vector2(0,0);
    scl = 32;
    gridSize = 720;
    //resources = new Resource(new String("Iron"),new Rect(new Vector2(0,0),new Vector2(32,32), new Color("Iron")));
}



function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    GenerateChuncks(resources);
    ctx.save();
        ctx.fillStyle= "black";
        ctx.fillText(`MouseX: ${p.mouse.rect.pos.x}`,16,32);
        ctx.fillText(`MouseY: ${p.mouse.rect.pos.y}`,16,48);
        ctx.fillText(`MouseX+CameraX: ${p.mouse.rect.pos.x+p.camera.pos.x}`,16,64);
        ctx.fillText(`MouseY+CameraY: ${p.mouse.rect.pos.y+p.camera.pos.y}`,16,80);
        ctx.fillText(`MouseY+CameraX-CanvasW: ${p.mouse.rect.pos.y+p.camera.pos.y-canvas.width/2}`,16,80+16);
        ctx.fillText(`MouseY+CameraY-CanvasH: ${p.mouse.rect.pos.y+p.camera.pos.y-canvas.height/2}`,16,80+32);
        ctx.fillText(`CameraX: ${p.camera.pos.x}`,16,96+32);
        ctx.fillText(`CameraY: ${p.camera.pos.y}`,16,112+32);
        
    ctx.restore();
    ctx.save();
        ctx.translate(-p.camera.pos.x + canvas.width/2,-p.camera.pos.y + canvas.height/2);
        gridPos = new Vector2(Math.trunc(p.rect.pos.x/gridSize),Math.trunc(p.rect.pos.y/gridSize));
        for(let key in resources){
			resources[key].forEach(resource =>{
                if(TestCollision(resource.rect,{pos:{x:p.camera.pos.x-p.camera.size.x/2,y:p.camera.pos.y-p.camera.size.y/2},size:new Vector2(p.camera.size.x,p.camera.size.y)})){
					resource.Update(ctx); 
				} 
                if(TestCollision(resource.rect,new Rect(new Vector2(p.mouse.rect.pos.x+p.camera.pos.x-canvas.width/2,p.mouse.rect.pos.y+p.camera.pos.y-canvas.height/2),new Vector2(p.mouse.rect.size.x,p.mouse.rect.size.y)))){
                  if(p.mouse.keys[1]){
                    resource.canDie = true;
                  }  
                }
			});
        }
        for(let key in resources){
            for(let key1 in resources[key]){
                if(resources[key][key1].canDie){
                    delete resources[key][key1];
                }
            }
        }
        p.Update(ctx);
    ctx.restore();
    p.mouse.Update(ctx);
}
document.onkeydown = (e) =>{
    p.keys[e.key] = true;
};
document.onkeyup = (e) =>{
    p.keys[e.key] = false;
};
document.onmousedown = (e) =>{
    p.mouse.keys[e.which] = true;
};
document.onmouseup = (e) =>{
    p.mouse.keys[e.which] = false;
};
document.oncontextmenu = (e) =>{
    e.preventDefault();
}
document.onmousemove = e =>{
    p.mouse.rect.pos.Set(e.clientX - p.mouse.rect.size.x/2 - canvas.getBoundingClientRect().left,e.clientY- p.mouse.rect.size.y/2 - canvas.getBoundingClientRect().top);
}

start();
update();