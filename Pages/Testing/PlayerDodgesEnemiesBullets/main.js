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

let score;

let state;
let mainMenuButtons;
let mainMenuText;
let titleText;
let mouse;

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
            enemies.push(new Enemy(new Rect(new Vector2(enemyPositions[lastEnemyPosIndex].x,
                        enemyPositions[lastEnemyPosIndex].y),
                        new Vector2(32,32),new Color("green"))));
            spawnTimerLimit += Math.trunc(spawnTimerLimit/3);
            spawnTimer = 1;
            //console.log(spawnTimerLimit);
        }   
    } 
}

function setup(){
    mouse = new Mouse(new Rect(new Vector2(0,0),new Vector2(16,16)));
    state = {
        Mainmenu:true,
        Game:false,
        Controls:false,
    }


    //Game Variables
    score = new Score();
    score.scoreText.pos = new Vector2(150,32);
    score.scoreText.maxSize = new Vector(24);
    score.Highscoretext.pos = new Vector2(450,32);
    score.Highscoretext.maxSize = new Vector(24);
    score.currentscore = 0;
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
    
    //MainMenu Variables
    mainMenuText = new Text();
    mainMenuText.setText(`Highscore: ${score.highscore}`);
    mainMenuText.pos = new Vector2(137,96);
    titleText = new Text();
    titleText.setText("Evasion");
    titleText.pos = new Vector2(192,64);
    titleText.maxSize = new Vector(64);
    mainMenuButtons = [
        new Button(new Text(new String("Play"),new Vector2(48,256),new Vector(32)),new Rect(new Vector2(16,256-24),new Vector2(128,32),new Color(0,0,0,0))),
        new Button(new Text(new String("Quit"),new Vector2(48,256+64),new Vector(32)),new Rect(new Vector2(16,256+(64-24)),new Vector2(128,32),new Color(0,0,0,0))),
    ];
}
function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(state.Game){
        addEnemy();

        player.update(ctx);
        enemies.forEach(enemy => {
            for(let key in enemy.bullets){
                
                if(TestCollision(enemy.bullets[key].rect,player.rect)){
                    enemy.bullets[key].canDie = true;
                    score.SetHighScore(score.currentscore);
                    setup();
                }
                if(enemy.bullets[key].canDie){
                    delete enemy.bullets[key];
                }
            }
            enemy.update(ctx,player.spdMod,player.rect.pos,player.isSlowmo);
        });

        score.scoreText.setText(`Score: ${score.currentscore}`);    
        score.scoreText.draw(ctx); 
        score.Highscoretext.setText(`Highscore: ${score.highscore}`);    
        score.Highscoretext.draw(ctx);
        
        spawnTimer += 1;
        score.currentscore += 1;
    }else if(state.Mainmenu){
        titleText.draw(ctx);
        mainMenuText.draw(ctx);
        mainMenuButtons.forEach(button=>{
            if(TestCollision(button.rect,mouse.rect)){
                button.onmousein();    
                if(button.text.text == "Play"){
                    if(mouse.keys[1]){
                        state.Game = true;
                        state.Mainmenu = false;
                    }
                }else if(button.text.text == "Quit"){
                    if(mouse.keys[1]){
                        location.replace("/games.html");
                    }
                }
            }else{
                button.onmouseout();
            }
            button.draw(ctx);
        });
    }
    mouse.draw(ctx);
}

document.addEventListener("mousemove",(e)=>{
    mouse.rect.pos = new Vector2(e.clientX-canvas.getBoundingClientRect().left-8,e.clientY-canvas.getBoundingClientRect().top-8);
});
document.addEventListener("mousedown",(e)=>{
    mouse.keys[e.which] = true;
});
document.addEventListener("mouseup",(e)=>{
    mouse.keys[e.which] = false;
});
document.addEventListener("keydown",(e)=>{
    player.keys[e.key] = true;
});
document.addEventListener("keyup",(e)=>{
    player.keys[e.key] = false;
});

setup();
update();
