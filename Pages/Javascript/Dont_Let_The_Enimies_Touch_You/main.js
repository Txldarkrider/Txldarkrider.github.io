let canvas = document.getElementById("game");

canvas.style.left = 0;
canvas.style.right = 0;
canvas.style.top = 0;
canvas.style.bottom = 0;

canvas.style.backgroundColor = "#555";

console.log(window);

if(window.screen.availWidth >= 720){
    canvas.style.position = "absolute";
    canvas.style.margin = "auto";
    canvas.width = 720;
    canvas.height = 720;
}else{
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight/2;
}
let ctx = canvas.getContext("2d");

let enemies = [];

let player = new Player(new Rect(canvas.width/2-16,canvas.height/2-16,32,32,"coral"));

function start(){

}
function update(){
    window.requestAnimationFrame(update);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update(ctx);
    player.mouse.draw(ctx);
    player.setAimAngle(Math.round(player.mouse.rect.x - player.rect.x),Math.round(player.mouse.rect.y - player.rect.y));
}

document.onkeydown = (e) =>{
    player.keys[e.key] = true;
}
document.onkeyup = (e) =>{
    player.keys[e.key] = false;
}
document.onmousemove = (e)=>{
    player.mouse.rect.x = e.clientX - canvas.getBoundingClientRect().left - player.mouse.rect.w/2;
    player.mouse.rect.y = e.clientY - canvas.getBoundingClientRect().top - player.mouse.rect.h/2;
}
document.ontouchmove = (e)=>{

    player.mouse.rect.x = e.touches[e.touches.length-1].clientX - canvas.getBoundingClientRect().left - player.mouse.rect.w/2;
    player.mouse.rect.y = e.touches[e.touches.length-1].clientY - canvas.getBoundingClientRect().top - player.mouse.rect.h/2;
}
document.onmousedown = (e)=>{
    player.mouse.keys[e.which] = true;
}
document.ontouchstart = (e) =>{
    player.mouse.keys[1] = true;
}
document.onmouseup = (e)=>{
    player.mouse.keys[e.which] = false;
}
document.ontouchend = (e) =>{
    player.mouse.keys[1] = false;
}
start();
update();