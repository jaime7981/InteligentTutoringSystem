// Init
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var barButton = document.getElementById("select-bar-button");
var circleButton = document.getElementById("select-circle-button");
const WIDTH = 1900;
const HEIGHT = 800;
const STEP = 50;
const LINE_WIDTH = 10;
context.canvas.width  = WIDTH;
context.canvas.height = HEIGHT;
canvas.style.backgroundColor = 'white';

var bar_list = [];
var circle_list = [];
var selected_shape = 'bar';

// Classes 
function Point(x,y) {
    this.x = x;
    this.y = y;
}

function Bar(init_coordinates, end_coordinates) {
    this.init_x = init_coordinates[0];
    this.init_y = init_coordinates[1];
    this.end_x = end_coordinates[0];
    this.end_y = end_coordinates[1];

    this.draw = function() {
        context.beginPath();
        context.moveTo(this.init_x, this.init_y);
        context.lineTo(this.end_x, this.end_y);
        context.closePath();
        context.strokeStyle = 'blue';
        context.lineWidth = LINE_WIDTH;
        context.stroke();
    }
}

function Circle(init_coordinates) {
    this.init_x = init_coordinates[0];
    this.init_y = init_coordinates[1];

    this.draw = function() {
        context.beginPath();
        context.arc(this.init_x, this.init_y, 10, 0, 2 * Math.PI); //(center_x, center_y, start_angle, end_angle)
        context.closePath();
        context.strokeStyle = 'red';
        context.stroke();
    }
}

// Code Functions
var drawLine = function(canvas, context) {
    var startX = 0;
    var startY = 0;
    var dragging = false;

    function drawDot(event) {
        if(dragging){
            context.clearRect(0,0,canvas.width, canvas.height)
            drawGrid(context, STEP);
            drawAllObjects(bar_list);
            drawAllObjects(circle_list);
            if (selected_shape == 'bar'){
                drawed_bar = new Bar([startX, startY], [event.offsetX, event.offsetY]);
                drawed_bar.draw();
            }
            else if (selected_shape == 'circle'){
                drawed_bar = new Circle([event.offsetX, event.offsetY]);
                drawed_bar.draw();
            }
        }
    }

    function engage(event){
        dragging = true;
        startX = event.offsetX;
        startY = event.offsetY;
        if (selected_shape == "circle"){
            drawed_bar = new Circle([event.offsetX, event.offsetY]);
            drawed_bar.draw();
        }
    }

    function disengage(event){
        dragging = false;
        if (selected_shape == "bar"){
            bar_list.push(new Bar([startX, startY], [event.offsetX, event.offsetY]));
        }
        else if (selected_shape == "circle"){
            circle_list.push(new Circle([event.offsetX, event.offsetY]));
        }
    }

    canvas.addEventListener("mousedown",engage);
    canvas.addEventListener("mouseup",disengage);
    canvas.addEventListener("mousemove",drawDot,false);
}

var drawGrid = function(context, step) {
    context.beginPath(); 
    for (var x = 0; x <= WIDTH; x += step) {
        context.moveTo(x, 0);
        context.lineTo(x, HEIGHT);
    }
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
    context.beginPath(); 
    for (var y = 0; y <= HEIGHT; y += step) {
        context.moveTo(0, y);
        context.lineTo(WIDTH, y);
    }
    context.stroke();
}

var drawAllObjects = function(objects_list) {
    for (object_item in objects_list) {
        objects_list[object_item].draw();
    }
}

// Event Listeners
barButton.addEventListener('click', function() {selected_shape = 'bar';}, false);
circleButton.addEventListener('click', function() {selected_shape = 'circle';}, false);

drawGrid(context, STEP);
drawLine(canvas, context);