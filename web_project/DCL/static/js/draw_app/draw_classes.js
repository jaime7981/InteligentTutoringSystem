// Math Components
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

// Draw Components
class Bar{
    constructor(init_coordinates, end_coordinates, id){
        this.id = id;
        this.component_type = 'bar';
        this.init_x = init_coordinates.x;
        this.init_y = init_coordinates.y;
        this.end_x = end_coordinates.x;
        this.end_y = end_coordinates.y;
        this.size = getBarSize(init_coordinates, end_coordinates);
        this.middle = getBarMiddle(init_coordinates, end_coordinates)
        this.scaled_size = this.size/STEP
        this.line = new Line(init_coordinates, end_coordinates);
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

class Force{
    constructor(init_coordinates, magnitud, angle, id){
        this.id = id;
        this.component_type = 'force';
        this.init_x = init_coordinates.x;
        this.init_y = init_coordinates.y;
        this.magnitud = magnitud;
        this.angle = angle;
    };
}

class Momentum{
    constructor(init_coordinates, magnitud, id){
        this.id = id;
        this.component_type = 'momentum';
        this.init_x = init_coordinates.x;
        this.init_y = init_coordinates.y;
        this.magnitud = magnitud;
    };
}

class Support{
    constructor(init_coordinates, type, id){
        this.id = id;
        this.component_type = 'support';
        this.support_type = type;
        this.init_x = init_coordinates.x;
        this.init_y = init_coordinates.y;

        if(type == 'support'){
            this.reaction_x = true;
            this.reaction_y = true;
            this.reaction_momentum = false;
        }
        else if(type == 'horizontal'){
            this.reaction_x = false;
            this.reaction_y = true;
            this.reaction_momentum = false;
        }
        else if(type == 'vertical'){
            this.reaction_x = true;
            this.reaction_y = false;
            this.reaction_momentum = false;
        }
        else if(type == 'fixed'){
            this.reaction_x = true;
            this.reaction_y = true;
            this.reaction_momentum = true;
        }
    }
}