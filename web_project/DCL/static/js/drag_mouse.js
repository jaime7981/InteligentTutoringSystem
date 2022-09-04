// Init
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
//Buttons
var barButton = document.getElementById("select-bar-button");
var circleButton = document.getElementById("select-circle-button");
var supportButton = document.getElementById("select-support-button");
var slidingSupportButton = document.getElementById("select-sliding-support-button");
var forceButton = document.getElementById("select-force-button")
var saveAssignmentButton = document.getElementById("save-assignment-button");


const WIDTH = 1900;
const HEIGHT = 800;
const STEP = 50;
const LINE_WIDTH = 10;
context.canvas.width  = WIDTH;
context.canvas.height = HEIGHT;
canvas.style.backgroundColor = 'white';

const COLOR_BAR = 'blue';
const COLOR_CIRCLE = 'red';
const COLOR_SUPPORT = 'lime';
const COLOR_SLIDING = 'purple';
const COLOR_FORCE = 'cyan';


var bar_list = [];
var circle_list = [];
var support_list = [];
var sliding_support_list = [];
var force_list = [];

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
        context.strokeStyle = COLOR_BAR;
        context.lineWidth = LINE_WIDTH;
        context.stroke();
    }
}

function Circle(init_coordinates) {
    this.init_x = init_coordinates.x;
    this.init_y = init_coordinates.y;
    this.object_type = selected_shape;
    this.name = 'circle_' + (circle_list.length + 1);
    this.color = COLOR_CIRCLE;
    this.rad = 5;

    this.draw = function() {
        context.beginPath();
        context.arc(this.init_x, this.init_y, this.rad, 0, 2 * Math.PI); //(center_x, center_y, start_angle, end_angle)
        context.closePath();
        context.strokeStyle = this.color;
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
            drawAllObjects(support_list);
            drawAllObjects(sliding_support_list);
            drawAllObjects(force_list);

            if (selected_shape == 'bar'){
                drawed_bar = new Bar(getPoint(startX, startY), snapMouseToNode(event.offsetX, event.offsetY));
                drawed_bar.draw();
            }
            else if (selected_shape == 'circle'){
                drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
                drawed_circle.color = COLOR_CIRCLE;
                drawed_circle.draw();
            }
            else if (selected_shape == 'support'){
                drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
                drawed_circle.color = COLOR_SUPPORT;
                drawed_circle.draw();
            }
            else if (selected_shape == 'sliding'){
                drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
                drawed_circle.color = COLOR_SLIDING;
                drawed_circle.draw();
            }
            else if (selected_shape == 'force'){
                drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
                drawed_circle.color = COLOR_FORCE;
                drawed_circle.draw();
            }

        }
        else {
            context.clearRect(0,0,canvas.width, canvas.height)
            drawGrid(context);
            drawAllObjects(bar_list);
            drawAllObjects(circle_list);
            drawAllObjects(support_list);
            drawAllObjects(sliding_support_list);
            drawAllObjects(force_list);
            drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
            if (selected_shape == 'bar'){
                drawed_circle.color = COLOR_BAR;
            }
            else if (selected_shape == 'circle'){
                drawed_circle.color = COLOR_CIRCLE;
            }
            else if (selected_shape == 'support'){
                drawed_circle.color = COLOR_SUPPORT;
            }
            else if (selected_shape == 'sliding'){
                drawed_circle.color = COLOR_SLIDING;
            }
            else if (selected_shape == 'force'){
                drawed_circle.color = COLOR_FORCE;
            }

            drawed_circle.rad = 4;
            drawed_circle.draw();
        }
    }

    function engage(event){
        dragging = true;
        var snap_mouse = snapMouseToNode(event.offsetX, event.offsetY);
        startX = snap_mouse.x;
        startY = snap_mouse.y;
        if (selected_shape == "circle"){
            drawed_bar = new Circle(snapMouseToNode(startX, startY));
            drawed_bar.color = COLOR_CIRCLE;
            drawed_bar.draw();
        }
        else if(selected_shape == "support"){
            drawed_bar = new Circle(snapMouseToNode(startX, startY));
            drawed_bar.color = COLOR_SUPPORT;
            drawed_bar.draw();
        }
        else if(selected_shape == "sliding"){
            drawed_bar = new Circle(snapMouseToNode(startX, startY));
            drawed_bar.color = COLOR_SLIDING;
            drawed_bar.draw();
        }
        else if(selected_shape == "force"){
            drawed_bar = new Circle(snapMouseToNode(startX, startY));
            drawed_bar.color = COLOR_FORCE;
            drawed_bar.draw();
        }
    }

    function disengage(event){
        dragging = false;
        if (selected_shape == "bar"){
            new_item = new Bar(getPoint(startX, startY), snapMouseToNode(event.offsetX, event.offsetY));
            new_item.color = COLOR_BAR;
            bar_list.push(new_item);
        }
        else if (selected_shape == "circle"){
            new_item = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
            new_item.color = COLOR_CIRCLE;
            circle_list.push(new_item);
        }
        else if (selected_shape == 'support'){
            new_item = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
            new_item.color = COLOR_SUPPORT;
            support_list.push(new_item);
        }
        else if (selected_shape == 'sliding'){
            new_item = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
            new_item.color = COLOR_SLIDING;
            sliding_support_list.push(new_item);
        }
        else if (selected_shape == 'force'){
            new_item = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
            new_item.color = COLOR_FORCE;
            force_list.push(new_item);
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
    context.strokeStyle = COLOR_BAR;
    context.lineWidth = LINE_WIDTH;
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
        if (vertical_points[x_line] > mouse_x - STEP/2) {
            set_x = vertical_points[x_line];
            break;
        }
    }
    for (y_line in horizontal_points) {
        if (horizontal_points[y_line] > mouse_y - STEP/2) {
            set_y = horizontal_points[y_line];
            break;
        }
    }
    return (new Point(set_x, set_y));
}

function getPoint(x, y){
    return (new Point(x, y));
}

var drawAllObjects = function(objects_list) {
    for (object_item in objects_list) {
        objects_list[object_item].draw();
    }
}

// Event Listeners
barButton.addEventListener('click', function() {selected_shape = 'bar';}, false);
circleButton.addEventListener('click', function() {selected_shape = 'circle';}, false);
supportButton.addEventListener('click', function() {selected_shape = 'support';}, false);
slidingSupportButton.addEventListener('click', function() {selected_shape = 'sliding';}, false);
forceButton.addEventListener('click', function() {selected_shape = 'force';}, false);

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
    for (list_element in  support_list) {
        json_parsed_object = ['{ "object" : "support", "data" : ',
                                    JSON.stringify(support_list[list_element]),
                                    '},'].join('');
        json_output_list.push(json_parsed_object);
    }
    for (list_element in  sliding_support_list) {
        json_parsed_object = ['{ "object" : "sliding", "data" : ',
                                    JSON.stringify(sliding_support_list[list_element]),
                                    '},'].join('');
        json_output_list.push(json_parsed_object);
    }
    for (list_element in  force_list) {
        json_parsed_object = ['{ "object" : "force", "data" : ',
                                    JSON.stringify(force_list[list_element]),
                                    '},'].join('');
        json_output_list.push(json_parsed_object);
    }

    json_output_list.push('{"object" : null, "data" : null}]}')
    json_parsed_object = json_output_list.join('');
    console.log(json_parsed_object);
    ajaxSaveAssignment(json_parsed_object);
}, false);

// Ajax response
var ajaxSaveAssignment = function(parsed_json) {
    $.ajaxSetup({
        headers: {
            "X-CSRFToken" : getCookie('csrftoken')
        }
    });
    $.ajax({
        type: 'POST',
        url: "/dcl/app",
        data: {
            "assignment_data" : parsed_json
        },
        success: function (response) {
            console.log('ajax success');
        },
        error: function (response) {
            console.log(response["responseJSON"]["error"]);
        }
    })
}

var getCookie = function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

lineListInit();
drawGrid(context);
drawLine(canvas, context);