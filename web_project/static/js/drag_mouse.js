var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const WIDTH = 1900;
const HEIGHT = 800;
const STEP = 50;

context.canvas.width  = WIDTH;
context.canvas.height = HEIGHT;

//style
canvas.style.backgroundColor = 'white';
//canvas.style.width = '500px';
//canvas.style.height = '500px';

var drawLine = function(canvas, context) {
    var startX = 0;
    var startY = 0;
    var dragging = false;

    function drawDot(event) {
        if(dragging){
            context.clearRect(0,0,canvas.width, canvas.height)
            drawGrid(context, STEP)
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
    console.log('DrawLine');
}

// the render logic should be focusing on the rendering 
var drawGrid = function(ctx, step) {
    w = ctx.canvas.width
    h = ctx.canvas.height

    console.log('DrawGrid');
    ctx.beginPath(); 
    for (var x=0;x<=w;x+=step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
    }
    // set the color of the line
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    // the stroke will actually paint the current path 
    ctx.stroke(); 
    // for the sake of the example 2nd path
    ctx.beginPath(); 
    for (var y=0;y<=h;y+=step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
    }
    // set the color of the line
    ctx.strokeStyle = 'black';
    // just for fun
    ctx.lineWidth = 1;
    // for your original question - you need to stroke only once
    ctx.stroke();
};

drawGrid(context, STEP);
drawLine(canvas, context);