// Classes
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
        context.lineWidth = 4;
        context.stroke();
    }
}

function Circle(init_coordinates) {
    this.init_x = init_coordinates[0];
    this.init_y = init_coordinates[1];

    this.draw = function() {
        console.log('Drawing Circle');
        context.beginPath();
        context.arc(this.init_x, this.init_y, 50, 0, 2 * Math.PI); //(center_x, center_y, start_angle, end_angle)
        context.closePath();
        context.strokeStyle = 'red';
        context.stroke();
    }
}

var drawAllObjects = function(objects_list) {
    for (object_item in objects_list) {
        objects_list[object_item].draw();
    }
}

// Init
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
context.canvas.width  = WIDTH;
context.canvas.height = HEIGHT;
canvas.style.backgroundColor = 'aquamarine';

var bar_list = [];
var circle_list = [new Circle([100,600])];

// Code

var test_bar1 = new Bar([10,10], [50,50]);
var test_bar2 = new Bar([80,80], [130,130]);
var test_bar3 = new Bar([60,35], [10,90]);

bar_list = [test_bar1, test_bar2, test_bar3]
var test_bar4 = new Bar([400,100], [100,250]);
bar_list.push(test_bar4);

console.log(circle_list);

drawAllObjects(bar_list);
drawAllObjects(circle_list);


