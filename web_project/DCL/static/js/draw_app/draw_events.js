//Buttons
var selectorButton = document.getElementById("selector-button");
var eraserButton = document.getElementById("select-eraser-button");
var barButton = document.getElementById("select-bar-button");
var supportButton = document.getElementById("select-support-button");
var slidingHorizontalButton = document.getElementById("select-sliding-horizontal-button");
var slidingVerticalButton = document.getElementById("select-sliding-vertical-button");
var forceButton = document.getElementById("select-force-button");
var momentumButton = document.getElementById("select-momentum-button");
var clearButton = document.getElementById("select-clear-button");

var debugButton = document.getElementById('load-debug');
var debugContainer = document.getElementById('debug-container');


// Input Fields
var sideBar = document.getElementById("dcl-app-side-bar-canvas");
var forceField = document.getElementById("force-container"); // No se va a usar
var angleField = document.getElementById("angle-container"); // No se va a usar

var appendForceField = function() {
    let div = document.createElement("div");
    div.setAttribute("id", id="force-container");
    div.innerHTML = "<label id='force-label'>Force (Newton)</label><input type='text' id='force-value'  value='1' style='width: 100%;'>";
    sideBar.appendChild(div);
};

var appendAngleField = function() {
    let div = document.createElement("div");
    div.setAttribute("id", id="angle-container");
    div.innerHTML = "<label id='angle-label'>Angle (degree)</label><input type='text' id='angle-value' value='90' style='width: 100%;'>";
    sideBar.appendChild(div);
};

var deleteAllContent = function() {
    sideBar.innerHTML = "<h3 id='info-label'>Data</h3>";
};

var getForceAngleValues = function() {
    var forceValue = document.getElementById("force-value");
    var angleValue = document.getElementById("angle-value");
    var force_value = null;
    var angle_value = null;

    if (forceValue != null) {
        force_value = forceValue.value;
    }
    if (angleValue != null) {
        angle_value = angleValue.value;
    }
    return([force_value, angle_value]);
}

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
    deleteAllContent();
}, false);
supportButton.addEventListener('click', function() {
    current_component = 'support';
    adding_component = true;
    deleteAllContent();
    appendAngleField();
}, false);
slidingHorizontalButton.addEventListener('click', function() {
    current_component = 'sliding_horizontal';
    adding_component = true;
    deleteAllContent();
    appendAngleField();
}, false);
slidingVerticalButton.addEventListener('click', function() {
    current_component = 'sliding_vertical';
    adding_component = true;
    deleteAllContent();
    appendAngleField();
}, false);
forceButton.addEventListener('click', function() {
    current_component = 'force';
    adding_component = true;
    deleteAllContent();
    appendForceField();
    appendAngleField();
}, false);
momentumButton.addEventListener('click', function() {
    current_component = 'momentum';
    adding_component = true;
    deleteAllContent();
    appendForceField();
}, false)

 
debugButton.addEventListener('click', function() {
    console.log('debug button presed');
    functionMesasge(getForceAngleValues());
}, false);

var functionMesasge = function(message) {
    if (message != null) {
        console.log(message);
        debugContainer.innerHTML = "";
        let div = document.createElement("div");
        div.innerHTML = "<p>" + message +"</p><br>";
        debugContainer.appendChild(div);
    }
};
