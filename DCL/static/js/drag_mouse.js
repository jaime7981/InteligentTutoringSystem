var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//style
canvas.style.backgroundColor = 'white';
//canvas.style.width = '500px';
//canvas.style.height = '500px';

var startX = 0;
var startY = 0;
var dragging = false;

function drawDot(event) {
    if(dragging){
        context.clearRect(0,0,canvas.width, canvas.height)
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
        context.closePath();
    }
}

function engage(event){
    dragging = true;
    startX = event.offsetX;
    startY = event.offsetY;
}

function disengage(){
    dragging = false;
}

canvas.addEventListener("mousedown",engage);
canvas.addEventListener("mouseup",disengage);
canvas.addEventListener("mousemove",drawDot,false);
