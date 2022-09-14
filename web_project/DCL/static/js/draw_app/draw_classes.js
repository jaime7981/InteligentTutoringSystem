//#region Math Components
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;  
    };
};

class Line{
    constructor(init_coordinates, end_coordinates){
        this.slope = getBarSlope(init_coordinates,end_coordinates);
        this.b = getBarYCut(init_coordinates, this.slope);
    };
};

//#endregion

//#region Draw Components
class Bar{
    constructor(init_coordinates, end_coordinates, id){
        this.id = id;
        this.component_type = 'bar';
        this.init_cord = init_coordinates;
        this.end_cord = end_coordinates;
        this.init_x = init_coordinates.x;
        this.init_y = init_coordinates.y;
        this.end_x = end_coordinates.x;
        this.end_y = end_coordinates.y;
        this.size = getBarSize(this.init_cord, this.end_cord);
        this.middle = getBarMiddle(this.init_cord, this.end_cord)
        this.scaled_size = this.size/STEP
        this.line = new Line(this.init_cord, this.end_cord);
    };
    getValues() {
        console.log("Init x: ",this.init_x);
        console.log("Init y: ",this.init_y);
        console.log("End x: ",this.end_x);
        console.log("End y: ",this.end_y);
        console.log("Size: ",this.size);
        console.log("Scaled Size: ",this.scaled_size);
        console.log("Middle: ",this.middle);
        console.log("Slope: ",this.line.slope);
        console.log("Y Cut: ",this.line.b);
    };
};

class Support{
    constructor(init_coordinates, type, id){
        this.id = id;
        //TODO: Implement node position in DCL
        //this.node = null
        this.component_type = type;
        this.x = init_coordinates.x;
        this.y = init_coordinates.y;

        if(this.component_type == 'support'){
            this.reaction_x = true;
            this.reaction_y = true;
            this.reaction_momentum = false;
        }
        else if(this.component_type == 'sliding_horizontal'){
            this.reaction_x = false;
            this.reaction_y = true;
            this.reaction_momentum = false;
        }
        else if(this.component_type == 'sliding_vertical'){
            this.reaction_x = true;
            this.reaction_y = false;
            this.reaction_momentum = false;
        }
        else if(this.component_type == 'fixed'){
            this.reaction_x = true;
            this.reaction_y = true;
            this.reaction_momentum = true;
        }
    }
}

class Force{
    constructor(init_coordinates, magnitud, angle, id){
        this.id = id;
        this.component_type = 'force';
        this.x = init_coordinates.x;
        this.y = init_coordinates.y;
        this.magnitud = magnitud;
        this.angle = angle;
    };
}

class Momentum{
    constructor(init_coordinates, magnitud, id){
        this.id = id;
        this.component_type = 'momentum';
        this.x = init_coordinates.x;
        this.y = init_coordinates.y;
        this.magnitud = magnitud;
    };
}
var node_labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
class Node{
    constructor(init_coordinates, id){
        this.id = id;
        this.component_type = 'node';
        this.x = init_coordinates.x;
        this.y = init_coordinates.y;
        this.label = node_labels[0];

        node_labels = node_labels.substring(1);
    }
}

class Circle{
    constructor(init_coordinates){
        this.id = -1;
        this.component_type = 'circle';
        this.x = init_coordinates.x;
        this.y = init_coordinates.y;
    }
}

//#endregion

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
        var object = new Force(init_coordinates, getForceAngleValues()[0],getForceAngleValues()[1], id);
    }
    else if(component == 'momentum'){
        var object = new Momentum(init_coordinates, getForceAngleValues()[2],id);
    }
    else if(component == 'circle'){
        var object = new Circle(init_coordinates)
    }
    else if(component == 'node'){
        var object = new Node(init_coordinates,id)
    }
    return object;
};

