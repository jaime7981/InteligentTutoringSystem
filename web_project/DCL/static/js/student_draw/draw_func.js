function componentFactory(init_coordinates, end_coordinates, id, component){
    if(component == "bar"){
        var object = new Bar(init_coordinates, end_coordinates, id)
    }
    else if(component == 'support' ||
            component == 'sliding_horizontal' || 
            component == 'sliding_vertical' ||
            component == 'fixed'){
        var object = new Support(init_coordinates,component,id);
    }
    else if(component == 'force'){
        var object = new Force(init_coordinates, parseInt(getForceAngleValues()[0]),parseInt(getForceAngleValues()[1]), id);
    }
    else if(component == 'dist_force'){
        var object = new DistForce(init_coordinates, parseInt(getForceAngleValues()[0]),parseInt(getForceAngleValues()[3]), id);
    }
    else if(component == 'momentum'){
        var object = new Momentum(init_coordinates, parseInt(getForceAngleValues()[2]),id);
    }
    else if(component == 'circle'){
        var object = new Circle(init_coordinates)
    }
    else if(component == 'node'){
        var object = new Node(init_coordinates,id)
    }
    else if (component == 'reference_point'){
        var object = new ReferencePoint(init_coordinates,id)
    }
    return object;
};

var getForceAngleValues = function() {
    var forceValue = document.getElementById("force-value");
    var angleValue = document.getElementById("angle-value");
    var torqueValue = document.getElementById("torque-value");
    var lengthValue = document.getElementById("length-value");
    var force_value = null;
    var angle_value = null;
    var torque_value = null;
    var length_value = null;

    if (forceValue != null) {
        force_value = forceValue.value;
    }
    if (angleValue != null) {
        angle_value = angleValue.value;
    }
    if (torqueValue != null) {
        torque_value = torqueValue.value;
    }
    if (lengthValue != null) {
        length_value = lengthValue.value;
    }
    return([force_value, angle_value, torque_value, length_value]);
}

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



var loadDrawApp = function(container_id, konva_id) {
    // BUTTONS AND EVENTS
    //#region Buttons
    var barButton = document.getElementById(container_id + "select-bar-button");
    var supportButton = document.getElementById(container_id + "select-support-button");
    var slidingHorizontalButton = document.getElementById(container_id + "select-sliding-horizontal-button");
    var slidingVerticalButton = document.getElementById(container_id + "select-sliding-vertical-button");
    var fixedButton = document.getElementById(container_id + "select-fixed-button");
    var forceButton = document.getElementById(container_id + "select-force-button");
    var distForceButton = document.getElementById(container_id + "select-dist-force-button");
    var momentumButton = document.getElementById(container_id + "select-momentum-button");
    var referencePointButton = document.getElementById(container_id + "select-reference-button");
    var clearButton = document.getElementById(container_id + "select-clear-button");
    var sideBar = document.getElementById(container_id + "dcl-app-side-bar-canvas");
    //#endregion

    //#region Side Bar
    var appendForceField = function() {
        let div = document.createElement("div");
        div.setAttribute("id", id="force-container");
        div.innerHTML = "<label id='force-label'>Force (N)</label><input type='text' id='force-value'  value='1' style='width: 100%;'>";
        sideBar.appendChild(div);
    };

    var appendLengthField = function() {
        let div = document.createElement("div");
        div.setAttribute("id", id="force-container");
        div.innerHTML = "<label id='length-label'>Length (m)</label><input type='text' id='length-value'  value='1' style='width: 100%;'>";
        sideBar.appendChild(div);
    };

    var appendAngleField = function() {
        let div = document.createElement("div");
        div.setAttribute("id", id="angle-container");
        div.innerHTML = "<label id='angle-label'>Angle (degree)</label><input type='text' id='angle-value' value='90' style='width: 100%;'>";
        sideBar.appendChild(div);
    };

    var appendTorqueField = function() {
        let div = document.createElement("div");
        div.setAttribute("id", id="torque-container");
        div.innerHTML = "<label id='torque-label'>Torque (Nm)</label><input type='text' id='torque-value' value='1' style='width: 100%;'>";
        sideBar.appendChild(div);
    };

    var appendFlipButton = function() {
        let div = document.createElement("div");
        div.setAttribute("id", id="flip-container");
        div.innerHTML = "<button id='flip-button' style='width: 100%;'>Flip (Not Implemented)</button>";
        sideBar.appendChild(div);
    };

    var deleteAllContent = function() {
        sideBar.innerHTML = "<h3 id='info-label'>Data</h3>";
    };

    // First element is force, second is angle, third is torque
    var getForceAngleValues = function() {
        var forceValue = document.getElementById("force-value");
        var angleValue = document.getElementById("angle-value");
        var torqueValue = document.getElementById("torque-value");
        var lengthValue = document.getElementById("length-value");
        var force_value = null;
        var angle_value = null;
        var torque_value = null;
        var length_value = null;

        if (forceValue != null) {
            force_value = forceValue.value;
        }
        if (angleValue != null) {
            angle_value = angleValue.value;
        }
        if (torqueValue != null) {
            torque_value = torqueValue.value;
        }
        if (lengthValue != null) {
            length_value = lengthValue.value;
        }
        return([force_value, angle_value, torque_value, length_value]);
    }
    //#endregion

    //#region Buttons Event Handlers
    clearButton.addEventListener('click', function(){
        drawn_layer.destroyChildren();
        all_object_components = [];
    }, false);

    if (barButton != null){
        barButton.addEventListener('click', function() {
            current_component = 'bar';
            adding_component = true;
            deleteAllContent();
        }, false);
    }
    if (supportButton != null){
        supportButton.addEventListener('click', function() {
            current_component = 'support';
            adding_component = true;
            deleteAllContent();
            appendFlipButton();
        }, false);
    }
    if (slidingHorizontalButton != null){
        slidingHorizontalButton.addEventListener('click', function() {
            current_component = 'sliding_horizontal';
            adding_component = true;
            deleteAllContent();
            appendFlipButton();
        }, false);
    }
    if (slidingVerticalButton != null){
        slidingVerticalButton.addEventListener('click', function() {
            current_component = 'sliding_vertical';
            adding_component = true;
            deleteAllContent();
            appendFlipButton();
        }, false);
    }
    forceButton.addEventListener('click', function() {
        current_component = 'force';
        adding_component = true;
        deleteAllContent();
        appendForceField();
        appendAngleField();
    }, false);
    distForceButton.addEventListener('click', function() {
        current_component = 'dist_force';
        adding_component = true;
        deleteAllContent();
        appendForceField();
        appendLengthField();
    }, false);
    momentumButton.addEventListener('click', function() {
        current_component = 'momentum';
        adding_component = true;
        deleteAllContent();
        appendTorqueField();
    }, false)
    referencePointButton.addEventListener('click', function() {
        current_component = 'reference_point';
        adding_component = true;
        deleteAllContent();
    }, false);
    if (fixedButton != null){
        fixedButton.addEventListener('click', function() {
            current_component = 'fixed';
            adding_component = true;
            deleteAllContent();
            appendFlipButton();
        }, false)
    }
    //#endregion

    //Save Data
    var prepareJsonData = function() {
        var json_output_list = ['{"assignment_data" : ['];
        var json_parsed_object = '';
        for (list_element in  all_object_components) {
            json_parsed_object = ['{ "object_data" : ', 
                                        JSON.stringify(all_object_components[list_element]),
                                        '},'].join('');
            json_output_list.push(json_parsed_object);
        }
        if (all_object_components.length > 0) {
            if (all_object_components[0].component_type == 'bar') {
                var reference_x = all_object_components[0].init_x;
                var reference_y = all_object_components[0].init_y;
            }
        }
        else {
            var reference_x = null;
            var reference_y = null;
        }
        
        json_output_list.push('{"reference_point" : {"x":' + reference_x + ',"y":' + reference_y + '}},{"assignment_steps" : ' + JSON.stringify(getAssignmentSteps()) + '}]}')
        json_parsed_object = json_output_list.join('');
        return json_parsed_object;
    }

    var ajaxSaveAssignment = function(json_data) {
        var fd = new FormData();
        fd.append("assignment_data" , json_data);
        fd.append("assignment_id" , assignment_id);
        $.ajaxSetup({
            headers: {
                "X-CSRFToken" : getCookie('csrftoken')
            }
        });
        $.ajax({
            type: 'POST',
            url: "/dcl/save_sol",
            data: fd,
            processData: false,
            contentType: false,
            cache:false,
            success: function (response) {
                console.log('saved solution');
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

    // Event Listeners
    saveAssignmentButton.addEventListener('click', function() {
        ajaxSaveAssignment(prepareJsonData());
    }, false);

    //#region INIT
    var dif_level = document.getElementById("input-text-selected-assignment-level");

    var app_container = document.getElementById(container_id);
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

    var horizontal_points = [];
    var vertical_points = [];
    var all_object_components = [];

    var component_base_value = {
        "bar" : 2,
        "joint" : 5,
        "support" : 3,
        "sliding_horizontal" : 4,
        "sliding_vertical" : 4,
        "fixed" : 2,
        "force" : 3,
        "momentum" : 5,
    };
    //#endregion

    //#region spatial
    //Spacial Equations
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
        var return_point = curr_point;
        for(var bar in all_object_components){
            if(all_object_components[bar].component_type == 'bar'){
                var snap_point = getProjectedIntersection(all_object_components[bar],curr_point);
                var distance = getBarSize(snap_point,curr_point);
                if (distance <= min_distance && distance <= SNAP_WEIGHT){
                    min_distance = distance;
                    return_point = snap_point;
                }
            }
        }
        return return_point
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
        else if(object.component_type=='dist_force'){
            drawing = drawDistForce(object);
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
        else if(object.component_type=='reference_point'){
            drawing = drawReferencePoint(object);
        }
        return drawing;
    }
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
        //group.listening(true);
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
        return group;
    };

    function drawFixed(support){
        var X = support.x;
        var Y = support.y;
        var triangle = new Konva.RegularPolygon({
            x: X,
            y: Y,
            sides: 3,
            radius: 20,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            offsetX: 0,
            offsetY: -20,
        });

        var line_1 = new Konva.Line({
            points: [X-20, Y-5, X, Y+5],
            stroke: 'black',
            strokeWidth: 3,
            offsetX: 0,
            offsetY: -35,
            fill: 'black',
        });

        var line_2 = new Konva.Line({
            points: [X, Y-5, X+20, Y+5],
            stroke: 'black',
            strokeWidth: 3,
            offsetX: 0,
            offsetY: -35,
            fill: 'black',
        });

        var group = new Konva.Group();
        group.add(triangle);
        group.add(line_1);
        group.add(line_2);
        group.id = support.id;
        return group;
    };

    function drawForce(force){
        var color = 'purple'
        var X = force.x;
        var Y = force.y;
        var tailX = 2*STEP*Math.cos(force.angle*Math.PI/180);
        var tailY = 2*STEP*Math.sin(force.angle*Math.PI/180);
        var head = new Point(X,Y);
        var tail = new Point(X+tailX, Y-tailY);
        var label_middle = getBarMiddle(head, tail);

        var line =  new Konva.Line({
            points: [X, Y, X+tailX, Y-tailY],
            stroke: color,
            strokeWidth: 10,
            opacity: 1,
        });
        var arrow = new Konva.Line({
            points:    [X+20*Math.cos((force.angle+45)*Math.PI/180),Y-20*Math.sin((force.angle+45)*Math.PI/180),
                        X, Y,
                        X+20*Math.cos((force.angle-45)*Math.PI/180),Y-20*Math.sin((force.angle-45)*Math.PI/180)],
            stroke: color,
            strokeWidth: 10,
            opacity: 1,
        });

        var label = new Konva.Text({
            text: (force.magnitud + " N"),
            fontSize: 20,
            fontStyle: 'Bold',
            x: label_middle.x+20,
            y: label_middle.y,
        });

        var angle = drawAngle(force);
        var group = new Konva.Group();
        group.add(line);
        group.add(arrow);
        group.add(label);
        group.add(angle);
        group.id = force.id;
        return group;
    };

    function drawAngle(force){
        var group = new Konva.Group();
        var arc = new Konva.Arc({
            x: force.x,
            y: force.y,
            innerRadius: 30,
            outerRadius: 33,
            angle: force.angle,
            rotation: 360-force.angle,
            //fill: 'blue',
            stroke: 'black',
            opacity: 1,
            strokeWidth: 2,
        });
    
        var line = new Konva.Line({
            points: [force.x, force.y, force.x-30, force.y],
            strokeWidth: 5,
            opacity: 1,
        });
    
        var label = new Konva.Text({
            text: (force.angle + "º"),
            fontSize: 20,
            fontStyle: 'Bold',
            x: force.x,
            y: force.y,
            offsetX: -30,
        });
    
        group.add(arc);
        group.add(line);
        group.add(label);
        group.id('angle');
        return group;
    }

    function drawDistForce(dist_force){
        var color = 'blue'
        var X = dist_force.x;
        var Y = dist_force.y;
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

        var seccond_line = new Konva.Line({
            points: [X + STEP*dist_force.length, Y, X + STEP*dist_force.length, Y-80],
            stroke: color,
            strokeWidth: 10,
            opacity: 1,
        });

        var seccond_arrow = new Konva.Line({
            points: [X-20 + STEP*dist_force.length,Y-20,X + STEP*dist_force.length, Y, X+20 + STEP*dist_force.length, Y-20],
            stroke: color,
            strokeWidth: 10,
            opacity: 1,
        });

        var top_line = new Konva.Line({
            points: [X, Y-80, X + STEP*dist_force.length, Y-80],
            stroke: color,
            strokeWidth: 10,
            opacity: 1,
        });

        var label = new Konva.Text({
            text: (dist_force.magnitud + " N"),
            fontSize: 20,
            x: X,
            y: Y,
            offsetX: -20,
            offsetY: 40,
        });

        var label_two = new Konva.Text({
            text: (dist_force.length + " m"),
            fontSize: 20,
            x: X,
            y: Y,
            offsetX: -20,
            offsetY: 20,
        });

        var group = new Konva.Group();
        group.add(line);
        group.add(arrow);
        group.add(seccond_line);
        group.add(seccond_arrow);
        group.add(top_line);
        group.add(label);
        group.add(label_two);
        group.id = dist_force.id;
        return group;
    }

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
        });
        var label = new Konva.Text({
            text: (node.label),
            fontSize: 20,
            fill: 'red',
            fontStyle: 'bold',
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

    function drawReferencePoint(reference_point){
        var circle = new Konva.Circle({
            x: reference_point.x,
            y: reference_point.y,
            radius: 10,
            fill: 'red',
            stroke: 'blue',
            strokeWidth: 2,
        });
        var label = new Konva.Text({
            text: ("RP"),
            fontSize: 20,
            fill: 'red',
            fontStyle: 'bold',
            x: reference_point.x,
            y: reference_point.y,
            offsetX: 14,
            offsetY: 30,
        });
        var group = new Konva.Group();
        group.add(circle);
        group.add(label);
        group.id = reference_point.id;
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
                else if (parsedJson['assignment_data'][object]['reference_point'] != null) {
                    reference_point = parsedJson['assignment_data'][object]['reference_point'];
                    eq_reference_point = new Point(reference_point.x, reference_point.y);
                }
                else if (parsedJson['assignment_data'][object]['assignment_steps'] != null) {
                    assignment_steps = parsedJson['assignment_data'][object]['assignment_steps'];
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

    //#endregion

    //#region eq X,Y and M
    // Retorna [fuerza_x, fuerza_y]
    var decomposeForce = function(angle, magnitude) {
        let desc_x = Math.cos(parseInt(angle));
        let desc_y = Math.sin(parseInt(angle));
        return [magnitude*desc_x, magnitude*desc_y];
    }

    var selectReferencePoint = function() {
        let reference_exist = false;
        let reference_points_found = [];
        let alt_ref_point = null;
        if (all_object_components.length > 0) {
            for (component in all_object_components) {
                let object = all_object_components[component];
                if (object.component_type == 'reference_point') {
                    reference_exist = true;
                    reference_points_found.push(object);
                }
                else if (object.component_type == 'bar') {
                    if (alt_ref_point == null) {
                        alt_ref_point = new Point(object.init_x, object.init_y);
                    }
                }
            }

            //select last reference point
            if (reference_exist == true){
                if (reference_points_found.length > 0){
                    return reference_points_found[reference_points_found.length - 1];
                }
            }
            // Set alt ref point (first bar node)
            if (alt_ref_point != null) {
                return alt_ref_point;
            }
            return new Point(0,0);
        }
        else {
            return new Point(0,0);
        }
    }

    var calculateTorqueFromReference = function(ref_point, force_object, magnitude) {
        let length = getBarSize(ref_point, force_object)/STEP;
        if (magnitude != null) {
            let force = length * magnitude;
            return [length, force];
        }
        else {
            return [length, null];
        }
    }

    var loadXeq = function() {
        let RP = selectReferencePoint();
        // Fuerzas
        let force_sum_x = 0;
        let force_sum_y = 0;
        // Momentum
        let momentum_sum = 0;
        let momentum_list = [];
        // Reacciones
        let reaction_x = [];
        let reaction_y = [];
        for (component in all_object_components) {
            let object = all_object_components[component];
            var torque = [null, null];
            if (object.x != null) {
                // Falta descomponer torque, falla en sliding vertical
                // Falla direccion de torque
                torque = calculateTorqueFromReference(RP, object, null);
            }
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
                    let des_forces = decomposeForce(object.angle, object.magnitud);
                    force_sum_x = force_sum_x + des_forces[0];
                    force_sum_y = force_sum_y + des_forces[1];
                }
                torque = calculateTorqueFromReference(RP, object, object.magnitud);
                momentum_sum += torque[1];
            }
            else if (object.component_type == 'support') {
                reaction_x.push("Rx" + reaction_x.length);
                reaction_y.push("Ry" + reaction_y.length);
                momentum_list.push(momentum_list.length + "RSup*" + torque[0] + 'm');
            }
            else if (object.component_type == 'sliding_horizontal') {
                reaction_y.push("Rx" + reaction_y.length);
                momentum_list.push(momentum_list.length + "RHor*" + torque[0] + 'm');
            }
            else if (object.component_type == 'sliding_vertical') {
                reaction_x.push("Ry" + reaction_x.length);
                momentum_list.push(momentum_list.length + "RHVer*" + torque[0] + 'm');
            }
            else if (object.component_type == 'fixed') {
                reaction_x.push("Rx" + reaction_x.length);
                reaction_y.push("Ry" + reaction_y.length);
                momentum_list.push(momentum_list.length + "RFix*" + torque[0] + 'm');
                // Agregar momento de fixed
                momentum_list.push(momentum_list.length + "RFixM Nm");
            }
            else if (object.component_type == 'momentum') {
                momentum_sum += object.magnitud;
            }
        }

        // Show x
        eq_x = '';
        for (x_elem in reaction_x) {
            eq_x += reaction_x[x_elem] + ' + ';
        }
        eq_x += force_sum_x + 'N';
        eq_x += ' = 0';

        // Show y
        eq_y = '';
        for (y_elem in reaction_y) {
            eq_y += reaction_y[y_elem] + ' + ';
        }
        eq_y += force_sum_y + 'N';
        eq_y += ' = 0';

        // Show m
        eq_m = '';
        for (m_elem in momentum_list) {
            eq_m += momentum_list[m_elem] + ' + ';
        }
        eq_m += "M" + momentum_sum + 'Nm';
        eq_m += ' = 0';

        return [eq_y, eq_y, eq_m];
    }

    var getDificultad = function() {
        dificulty_level = 0;
        for (component in all_object_components) {
            let object = all_object_components[component];
            dificulty_level += component_base_value[object.component_type];
        }
        dif_level.innerHTML = 'Assignment Dificulty: ' + dificulty_level;
    }
    //#endregion

    //#region Run App
    var stage = new Konva.Stage({
        container: konva_id,
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
    loadXeq();
    getDificultad();

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
                    var component = new Circle(snapped_position);
                    var drawing_now = drawingFactory(component);
                    drawing_layer.add(drawing_now);
                }
                else{
                    let snap_bar = snapToBar(snapped_position);
                    //console.log(snap_bar);
                    var component = new componentFactory(snap_bar,snap_bar,ID,current_component)
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
            if(current_component == 'bar'){
                var component = new componentFactory(mouse_hold_position,mouse_release_position,ID,current_component)
                var drawing_now = drawingFactory(component);
                all_object_components.push(component);
                drawn_layer.add(drawing_now);

                var start_node = componentFactory(mouse_hold_position,mouse_release_position,ID+1,'node');
                var konva_node_start = drawingFactory(start_node)
                var end_node = componentFactory(mouse_release_position,mouse_release_position,ID+2,'node');
                var konva_node_end = drawingFactory(end_node)
                drawn_layer.add(konva_node_start);
                drawn_layer.add(konva_node_end);
                ID = ID +2;
            }
            else if (current_component == 'force'){
                let snap_bar = snapToBar(mouse_release_position);
                var component = new componentFactory(snap_bar,snap_bar,ID,current_component)
                var drawing_now = drawingFactory(component);
                var start_node = componentFactory(mouse_hold_position,mouse_release_position,ID+1,'node');
                var konva_node_start = drawingFactory(start_node)
                
                
                all_object_components.push(component);
                drawn_layer.add(drawing_now);
                all_object_components.push(start_node);
                drawn_layer.add(konva_node_start);
                ID += 1;
            }
            else {
                let snap_bar = snapToBar(mouse_release_position);
                var component = new componentFactory(snap_bar,snap_bar,ID,current_component)
                var drawing_now = drawingFactory(component);
                all_object_components.push(component);
                drawn_layer.add(drawing_now);
            }
            ID ++;
            loadXeq();
        }
    });
    //#endregion
}

loadDrawApp('dcl-app-one-content', 'part-one-konva-container');
loadDrawApp('dcl-app-three-content', 'part-three-konva-container');
loadAssignmentSteps(assignment_steps);
loadNextStep(assignment_steps);
var nextStepButton = document.getElementById("show-next-step-button");
nextStepButton.addEventListener('click', function() {
    loadNextStep(assignment_steps);
}, false);