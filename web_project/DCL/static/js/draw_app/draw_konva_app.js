//#region INIT
var app_container = document.getElementById('konva-container');
var WIDTH = app_container.offsetWidth;
var HEIGHT = app_container.offsetHeight;
var STEP = 40;
var SNAP_WEIGHT = 80;
var ID = 0;

var isNowDrawing = false;
var adding_component = false;
var current_component = "selector";
var mouse_hold_position = new Point(0,0);
var mouse_release_position = new Point(0,0);
var eq_reference_point = null;

var horizontal_points = [];
var vertical_points = [];
var bar_snap_nodes = [];
var all_object_components = [];
var assignment_steps = [];

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
    var projected_slope = null;
    if(bar.line.slope == 'vertical'){
        projected_slope = 0;
    }
    else{
        projected_slope = -1/bar.line.slope;
    }
    var b_force = point.y - projected_slope*point.x;
    var b_bar = bar.line.b;
    var x_point = (b_force - b_bar)/(bar.line.slope - projected_slope);
    var y_point = bar.line.slope*x_point + bar.line.b;
    return new Point(x_point,y_point);
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

function snapToBar(curr_point){
    var min_distance = SNAP_WEIGHT;
    var return_point = snapToNode(curr_point);
    for(var bar in all_object_components){
        if(all_object_components[bar].component_type == 'bar'){
            var snap_point = getProjectedIntersection(all_object_components[bar],curr_point);
            var snap_point = getProjectedIntersection(all_object_components[bar],curr_point);
                console.log('Values',[bar],curr_point,snap_point);
            var distance = getBarSize(snap_point,curr_point);
            if (distance < min_distance && distance < SNAP_WEIGHT){
                min_distance = distance;
                return_point = snap_point;
            }
        }
    }
    return return_point
};

function stagePositionToPoint(){
    var x = stage.getRelativePointerPosition().x;
    var y = stage.getRelativePointerPosition().y;
    return new Point(x,y);
}

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
function drawingFactory(object){
    var drawing = null
    if(object.component_type=='bar'){
        drawing = drawBar(object);
    }
    else if(object.component_type=='support'){
        drawing = drawSupport(object);
    }
    else if(object.component_type=='sliding_horizontal'){
        drawing = drawSlidingHorizontal(object);
    }
    else if(object.component_type=='sliding_vertical'){
        drawing = drawSlidingVertical(object);
    }
    else if(object.component_type=='fixed'){
        drawing = drawFixed(object);
    }
    else if(object.component_type=='force'){
        drawing = drawForce(object);
    }
    else if(object.component_type=='momentum'){
        drawing = drawMomentum(object);
    }
    else if(object.component_type=='node'){
        drawing = drawNode(object);
    }
    else if(object.component_type=='circle'){
        drawing = drawCircle(object);
    }
    return drawing;
}

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
function drawCircle(point){
    var circle = new Konva.Circle({
        x: point.x,
        y: point.y,
        radius: 10,
        stroke: 'black',
        strokeWidth: 8,
    });
    
    var group = new Konva.Group();
    group.add(circle);
    group.id(point.id);
    return group;
};

function drawBar(bar){
    var line =  new Konva.Line({
        points: [bar.init_x, bar.init_y, bar.end_x, bar.end_y],
        stroke: 'black',
        strokeWidth: 15,
        opacity: 1,
    });
    var group = new Konva.Group();
    group.add(line);
    var measurement = drawMeasurement(bar);
    group.add(measurement);
    group.id = bar.id;
    group.draggable(true);
    return group;
};

function drawSupport(support){
    var triangle = new Konva.RegularPolygon({
        x: support.x,
        y: support.y,
        sides: 3,
        radius: 20,
        fill: 'Orange',
        stroke: 'black',
        strokeWidth: 2,
        offsetX: 0,
        offsetY: -20,
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.id = support.id;
    group.draggable(true);
    return group;
};

function drawSlidingHorizontal(support){
    var X = support.x;
    var Y = support.y;
    var triangle = new Konva.RegularPolygon({
        x: X,
        y: Y,
        sides: 3,
        radius: 20,
        fill: 'Purple',
        stroke: 'black',
        strokeWidth: 2,
        offsetX: 0,
        offsetY: -20,
    });

    var line = new Konva.Line({
        points: [X-20, Y, X+20, Y],
        stroke: 'black',
        strokeWidth: 3,
        offsetX: 0,
        offsetY: -35,
        fill: 'black',
        
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.add(line);
    group.id = support.id;
    group.draggable(true);
    return group;

};

function drawSlidingVertical(support){
    var X = support.x;
    var Y = support.y;
    var triangle = new Konva.RegularPolygon({
        x: X,
        y: Y,
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
        points: [X, Y-20, X, Y+20],
        stroke: 'black',
        rotation: 0, 
        strokeWidth: 3,
        offsetX: 35,
        offsetY: 0, 
        
    });
    var group = new Konva.Group();
    group.add(triangle);
    group.add(line);
    group.id = support.id;
    group.draggable(true);
    return group;
};

function drawFixed(support){
    //TODO
};

function drawForce(force){
    var color = 'purple'
    var X = force.x;
    var Y = force.y;
    var line =  new Konva.Line({
        points: [X, Y, X, Y-80],
        stroke: color,
        strokeWidth: 10,
        opacity: 1,
    });
    var arrow = new Konva.Line({
        points: [X-20,Y-20,X, Y, X+20, Y-20],
        stroke: color,
        strokeWidth: 10,
        opacity: 1,
    });

    var label = new Konva.Text({
        text: (force.magnitud + " N"),
        fontSize: 20,
        x: X,
        y: Y,
        offsetX: -20,
        offsetY: 40,
    });

    var group = new Konva.Group();
    group.add(line);
    group.add(arrow);
    group.add(label);
    group.id = force.id;
    group.draggable(true);
    return group;
};

function drawMomentum(momentum){
    var X = momentum.x;
    var Y = momentum.y;
    var arc = new Konva.Arc({
        x: X,
        y: Y,
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
        x: X-15,
        y: Y+20,
        sides: 3,
        radius: 15,
        rotation: 20,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 2,
    });

    var circle = new Konva.Circle({
        x: X,
        y: Y,
        radius: 5,
        fill: 'blue',
        stroke: 'blue',
        strokeWidth: 1,
    });

    var label = new Konva.Text({
        text: (momentum.magnitud + " Nm"),
        fontSize: 20,
        x: X,
        y: Y,
        offsetX: -20,
        offsetY: 40,
    });

    var group = new Konva.Group();
    group.add(arc);
    group.add(arrow);
    group.add(circle);
    group.add(label);
    group.id = momentum.id;
    group.draggable(true);
    return group;
};

function drawMeasurement(bar){
    var barSlope = bar.line.slope;
    var barSize = bar.scaled_size;
    var barMiddle =bar.middle;

    var group = new Konva.Group();

    if (barSlope != "vertical"){
        if (barSlope == 0){
            var line =  new Konva.Line({
                points: [bar.init_x, bar.init_y, bar.end_x, bar.end_y],
                stroke: 'black',
                strokeWidth: 2,
                offsetY: -20,
                opacity: 1,
            });
        
            var start = new Konva.Line({
                points: [bar.init_x, bar.init_y+10, bar.init_x.x, bar.init_y-10],
                stroke: 'black',
                strokeWidth: 2,
                offsetY: -20,
                opacity: 1,
            });
    
            var end = new Konva.Line({
                points: [bar.end_x, bar.end_y+10, bar.end_x, bar.end_y-10],
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
                points: [bar.init_x, bar.init_y, bar.end_x, bar.end_y],
                stroke: 'black',
                strokeWidth: 2,
                offsetX: -10,
                offsetY: -10,
                opacity: 1,
            });
            
            var label = new Konva.Text({
                text: (barSize.toFixed(2) + " mts"),
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
            points: [bar.init_x, bar.init_y, bar.end_x, bar.end_y],
            stroke: 'black',
            strokeWidth: 2,
            offsetX: -20,
            opacity: 1,
        });
    
        var start = new Konva.Line({
            points: [bar.init_x+10, bar.init_y, bar.init_x-10, bar.init_y],
            stroke: 'black',
            strokeWidth: 2,
            offsetX: -20,
            opacity: 1,
            
        });

        var end = new Konva.Line({
            points: [bar.end_x+10, bar.end_y, bar.end_x-10, bar.end_y],
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
    group.id = 'measurement';
    return group;
};
function drawNode(node){
    var circle = new Konva.Circle({
        x: node.x,
        y: node.y,
        radius: 10,
        fill: 'white',
        stroke: 'red',
        strokeWidth: 2,
        draggable: true,
    });
    var label = new Konva.Text({
        text: (node.label),
        fontSize: 20,
        fill: 'red',
        fonrStyle: 'bold',
        x: node.x,
        y: node.y,
        //align: 'center',
        offsetX: 20,
        offsetY: -10,
    });
    var group = new Konva.Group();
    group.add(circle);
    group.add(label);
    group.id = node.id;
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
        console.log(parsedJson);
        for (object in parsedJson['assignment_data']){
            if (parsedJson['assignment_data'][object]['object_data'] != null){
                var object_data = parsedJson['assignment_data'][object]['object_data'];
                all_object_components.push(object_data);
            }
            else if (parsedJson['assignment_data'][object]['reference_point'] != null) {
                reference_point = parsedJson['assignment_data'][object]['reference_point'];
                eq_reference_point = new Point(reference_point.x, reference_point.y);
                console.log(eq_reference_point);
            }
            else if (parsedJson['assignment_data'][object]['assignment_steps'] != null) {
                assignment_steps = parsedJson['assignment_data'][object]['assignment_steps'];
                checkStepCheckboxes();
                console.log(assignment_steps);
            }
        }
    }
}

var drawLoadedData = function() {
    for (object_element in all_object_components) {
        let component = drawingFactory(all_object_components[object_element]);
        drawn_layer.add(component);
    }
}

var checkStepCheckboxes = function() {
    if (assignment_steps.length > 0) {
        stepOneCheckbox.checked = assignment_steps[0];
        stepTwoCheckbox.checked = assignment_steps[1];
        stepThreeCheckbox.checked = assignment_steps[2];
        stepFourCheckbox.checked = assignment_steps[3];
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
            var component = componentFactory(mouse_hold_position,snapped_position,ID,current_component);
            var drawing_now = drawingFactory(component);
            drawing_layer.add(drawing_now);
        }
        else{
            if (current_component == 'bar'){
                var component = new Circle(snapped_position)
                var drawing_now = drawingFactory(component);
                drawing_layer.add(drawing_now);
            }
            else{
                var component = new componentFactory(snapped_position,snapped_position,ID,current_component)
                var drawing_now = drawingFactory(component);
                drawing_layer.add(drawing_now);
            }
        }
    }
});

stage.on('mouseup', function(){
    isNowDrawing = false;
    mouse_release_position = snapToNode(stage.getRelativePointerPosition().x,
                                        stage.getRelativePointerPosition().y);
    if(adding_component){
        var component = new componentFactory(mouse_hold_position,mouse_release_position,ID,current_component)
        var drawing_now = drawingFactory(component);
        all_object_components.push(component);
        drawn_layer.add(drawing_now);
        if(current_component == 'bar'){
            var start_node = componentFactory(mouse_hold_position,mouse_release_position,ID+1,'node');
            var konva_node_start = drawingFactory(start_node)
            var end_node = componentFactory(mouse_release_position,mouse_release_position,ID+2,'node');
            var konva_node_end = drawingFactory(end_node)
            drawn_layer.add(konva_node_start);
            drawn_layer.add(konva_node_end);
            ID = ID +2;
        };
        ID ++;
        loadXeq();
        console.log(all_object_components);
    }
});
//#endregion

//#region eq X,Y and M
var loadXeq = function(data) {
    eq_x.innerHTML = 'No data for loading eq X'

    // Fuerzas
    let force_sum_x = 0;
    let force_sum_y = 0;
    // Reacciones
    let reaction_x = [];
    let reaction_y = [];
    for (component in all_object_components) {
        let object = all_object_components[component];
        if (object.component_type == 'force') {
            // Fuerza hacia abajo
            if (object.angle == '90') {
                force_sum_y = force_sum_y - parseInt(object.magnitud);
            }
            // Fuerza hacia arriba
            else if (object.angle == '270') {
                force_sum_y = force_sum_y + parseInt(object.magnitud);
            }
            // Fuerza hacia la derecha
            else if (object.angle == '0') {
                force_sum_x = force_sum_x + parseInt(object.magnitud);
            }
            // Fuerza hacia la izquierda
            else if (object.angle == '180') {
                force_sum_x = force_sum_x - parseInt(object.magnitud);
            }
            else {
                // TODO: Descomponer fuerza
            }
        }
        else if (object.component_type == 'support') {
            reaction_x.push("Rx" + reaction_x.length);
            reaction_y.push("Ry" + reaction_y.length);
        }
        else if (object.component_type == 'sliding_horizontal') {
            reaction_x.push("Rx" + reaction_x.length);
        }
        else if (object.component_type == 'sliding_vertical') {
            reaction_y.push("Ry" + reaction_y.length);
        }
    }

    // Show x
    eq_x.innerHTML = '';
    for (x_elem in reaction_x) {
        eq_x.innerHTML += reaction_x[x_elem] + ' + ';
    }
    eq_x.innerHTML += force_sum_x + 'N';
    eq_x.innerHTML += ' = 0';

    // Show y
    eq_y.innerHTML = '';
    for (y_elem in reaction_y) {
        eq_y.innerHTML += reaction_y[y_elem] + ' + ';
    }
    eq_y.innerHTML += force_sum_y + 'N';
    eq_y.innerHTML += ' = 0';


    console.log('fuerza x: ' + force_sum_x + 'N, fuerza y: ' + force_sum_y + 'N');
}

var getDificultad = function() {

}

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
    //functionMesasge('debug button presed');
    loadXeq(null);

}, false);
//#endregion
