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
let m;

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
    m = new Mouse();
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
    m.Update(ctx);
    ctx.save();
        ctx.translate(-p.camera.pos.x + canvas.width/2,-p.camera.pos.y + canvas.height/2);
        gridPos = new Vector2(Math.trunc(p.rect.pos.x/gridSize),Math.trunc(p.rect.pos.y/gridSize));
        for(let key in resources){
			resources[key].forEach(resource =>{
				if(TestCollision(resource.rect,{pos:{x:p.camera.pos.x-p.camera.size.x/2,y:p.camera.pos.y-p.camera.size.y/2},size:new Vector2(p.camera.size.x,p.camera.size.y)})){
					resource.Update(ctx);
				}
				if(resource.canDie){
					delete resource;
				}
			});
		}
        p.Update(ctx);
    ctx.restore();
}
document.onkeydown = (e) =>{
    p.keys[e.key] = true;
};
document.onkeyup = (e) =>{
    p.keys[e.key] = false;
};
document.onmousedown = (e) =>{
    m.keys[e.which] = true;
};
document.onmouseup = (e) =>{
    m.keys[e.which] = false;
};
document.oncontextmenu = (e) =>{
    e.preventDefault();
}
document.onmousemove = e =>{
    m.rect.pos.Set(e.clientX - m.rect.size.x/2 - canvas.getBoundingClientRect().left,e.clientY- m.rect.size.y/2 - canvas.getBoundingClientRect().top);
}

start();
update();