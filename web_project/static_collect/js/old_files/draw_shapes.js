// Init
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
context.canvas.width  = WIDTH;
context.canvas.height = HEIGHT;
canvas.style.backgroundColor = 'aquamarine';

const LINE_WIDTH = 20;
var bar_list = [];
var circle_list = [new Circle([100,600])];

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
        console.log('Drawing Bar');
        context.beginPath();
        context.moveTo(this.init_x, this.init_y);
        context.lineTo(this.end_x, this.end_y);
        context.closePath();
        context.strokeStyle = 'blue';
        context.lineWidth = LINE_WIDTH;
        context.stroke();
    }

    this.check_area = function(mouse_coordinates) {
        var mouse_x = mouse_coordinates[0];
        var mouse_y = mouse_coordinates[1];
        var check_x = mouse_x <= this.init_x && mouse_x >= this.end_x + LINE_WIDTH;
        var check_y = mouse_y >= this.init_y && mouse_y >= this.end_y + LINE_WIDTH;
        //console.log(check_x, check_y);

        var polygon = [new Point(this.init_x, this.init_y),
                    new Point(this.end_x, this.end_y),
                    new Point(this.init_y, this.end_y),
                    new Point(this.init_x, this.end_x)];

        for (list_element in polygon) {
            createAndDrawCircles(polygon[list_element].x, polygon[list_element].y);
        }

        if (check_x && check_y){
            console.log('object selected');
        }
    }
}

function Circle(init_coordinates) {
    this.init_x = init_coordinates[0];
    this.init_y = init_coordinates[1];

    this.draw = function() {
        console.log('Drawing Circle');
        context.beginPath();
        context.arc(this.init_x, this.init_y, 1, 0, 2 * Math.PI); //(center_x, center_y, start_angle, end_angle)
        context.closePath();
        context.strokeStyle = 'red';
        context.stroke();
    }
}

// Code Functions
var drawAllObjects = function(objects_list) {
    for (object_item in objects_list) {
        objects_list[object_item].draw();
    }
}

var createAndDrawCircles = function(x, y) {
    var new_circle = new Circle([x, y])
    new_circle.draw();
}

canvas.addEventListener('click', function(event) {
    var x = event.pageX, y = event.pageY;

    for (object_item in bar_list) {
        bar_list[object_item].check_area([x, y]);
    }

}, false);

// Code
bar_list = [new Bar([100,50], [500,50]), new Bar([100,900], [900,100])]
bar_list.push(new Bar([400,100], [400,400]));

//console.log(circle_list);

drawAllObjects(bar_list);
//drawAllObjects(circle_list);


