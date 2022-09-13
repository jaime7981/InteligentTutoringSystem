console.log("New Script Test");

//Buttons

var app_container = document.getElementById('konva-container');
var WIDTH = app_container.offsetWidth;
var HEIGHT = app_container.offsetHeight;

var STEP = 40;

var horizontal_points = [];
var vertical_points = [];

var isNowDrawing = false;

var mouse_hold_position = new Point(0,0);
var mouse_release_position = new Point(0,0);

var current_component = "selector";
var adding_component = true;

var stage = new Konva.Stage({
    container: 'konva-container',
    width: WIDTH,
    height: HEIGHT,
    border: '1px solid black',
    draggable: false,
  });

var drawn_layer = new Konva.Layer();
var drawing_layer = new Konva.Layer();


stage.add(drawn_layer);
stage.add(drawing_layer);

function Point(x,y) {
    this.x = x;
    this.y = y;
}

function Bar(init_coordinates, end_coordinates){
    this.init_x = init_coordinates.x;
    this.init_y = init_coordinates.y;
    this.end_x = end_coordinates.x;
    this.end_y = end_coordinates.y;
    this.size = getBarSize(init_coordinates, end_coordinates);
    this.slope = getBarSlope(init_coordinates,end_coordinates);
    this.b = getBarYCut(init_coordinates, this.slope)
}


//Spacial Equations
function getBarSize(init_coordinates, end_coordinates){
    var x_init = init_coordinates.x;
    var y_init = init_coordinates.y;
    var x_end = end_coordinates.x;
    var y_end = end_coordinates.y;
    return Math.sqrt(Math.pow(Math.abs(x_init-x_end),2)+Math.pow(Math.abs(y_init-y_end),2));
}

function getBarSlope(init_coordinates, end_coordinates){
    var x_init = init_coordinates.x;
    var y_init = init_coordinates.y;
    var x_end = end_coordinates.x;
    var y_end = end_coordinates.y;
    if( x_init != x_end){
        console.log('Slope: ', y_end, y_init, x_end, x_init)
        return (y_end-y_init/x_end-x_init);
    }
    else{
        return 'vertical';
    }
}

function getBarYCut(init_coordinates, slope){
    var x_init = init_coordinates.x;
    var y_init = init_coordinates.y;
    return y_init - slope*x_init;
};


function getProjectedIntersection(bar,point){
    var projected_slope = null;
    if(bar.slope == 'vertical'){
        projected_slope = 0;
    }
    else{
        projected_slope = -1/bar.slope;
    }
    var b_force = point.y - slope*point.x;
    var b_bar = bar.b;

    var x_point = (b_force - b_bar/ slope - projected_slope);
    var y_point = slope*x_point + b_bar;
    return new Point(x_point,y_point);
    //TODO: CHECK
}

function snapToNode(mouse_x, mouse_y) {
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

function snapToBar(bar, curr_point){
//TODO    
};

function drawGrid(Stage){
    var gridLayer = new Konva.Layer({
        draggable: false,
        x: 0, 
        y: 0,
      });

    Stage.add(gridLayer);  
    const stepSize = STEP; // set a value for the grid step gap.

    gridLayer.clear();
    gridLayer.destroyChildren();
    gridLayer.clipWidth(null); // clear any clipping

    const xSize= Stage.width(), 
    ySize= Stage.height(),
    xSteps = Math.round(xSize/ stepSize), 
    ySteps = Math.round(ySize / stepSize);

    // draw vertical lines
    for (let i = 0; i <= xSteps; i++) {
        X = i * stepSize;
        gridLayer.add(
            new Konva.Line({
                x: X,
                points: [0, 0, 0, ySize],
                stroke: 'rgba(0, 0, 0, 1)',
                strokeWidth: 2,
            })
        );
        vertical_points.push(X);

    }
    //draw Horizontal lines
    for (let i = 0; i <= ySteps; i++) {
        Y = i*stepSize;
        gridLayer.add(
            new Konva.Line({
                y: Y,
                points: [0, 0, xSize, 0],
                stroke: 'rgba(0, 0, 0, 1)',
                strokeWidth: 2,
            })
        );
        horizontal_points.push(Y);
    }
    gridLayer.batchDraw();
};

drawGrid(stage);


//Get Selected Drawing
function getDrawing(init_point, end_point, component){
    if(component == "bar"){
        return drawBar(init_point,end_point);
    }
    else if(component == 'circle'){
        return drawCircle(init_point.x,init_point.y);
    }
    else if(component == 'support'){
        return drawSupport(init_point.x,init_point.y);
    }
    else if(component == 'sliding_horizontal'){
        return drawSlidingHorizontal(init_point.x,init_point.y);
    }
    else if(component == 'sliding_vertical'){
        return drawSlidingVertical(init_point.x,init_point.y);
    }
    else if(component == 'force'){
        return drawForce()
    }
    else if(component == 'momentum'){
        return drawMomentum(init_point.x,init_point.y)
    }
};

//Generate Components
function drawCircle(pos_x,pos_y){
    var circle = new Konva.Circle({
        x: pos_x,
        y: pos_y,
        radius: 10,
        //fill: 'black',
        stroke: 'black',
        strokeWidth: 8,
        draggable: true,
    });
    var group = new Konva.Group();
    group.add(circle);
    return group;
};

function drawBar(init_point, end_point){
    var line =  new Konva.Line({
        points: [init_point.x, init_point.y, end_point.x, end_point.y],
        stroke: 'black',
        strokeWidth: 15,
        opacity: 1,
        draggable: true,
    });
    var group = new Konva.Group();
    group.add(line);
    group.id = 'bar';
    return group;
};

function drawSupport(pos_x,pos_y){
    var triangle = new Konva.RegularPolygon({
        x: pos_x,
        y: pos_y+20,
        sides: 3,
        radius: 20,
        fill: 'Orange',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.id = 'support';
    return group;
};

function drawSlidingHorizontal(pos_x,pos_y){
    var triangle = new Konva.RegularPolygon({
        x: pos_x,
        y: pos_y,
        sides: 3,
        radius: 20,
        fill: 'Purple',
        stroke: 'black',
        strokeWidth: 2,
        offsetX: 0,
        offsetY: -20,
        draggable: true,
    });

    var line = new Konva.Line({
        points: [pos_x-20, pos_y, pos_x+20, pos_y],
        stroke: 'black',
        strokeWidth: 3,
        offsetX: 0,
        offsetY: -35,
        fill: 'black',
        draggable: true,
        
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.add(line);
    group.id = 'horizontal';
    return group;

};

function drawSlidingVertical(pos_x,pos_y){
    var triangle = new Konva.RegularPolygon({
        x: pos_x,
        y: pos_y,
        sides: 3,
        radius: 20,
        fill: 'purple',
        stroke: 'black',
        rotation: 90,
        strokeWidth: 2,
        offsetX: 0,
        offsetY: -20,
        opacity: 1,
        draggable: true,
    });

    var line = new Konva.Line({
        points: [pos_x, pos_y-20, pos_x, pos_y+20],
        stroke: 'black',
        rotation: 0, 
        strokeWidth: 3,
        offsetX: 35,
        offsetY: 0, 
        draggable: true,
        
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.add(line);
    group.id = 'vertical';
    return group;
};

function drawForce(){
//TODO
};

function drawMomentum(pos_x,pos_y){
    var arc = new Konva.Arc({
        x: pos_x,
        y: pos_y,
        innerRadius: 20,
        outerRadius: 30,
        angle: 260,
        rotation: 140,
        fill: 'blue',
        stroke: 'black',
        opacity: 1,
        strokeWidth: 2,
    })

    var arrow = new Konva.RegularPolygon({
        x: pos_x-15,
        y: pos_y+20,
        sides: 3,
        radius: 15,
        rotation: 20,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
    });

    var circle = new Konva.Circle({
        x: pos_x,
        y: pos_y,
        radius: 5,
        fill: 'blue',
        stroke: 'blue',
        strokeWidth: 1,
        draggable: true,
    });

    var group = new Konva.Group();
    group.add(arc);
    group.add(arrow);
    group.add(circle);
    group.id = 'momentum';

    return group;

};




//Mouse Event Handlers

stage.on('mousedown', function(){
    console.log(current_component);
    isNowDrawing = true;
    mouse_hold_position = snapToNode(stage.getRelativePointerPosition().x,
                                    stage.getRelativePointerPosition().y);
    });


stage.on('mousemove', function(){
    snapped_position = snapToNode(stage.getRelativePointerPosition().x,
                                stage.getRelativePointerPosition().y);
    drawing_layer.destroyChildren();
    if(adding_component){
        if(isNowDrawing){
            if (current_component=='bar'){
                var bar = getDrawing(mouse_hold_position, snapped_position, current_component);
                drawing_layer.add(bar);
            }
        }
        else{
            if(current_component=='bar'){
                var circle = getDrawing(snapped_position,snapped_position,'circle');
                drawing_layer.add(circle);
            }
            else{
                var component = getDrawing(snapped_position,snapped_position,current_component);
                drawing_layer.add(component);
            }
            
        }
    }
    else{
        var nodes = drawn_layer.find('Group');
        console.log(nodes);     
    }

});

stage.on('mouseup', function(){
    isNowDrawing = false;
    mouse_release_position = snapToNode(stage.getRelativePointerPosition().x,
                                    stage.getRelativePointerPosition().y);
    if(adding_component){
        //Check Bar Length > 0
        if(mouse_hold_position != mouse_release_position){
           var component = getDrawing(mouse_hold_position,mouse_release_position,current_component);
            drawn_layer.add(component); 
        }
        
    }
});



//Buttons Event Handlers
selectorButton.addEventListener('click',function(){
   current_component = 'selector'; 
   adding_component = false;
},false);

eraserButton.addEventListener('click',function(){
    current_component = 'eraser'; 
    adding_component = false;
 },false)

barButton.addEventListener('click', function() {
    current_component = 'bar';
    adding_component = true;
}, false);
//circleButton.addEventListener('click', function() {
//    current_component = 'circle';
//    adding_component = true;
//}, false);

supportButton.addEventListener('click', function() {
    current_component = 'support';
    adding_component = true;
}, false);
slidingHorizontalButton.addEventListener('click', function() {
    current_component = 'sliding_horizontal';
    adding_component = true;
}, false);
slidingVerticalButton.addEventListener('click', function() {
    current_component = 'sliding_vertical';
    adding_component = true;
}, false);
forceButton.addEventListener('click', function() {
    current_component = 'force';
    adding_component = true;
}, false);
momentumButton.addEventListener('click', function() {
    current_component = 'momentum';
    adding_component = true;
}, false)
clearButton.addEventListener('click', function(){
    drawn_layer.destroyChildren();
}, false)