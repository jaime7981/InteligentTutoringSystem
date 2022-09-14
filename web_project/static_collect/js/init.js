// Init
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var app_container = document.getElementById('dcl-app-draw-canvas');

//Buttons
var barButton = document.getElementById("select-bar-button");
var circleButton = document.getElementById("select-circle-button");
var supportButton = document.getElementById("select-support-button");
var slidingSupportButton = document.getElementById("select-sliding-support-button");
var forceButton = document.getElementById("select-force-button");
var saveAssignmentButton = document.getElementById("save-assignment-button");

//Form Values
var assignmentName = document.getElementById("input-text-selected-assignment-name");
var assignmentDescription = document.getElementById("input-text-selected-assignment-description");
var assignmentLevel = document.getElementById("input-text-selected-assignment-level");
var assignmentPhoto = document.getElementById("input-file-selected-assignment-photo");

const WIDTH = app_container.offsetWidth;
const HEIGHT = app_container.offsetHeight;
const STEP = 50;
const LINE_WIDTH = 10;
context.canvas.width  = WIDTH;
context.canvas.height = HEIGHT;
canvas.style.backgroundColor = 'white';

const COLOR_BAR = 'blue';
const COLOR_CIRCLE = 'red';
const COLOR_SUPPORT = 'lime';
const COLOR_SLIDING = 'purple';
const COLOR_FORCE = 'cyan';

var bar_list = [];
var circle_list = [];

var selected_shape = 'bar';
var selected_color = 'blue';
var selected_object = 'bar';

var horizontal_points = [];
var vertical_points = [];
