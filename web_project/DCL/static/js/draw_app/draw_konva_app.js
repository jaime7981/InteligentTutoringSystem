//#region INIT
var app_container = document.getElementById('konva-container');
var WIDTH = app_container.offsetWidth;
var HEIGHT = app_container.offsetHeight;
var STEP = 40;

var isNowDrawing = false;
var adding_component = false;
var current_component = "selector";
var mouse_hold_position = new Point(0,0);
var mouse_release_position = new Point(0,0);
var eq_reference_point = null;

var horizontal_points = [];
var vertical_points = [];
var bar_snap_nodes = [];
var all_konva_components = [];
var all_object_components = [];

var component_base_value = {
    "bar" : 2,
    "joint" : 5,
    "support" : 3,
    "horizontal" : 4,
    "vertical" : 4,
    "fixed" : 2,
    "force" : 3,
    "momentum" : 5,
};
//#endregion

//#region spatial
//Spacial Equations
function getBarSize(init_coordinates, end_coordinates){
    var x_init = init_coordinates.x;
    var y_init = init_coordinates.y;
    var x_end = end_coordinates.x;
    var y_end = end_coordinates.y;
    var size_x = Math.abs(x_init-x_end);
    var size_y = Math.abs(y_init-y_end);
    var pyth = (Math.sqrt(Math.pow(size_x,2)+Math.pow(size_y,2)));
    return (pyth).toFixed(2);
}

function getBarMiddle(init_coordinates, end_coordinates){
    var x_init = init_coordinates.x;
    var y_init = init_coordinates.y;
    var x_end = end_coordinates.x;
    var y_end = end_coordinates.y;
    
    var middle_x = (x_end+x_init)/2;
    var middle_y = (y_end+y_init)/2;
    return new Point(middle_x,middle_y);
};

function getBarSlope(init_coordinates, end_coordinates){
    var x_init = init_coordinates.x;
    var y_init = init_coordinates.y;
    var x_end = end_coordinates.x;
    var y_end = end_coordinates.y;
    if( x_init != x_end){
        var slope = (y_end-y_init)/(x_end-x_init);
        return slope;
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
    //console.log("elements: ",bar, point);
    var projected_slope = null;
    if(bar.line.slope == 'vertical'){
        projected_slope = 0;
    }
    else{
        projected_slope = -1/bar.line.slope;
    }
    //console.log("curr values:",projected_slope);
    var b_force = point.y - bar.line.slope*point.x;
    var b_bar = bar.line.b;

    var x_point = (b_force - b_bar/ bar.line.slope - projected_slope);
    var y_point = bar.line.slope*x_point + b_bar;
    return new Point(x_point,y_point);
    //TODO: CHECK
}
//#endregion

//#region grid and snap
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
                stroke: 'rgba(0, 0, 0, 0.4)',
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
                stroke: 'rgba(0, 0, 0, 0.4)',
                strokeWidth: 2,
            })
        );
        horizontal_points.push(Y);
    }
    gridLayer.batchDraw();
};
//#endregion

//#region Get Selected Drawing
function getDrawing(init_point, end_point, component){
    let id  = -1;
    if(component == "bar"){
        return drawBar(init_point,end_point, id);
    }
    else if(component == 'circle'){
        return drawCircle(init_point.x,init_point.y, id);
    }
    else if(component == 'support'){
        return drawSupport(init_point.x,init_point.y, id);
    }
    else if(component == 'sliding_horizontal'){
        return drawSlidingHorizontal(init_point.x,init_point.y, id);
    }
    else if(component == 'sliding_vertical'){
        return drawSlidingVertical(init_point.x,init_point.y, id);
    }
    else if(component == 'fixed'){
        //TODO
        return(null);
    }
    else if(component == 'force'){
        return drawForce(init_point.x,init_point.y, getForceAngleValues()[0], id);
    }
    else if(component == 'momentum'){
        return drawMomentum(init_point.x,init_point.y, getForceAngleValues()[2], id)
    }
};

function createElementDrawing(init_point, end_point, component){
    let new_id = all_object_components.length;
    if(component == "bar"){
        all_object_components.push(new Bar(init_point, end_point, new_id));
    }
    else if(component == 'force'){
        let force_value = getForceAngleValues()[0];
        let angle_value = getForceAngleValues()[1];
        all_object_components.push(new Force(init_point, force_value, angle_value, new_id));
    }
    else if(component == 'momentum'){
        let momentum_value = getForceAngleValues()[2];
        all_object_components.push(new Momentum(init_point, momentum_value, new_id));
    }
    else if(component == 'support'){
        all_object_components.push(new Support(init_point, "support", new_id));
    }
    else if(component == 'sliding_horizontal'){
        all_object_components.push(new Support(init_point, "horizontal", new_id));
    }
    else if(component == 'sliding_vertical'){
        all_object_components.push(new Support(init_point, "vertical", new_id));
    }
    else if(component == 'fixed'){
        all_object_components.push(new Support(init_point, "fixed", new_id));
    }
    else if(component == 'circle'){
        
    }
    return all_object_components[new_id];
};

function getDrawingFromObjectClass(component){
    let init_point = new Point(component.init_x, component.init_y);
    let id = component.id;
    if(component.component_type == "bar"){
        let end_point = new Point(component.end_x, component.end_y);
        return drawBar(init_point,end_point, id);
    }
    else if(component.component_type == 'circle'){
        return drawCircle(init_point.x,init_point.y, id);
    }
    else if(component.component_type == 'support'){
        return drawSupport(init_point.x,init_point.y, id);
    }
    else if(component.component_type == 'sliding_horizontal'){
        return drawSlidingHorizontal(init_point.x,init_point.y, id);
    }
    else if(component.component_type == 'sliding_vertical'){
        return drawSlidingVertical(init_point.x,init_point.y, id);
    }
    else if(component.component_type == 'fixed'){
        //TODO
        return(null);
    }
    else if(component.component_type == 'force'){
        return drawForce(init_point.x,init_point.y, component.magnitud, id);
    }
    else if(component.component_type == 'momentum'){
        return drawMomentum(init_point.x,init_point.y, component.magnitud, id)
    }
};
//#endregion

//#region Generate Components
function drawCircle(pos_x,pos_y, id){
    var circle = new Konva.Circle({
        x: pos_x,
        y: pos_y,
        radius: 10,
        stroke: 'black',
        strokeWidth: 8,
        draggable: true,
    });
    var group = new Konva.Group();
    group.add(circle);
    group.id = id;
    return group;
};

function drawBar(init_point, end_point, id){
    var line =  new Konva.Line({
        points: [init_point.x, init_point.y, end_point.x, end_point.y],
        stroke: 'black',
        strokeWidth: 15,
        opacity: 1,
    });
    var group = new Konva.Group();
    group.add(line);
    var measurment = drawMeasurement(init_point, end_point);
    group.add(measurment);
    group.id = id;
    group.draggable(true);
    return group;
};

function drawSupport(pos_x,pos_y, id){
    var triangle = new Konva.RegularPolygon({
        x: pos_x,
        y: pos_y+20,
        sides: 3,
        radius: 20,
        fill: 'Orange',
        stroke: 'black',
        strokeWidth: 2,
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.id = id;
    group.draggable(true);
    return group;
};

function drawSlidingHorizontal(pos_x,pos_y, id){
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
    });

    var line = new Konva.Line({
        points: [pos_x-20, pos_y, pos_x+20, pos_y],
        stroke: 'black',
        strokeWidth: 3,
        offsetX: 0,
        offsetY: -35,
        fill: 'black',
        
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.add(line);
    group.id = id;
    group.draggable(true);
    return group;

};

function drawSlidingVertical(pos_x,pos_y, id){
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
    });

    var line = new Konva.Line({
        points: [pos_x, pos_y-20, pos_x, pos_y+20],
        stroke: 'black',
        rotation: 0, 
        strokeWidth: 3,
        offsetX: 35,
        offsetY: 0, 
        
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.add(line);
    group.id = id;
    group.draggable(true);
    return group;
};

function drawForce(pos_x,pos_y, force, id){
    var line =  new Konva.Line({
        points: [pos_x, pos_y, pos_x, pos_y-80],
        stroke: 'purple',
        strokeWidth: 10,
        opacity: 1,
    });
    var arrow = new Konva.Line({
        points: [pos_x-20,pos_y-20,pos_x, pos_y, pos_x+20, pos_y-20],
        stroke: 'purple',
        strokeWidth: 10,
        opacity: 1,
    });

    var label = new Konva.Text({
        text: (force + " N"),
        fontSize: 20,
        x: pos_x,
        y: pos_y,
        offsetX: -20,
        offsetY: 40,
    });

    var group = new Konva.Group();
    group.add(line);
    group.add(arrow);
    group.add(label);
    group.id = id;
    group.draggable(true);
    return group;
};

function drawMomentum(pos_x,pos_y, force, id){
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
    });

    var circle = new Konva.Circle({
        x: pos_x,
        y: pos_y,
        radius: 5,
        fill: 'blue',
        stroke: 'blue',
        strokeWidth: 1,
    });

    var label = new Konva.Text({
        text: (force + " Nm"),
        fontSize: 20,
        x: pos_x,
        y: pos_y,
        offsetX: -20,
        offsetY: 40,
    });

    var group = new Konva.Group();
    group.add(arc);
    group.add(arrow);
    group.add(circle);
    group.add(label);
    group.id = id;
    group.draggable(true);
    return group;
};

function drawMeasurement(init_point, end_point, id){
    var barSlope = getBarSlope(init_point, end_point);
    var barSize = getBarSize(init_point, end_point)/STEP;
    var barMiddle = getBarMiddle(init_point, end_point);

    var group = new Konva.Group();

    if (barSlope != "vertical"){
        if (barSlope == 0){
            var line =  new Konva.Line({
                points: [init_point.x, init_point.y, end_point.x, end_point.y],
                stroke: 'black',
                strokeWidth: 2,
                offsetY: -20,
                opacity: 1,
            });
        
            var start = new Konva.Line({
                points: [init_point.x, init_point.y+10, init_point.x, end_point.y-10],
                stroke: 'black',
                strokeWidth: 2,
                offsetY: -20,
                opacity: 1,
            });
    
            var end = new Konva.Line({
                points: [end_point.x, init_point.y+10, end_point.x, end_point.y-10],
                stroke: 'black',
                strokeWidth: 2,
                offsetY: -20,
                opacity: 1,
            });
    
            var label = new Konva.Text({
                text: (barSize + " mts"),
                fontSize: 20,
                x: barMiddle.x,
                y: barMiddle.y,
                offsetY: -20,
            });
            group.add(line);
            group.add(start);
            group.add(end);
            group.add(label);
        }
        else{
            var line =  new Konva.Line({
                points: [init_point.x, init_point.y, end_point.x, end_point.y],
                stroke: 'black',
                strokeWidth: 2,
                offsetX: -10,
                offsetY: -10,
                opacity: 1,
            });
            
            var label = new Konva.Text({
                text: (barSize + " mts"),
                fontSize: 20,
                x: barMiddle.x,
                y: barMiddle.y,
                offsetY: -20,
            });
        
            group.add(line);
            group.add(label);
        }
    }
    else{
        var line =  new Konva.Line({
            points: [init_point.x, init_point.y, end_point.x, end_point.y],
            stroke: 'black',
            strokeWidth: 2,
            offsetX: -20,
            opacity: 1,
        });
    
        var start = new Konva.Line({
            points: [init_point.x+10, init_point.y, init_point.x-10, init_point.y],
            stroke: 'black',
            strokeWidth: 2,
            offsetX: -20,
            opacity: 1,
            
        });

        var end = new Konva.Line({
            points: [init_point.x+10, end_point.y, init_point.x-10, end_point.y],
            stroke: 'black',
            strokeWidth: 2,
            offsetX: -20,
            opacity: 1,
        });

        var label = new Konva.Text({
            text: (barSize + " mts"),
            fontSize: 20,
            x: barMiddle.x,
            y: barMiddle.y,
            offsetX: -20,
        });
        group.add(line);
        group.add(start);
        group.add(end);
        group.add(label);
    }
    group.id = id;
    return group;
};

function drawNode(pos_x,pos_y, id){
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
    group.id = id;
    return group;
};
//#endregion

//#region load and draw data
var loadAssigmentData = function() {
    if (assignment_js != ''){ 
        assignment_js = assignment_js.replace(new RegExp("&"+"#"+"x27;", "g"), '"');
        assignment_js = assignment_js.replace(new RegExp("&"+"quot;", "g"), '"');
        assignment_js = assignment_js.replace(new RegExp("None", "g"), 'null');
        var parsedJson = JSON.parse(assignment_js);
        for (object in parsedJson['assignment_data']){
            if (parsedJson['assignment_data'][object]['object_data'] != null){
                var object_data = parsedJson['assignment_data'][object]['object_data'];
                all_object_components.push(object_data);
            }
            else {
                var reference_point = parsedJson['assignment_data'][object]['reference_point'];
                eq_reference_point = new Point(reference_point.x, reference_point.y);
            }
        }
    }
}

var drawLoadedData = function() {
    for (object_element in all_object_components) {
        let component = getDrawingFromObjectClass(all_object_components[object_element]);
        all_konva_components.push(component);
        drawn_layer.add(component);
    }
}
//#endregion

//#region Run App
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
drawGrid(stage);
loadAssigmentData();
drawLoadedData();

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
});

stage.on('mouseup', function(){
    isNowDrawing = false;
    mouse_release_position = snapToNode(stage.getRelativePointerPosition().x,
                                        stage.getRelativePointerPosition().y);
    if(adding_component){
        //Check Bar Length > 0
        if(mouse_hold_position != mouse_release_position){
            let created_object = createElementDrawing(mouse_hold_position,mouse_release_position,current_component);
            let component = getDrawingFromObjectClass(created_object);
            all_konva_components.push(component);
            drawn_layer.add(component);
        }
    }
});
//#endregion

//#region Debug
var debugButton = document.getElementById('load-debug');
var debugContainer = document.getElementById('debug-container');

var functionMesasge = function(message) {
    if (message != null) {
        console.log(message);
        let div = document.createElement("div");
        div.innerHTML = "<p>" + message +"</p><br>";
        debugContainer.appendChild(div);
    }
};

debugButton.addEventListener('click', function() {
    debugContainer.innerHTML = "";
    functionMesasge('debug button presed');
    functionMesasge('debug button presed');
}, false);
//#endregion
