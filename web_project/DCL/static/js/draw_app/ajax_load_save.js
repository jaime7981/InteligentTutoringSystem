var saveAssignmentButton = document.getElementById("save-assignment-button");
var assignmentName = document.getElementById("input-text-selected-assignment-name");
var assignmentDescription = document.getElementById("input-text-selected-assignment-description");
var assignmentLevel = document.getElementById("input-text-selected-assignment-level");
var assignmentPhoto = document.getElementById("input-file-selected-assignment-photo");
var stepOneCheckbox = document.getElementById("step-1");
var stepTwoCheckbox = document.getElementById("step-2");
var stepThreeCheckbox = document.getElementById("step-3");
var stepFourCheckbox = document.getElementById("step-4");

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

var getAssignmentSteps = function(){
    return [stepOneCheckbox.checked, stepTwoCheckbox.checked, stepThreeCheckbox.checked, stepFourCheckbox.checked];
}

var ajaxSaveAssignment = function(json_data, deletion, duplicate) {
    var fd = new FormData();
    fd.append("assignment_data" , json_data);
    fd.append("assignment_id" , assignment_id);
    fd.append("assignment_name" , assignmentName.value.toUpperCase());
    fd.append("assignment_description" , assignmentDescription.value);
    fd.append("assignment_level" , 1);
    if (assignmentPhoto != null) {
        fd.append("assignment_photo", assignmentPhoto.files[0]);
    }
    else {
        fd.append("assignment_photo", null);
    }
    fd.append("delete_check", deletion);
    fd.append("duplicate_check", duplicate);
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
    var delete_button = document.getElementById("delete-assignment");
    var dulpicate_button = document.getElementById("duplicate-assignment");
    ajaxSaveAssignment(prepareJsonData(), delete_button.checked, dulpicate_button.checked);
}, false);
