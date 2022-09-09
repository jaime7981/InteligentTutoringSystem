// Code Functions
var drawLine = function(canvas, context) {
    var startX = 0;
    var startY = 0;
    var dragging = false;

    function drawDot(event) {
        if(dragging){
            context.clearRect(0,0,canvas.width, canvas.height)
            drawGrid(context);
            drawAllObjects();

            if (selected_shape == 'bar'){
                drawed_bar = new Bar(getPoint(startX, startY), snapMouseToNode(event.offsetX, event.offsetY));
                drawed_bar.draw();
            }
            else if (selected_shape == 'circle'){
                drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
                drawed_circle.draw();
            }
        }
        else {
            context.clearRect(0,0,canvas.width, canvas.height)
            drawGrid(context);
            drawAllObjects();
            drawed_circle = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
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
            drawed_bar.draw();
        }
    }

    function disengage(event){
        dragging = false;
        if (selected_shape == "bar"){
            new_item = new Bar(getPoint(startX, startY), snapMouseToNode(event.offsetX, event.offsetY));
            bar_list.push(new_item);
        }
        else if (selected_shape == "circle"){
            new_item = new Circle(snapMouseToNode(event.offsetX, event.offsetY));
            circle_list.push(new_item);
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

var drawAllObjects = function() {
    for (object_item in bar_list) {
        bar_list[object_item].draw();
    }
    for (object_item in circle_list) {
        circle_list[object_item].draw();
    }
}

// Event Listeners
barButton.addEventListener('click', function() {
    selected_shape = 'bar';
    selected_color = COLOR_BAR;
    selected_object = 'bar';
}, false);
circleButton.addEventListener('click', function() {
    selected_shape = 'circle';
    selected_color = COLOR_CIRCLE;
    selected_object = 'circle';
}, false);
supportButton.addEventListener('click', function() {
    selected_shape = 'circle';
    selected_color = COLOR_SUPPORT;
    selected_object = 'support';
}, false);
slidingSupportButton.addEventListener('click', function() {
    selected_shape = 'circle';
    selected_color = COLOR_SLIDING;
    selected_object = 'sliding';
}, false);
forceButton.addEventListener('click', function() {
    selected_shape = 'bar';
    selected_color = COLOR_FORCE;
    selected_object = 'force';
}, false);
