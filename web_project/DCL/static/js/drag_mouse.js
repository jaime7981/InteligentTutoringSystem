// Init
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var barButton = document.getElementById("select-bar-button");
var circleButton = document.getElementById("select-circle-button");
var saveAssignmentButton = document.getElementById("save-assignment-button");
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

var horizontal_points = [];
var vertical_points = [];

// Classes 
function Point(x,y) {
    this.x = x;
    this.y = y;
}

function Bar(init_coordinates, end_coordinates) {
    this.init_x = init_coordinates.x;
    this.init_y = init_coordinates.y;
    this.end_x = end_coordinates.x;
    this.end_y = end_coordinates.y;
    this.object_type = selected_shape;
    this.name = 'bar_' + (bar_list.length + 1);

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
    this.init_x = init_coordinates.x;
    this.init_y = init_coordinates.y;
    this.object_type = selected_shape;
    this.name = 'circle_' + (circle_list.length + 1);

    this.draw = function() {
        context.beginPath();
        context.arc(this.init_x, this.init_y, 5, 0, 2 * Math.PI); //(center_x, center_y, start_angle, end_angle)
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
            drawGrid(context);
            drawAllObjects(bar_list);
            drawAllObjects(circle_list);
            if (selected_shape == 'bar'){
                drawed_bar = new Bar(new Point(startX, startY), snapMouseToNode(event.offsetX, event.offsetY));
                drawed_bar.draw();
            }
            else if (selected_shape == 'circle'){
                drawed_bar = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
                drawed_bar.draw();
            }
        }
    }

    function engage(event){
        dragging = true;
        var snap_mouse = snapMouseToNode(event.offsetX, event.offsetY);
        startX = snap_mouse.x;
        startY = snap_mouse.y;
        if (selected_shape == "circle"){
            drawed_bar = new Circle(snapMouseToNode(startX, startY));
            drawed_bar.draw();
        }
    }

    function disengage(event){
        dragging = false;
        if (selected_shape == "bar"){
            bar_list.push(new Bar(new Point(startX, startY), snapMouseToNode(event.offsetX, event.offsetY)));
        }
        else if (selected_shape == "circle"){
            circle_list.push(new Circle(snapMouseToNode(event.offsetX, event.offsetY)));
        }
    }

    canvas.addEventListener("mousedown",engage);
    canvas.addEventListener("mouseup",disengage);
    canvas.addEventListener("mousemove",drawDot,false);
}

var drawGrid = function(context) {
    context.beginPath(); 
    for (var x = 0; x <= WIDTH; x += STEP) {
        context.moveTo(x, 0);
        context.lineTo(x, HEIGHT);
    }
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
    context.beginPath(); 
    for (var y = 0; y <= HEIGHT; y += STEP) {
        context.moveTo(0, y);
        context.lineTo(WIDTH, y);
    }
    context.stroke();
}

var lineListInit = function() {
    for (var x = 0; x <= WIDTH; x += STEP) {
        vertical_points.push(x);
    }
    for (var y = 0; y <= HEIGHT; y += STEP) {
        horizontal_points.push(y);
    }
}

var snapMouseToNode = function(mouse_x, mouse_y) {
    var set_x = 0;
    var set_y = 0;

    for (x_line in vertical_points) {
        if (vertical_points[x_line] > mouse_x) {
            set_x = vertical_points[x_line];
            break;
        }
    }
    for (y_line in horizontal_points) {
        if (horizontal_points[y_line] > mouse_y) {
            set_y = horizontal_points[y_line];
            break;
        }
    }
    return (new Point(set_x, set_y));
}

var drawAllObjects = function(objects_list) {
    for (object_item in objects_list) {
        objects_list[object_item].draw();
    }
}

// Event Listeners
barButton.addEventListener('click', function() {selected_shape = 'bar';}, false);
circleButton.addEventListener('click', function() {selected_shape = 'circle';}, false);
saveAssignmentButton.addEventListener('click', function() {
    var json_output_list = ['{"assignment_data" : ['];
    var json_parsed_object = '';
    for (list_element in  bar_list) {
        json_parsed_object = '{ "object" : "bar", "data" : ' + JSON.stringify(bar_list[list_element]) + '},';
        json_output_list.push(json_parsed_object);
    }
    for (list_element in  circle_list) {
        json_parsed_object = ['{ "object" : "circle", "data" : ', 
                                    JSON.stringify(circle_list[list_element]),
                                    '},'].join('');
        json_output_list.push(json_parsed_object);
    }
    json_output_list.push('{"object" : null, "data" : null}]}')
    json_parsed_object = json_output_list.join('');
}, false);

lineListInit();
drawGrid(context);
drawLine(canvas, context);