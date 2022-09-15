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
    this.draw_type = selected_shape;
    this.object_type = selected_object;
    this.color = selected_color;
    this.name = selected_object + '_' + (bar_list.length + 1);

    this.draw = function() {
        context.beginPath();
        context.moveTo(this.init_x, this.init_y);
        context.lineTo(this.end_x, this.end_y);
        context.closePath();
        context.strokeStyle = this.color;
        context.lineWidth = LINE_WIDTH;
        context.stroke();
    }
}

function Circle(init_coordinates) {
    this.init_x = init_coordinates.x;
    this.init_y = init_coordinates.y;
    this.draw_type = selected_shape;
    this.object_type = selected_object;
    this.name = selected_object + '_' + (circle_list.length + 1);
    this.color = selected_color;
    this.rad = 5;

    this.draw = function() {
        context.beginPath();
        context.arc(this.init_x, this.init_y, this.rad, 0, 2 * Math.PI); //(center_x, center_y, start_angle, end_angle)
        context.closePath();
        context.strokeStyle = this.color;
        context.stroke();
    }
}
