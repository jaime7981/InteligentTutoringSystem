//Buttons
var selectorButton = document.getElementById("selector-button");
var eraserButton = document.getElementById("select-eraser-button");
var barButton = document.getElementById("select-bar-button");
var circleButton = document.getElementById("select-circle-button");
var supportButton = document.getElementById("select-support-button");
var slidingHorizontalButton = document.getElementById("select-sliding-horizontal-button");
var slidingVerticalButton = document.getElementById("select-sliding-vertical-button");
var forceButton = document.getElementById("select-force-button");
var momentumButton = document.getElementById("select-momentum-button");
var clearButton = document.getElementById("select-clear-button");

// Input Fields
var sideBar = document.getElementById("dcl-app-side-bar-canvas");
var forceField = document.getElementById("force-container");
var angleField = document.getElementById("angle-container");
var torqueField = document.getElementById("torque-container");
var testField = document.getElementById("test-1-container");

var allInvisible = function() {
    forceField.style.visibility = "hidden";
    angleField.style.visibility = "hidden";
    torqueField.style.visibility = "hidden";
    testField.style.visibility = "hidden";
};

var appendForceField = function() {
    let div = document.createElement("div");
    div.setAttribute("id", id="force-container");
    div.innerHTML = "<label id='force-label'>Force Magnitude</label><input type='text' id='force-value' style='width: -webkit-fill-available;'>";
    sideBar.appendChild(div);
};

var appendAngleField = function() {
    let div = document.createElement("div");
    div.setAttribute("id", id="angle-container");
    div.innerHTML = "<label id='angle-label'>Angle</label><input type='text' id='angle-value' style='width: -webkit-fill-available;'>";
    sideBar.appendChild(div);
};

var deleteContainers = function() {
    if (forceField != null) {
        console.log("there is a force container");
    }
    if (angleField != null) {
        console.log("there is a angle container");
    }
};

var deleteAllContent = function() {
    sideBar.innerHTML = "";
};

//Buttons Event Handlers
selectorButton.addEventListener('click',function(){
    current_component = 'selector'; 
    adding_component = false;
},false);
eraserButton.addEventListener('click',function(){
    current_component = 'eraser'; 
    adding_component = false;
},false)
clearButton.addEventListener('click', function(){
    drawn_layer.destroyChildren();
}, false)

barButton.addEventListener('click', function() {
    current_component = 'bar';
    adding_component = true;
    allInvisible();
}, false);
supportButton.addEventListener('click', function() {
    current_component = 'support';
    adding_component = true;
    allInvisible();
    angleField.style.visibility = "visible";
}, false);
slidingHorizontalButton.addEventListener('click', function() {
    current_component = 'sliding_horizontal';
    adding_component = true;
    allInvisible();
    angleField.style.visibility = "visible";
}, false);
slidingVerticalButton.addEventListener('click', function() {
    current_component = 'sliding_vertical';
    adding_component = true;
    allInvisible();
    angleField.style.visibility = "visible";
}, false);
forceButton.addEventListener('click', function() {
    current_component = 'force';
    adding_component = true;
    allInvisible();
    forceField.style.visibility = "visible";
    angleField.style.visibility = "visible";
    appendForceField();
}, false);
momentumButton.addEventListener('click', function() {
    current_component = 'momentum';
    adding_component = true;
    allInvisible();
    torqueField.style.visibility = "visible";
}, false)

 