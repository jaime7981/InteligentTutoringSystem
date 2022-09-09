// Load data
var loadAssigmentData = function() {
    if (assignment_js != ''){ 
        assignment_js = assignment_js.replace(new RegExp("&"+"#"+"x27;", "g"), '"');
        assignment_js = assignment_js.replace(new RegExp("&"+"quot;", "g"), '"');
        assignment_js = assignment_js.replace(new RegExp("None", "g"), 'null');
        console.log(assignment_js);
        var parsedJson = JSON.parse(assignment_js);
        for (object in parsedJson['assignment_data']){
            if (parsedJson['assignment_data'][object]['data'] != null){
                var object_data = parsedJson['assignment_data'][object]['data'];
                
                if (object_data["draw_type"] == 'bar') {
                    bar_list.push(dataToBar(object_data));
                }
                else if (object_data["draw_type"] == 'circle') {
                    circle_list.push(dataToCircle(object_data));
                }
            }
        }
    }
}

var dataToBar = function(data) {
    var new_bar = new Bar(new Point(data['init_x'], data['init_y']),
                          new Point(data['end_x'], data['end_y']));
    new_bar.draw_type = data['draw_type'];
    new_bar.object_type = data['object_type'];
    new_bar.color = data['color'];
    new_bar.name = data['name'];
    return new_bar;
}

var dataToCircle = function(data) {
    var new_circle = new Circle(new Point(data['init_x'], data['init_y']));
    new_circle.draw_type = data['draw_type'];
    new_circle.object_type = data['object_type'];
    new_circle.color = data['color'];
    new_circle.name = data['name'];
    return new_circle;
}

//Save Data
var prepareJsonData = function() {
    var json_output_list = ['{"assignment_data" : ['];
    var json_parsed_object = '';
    for (list_element in  bar_list) {
        json_parsed_object = '{ "data" : ' + JSON.stringify(bar_list[list_element]) + '},';
        json_output_list.push(json_parsed_object);
    }
    for (list_element in  circle_list) {
        json_parsed_object = ['{ "data" : ', 
                                    JSON.stringify(circle_list[list_element]),
                                    '},'].join('');
        json_output_list.push(json_parsed_object);
    }

    json_output_list.push('{"level" : null, "name" : null}]}')
    json_parsed_object = json_output_list.join('');
    return json_parsed_object;
}

var ajaxSaveAssignment = function(json_data) {
    var fd = new FormData();
    fd.append("assignment_data" , json_data);
    fd.append("assignment_id" , assignment_id);
    fd.append("assignment_name" , assignmentName.value.toUpperCase());
    fd.append("assignment_description" , assignmentDescription.value);
    fd.append("assignment_level" , 1);
    fd.append("assignment_photo", assignmentPhoto.files[0]);
    $.ajaxSetup({
        headers: {
            "X-CSRFToken" : getCookie('csrftoken')
        }
    });
    $.ajax({
        type: 'POST',
        url: "/dcl/app",
        data: fd,
        processData: false,
        contentType: false,
        cache:false,
        success: function (response) {
            window.location.href = teacher_redirect;
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
    var json_data = prepareJsonData();
    console.log(json_data);
    ajaxSaveAssignment(json_data);
}, false);
