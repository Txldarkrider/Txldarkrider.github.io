let canvas = document.getElementById("canvas");
canvas.style.position = "absolute";
canvas.style.margin = "auto";
canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.backgroundColor = "#555";

canvas.width = 600;
canvas.height = 600;

let ctx = canvas.getContext("2d");
let player;
let enemies;

let spawnTimer;
let spawnTimerLimit;
let spawnTimerSubtraction;

let lastEnemyPosIndex;
let enemyPositions;

function TestCollision(rect1,rect2){
    return rect1.pos.x < rect2.pos.x + rect2.size.x && 
    rect1.pos.x + rect1.size.x > rect2.pos.x && 
    rect1.pos.y < rect2.pos.y + rect2.size.y && 
    rect1.pos.y + rect1.size.y > rect2.pos.y;
}

function addEnemy(){
    if(lastEnemyPosIndex+1 <= enemyPositions.length-1){
        if(spawnTimer % spawnTimerLimit === 0){
            lastEnemyPosIndex +=1;
            enemies.push(new Enemy(new Rect(new Vector2(enemyPositions[lastEnemyPosIndex].x,enemyPositions[lastEnemyPosIndex].y),new Vector2(32,32),new Color("green"))))
        }   
    } 
}

function setup(){
    spawnTimer = 1;
    spawnTimerLimit = 500;
    lastEnemyPosIndex = 0;
    enemyPositions = [
        new Vector2(canvas.width-32,0),
        new Vector2((canvas.width/2)-16,0),
        new Vector2(0,0),
        new Vector2(0,(canvas.height/2)-32),
        new Vector2(0,canvas.height-32),
        new Vector2((canvas.width/2)-16,canvas.height-32),
        new Vector2(canvas.width-32,canvas.height-32),
        new Vector2(canvas.width-32,(canvas.height/2)-32),
    ];

    enemies = [
        new Enemy(new Rect(new Vector2(enemyPositions[lastEnemyPosIndex].x,enemyPositions[lastEnemyPosIndex].y),new Vector2(32,32),new Color("green"))),
    ];
    player = new Player(new Rect(new Vector2(canvas.width/2-16,canvas.height/2-16),new Vector2(32,32),new Color("coral")),new Vector2(5,5));
}
function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    addEnemy();

    player.update(ctx);
    enemies.forEach(enemy => {
        for(let key in enemy.bullets){

            if(TestCollision(enemy.bullets[key].rect,player.rect)){
                enemy.bullets[key].canDie = true;
                setup();
            }
            if(enemy.bullets[key].canDie){
                delete enemy.bullets[key];
            }
        }
        enemy.setAimAngle(player.rect.pos);
        enemy.update(ctx,player.spdMod);
    });
    spawnTimer += 1;
}

document.addEventListener("keydown",(e)=>{
    player.keys[e.key] = true;
});
document.addEventListener("keyup",(e)=>{
    player.keys[e.key] = false;
});

setup();
update();
