

joinTeacherButton = document.getElementById('join-teacher-classroom-button');
teacherSelectorData = document.getElementById('teachers-options');

joinTeacherButton.addEventListener('click', function() {
    var fd = new FormData();
    fd.append('selected_teacher', teacherSelectorData.value);
    ajaxJoinTeacherClassroom(fd);
}, false);

var ajaxJoinTeacherClassroom = function(fd) {
    $.ajaxSetup({
        headers: {
            "X-CSRFToken" : getCookie('csrftoken')
        }
    });
    $.ajax({
        type: 'POST',
        url: "/dcl/student",
        data: fd,
        processData: false,
        contentType: false,
        cache:false,
        success: function (response) {
            window.location.href = student_join_teacher_redirect;
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
