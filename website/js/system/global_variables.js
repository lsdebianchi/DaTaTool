var _LAST_FILLCOLOR = "#1800d7";
var _LAST_STROKECOLOR = "#15007d";
var _LAST_STROKE_WIDTH = 0;
var SCENE_RUNNING = {
  active: false,
  warning: false
};
var MAIUSC = false;
var LOAD_LOG = {
  index: 0,
  saved_scenes_list: [],
  focus: false
};
var HIDE_HEADBAR = false;
var DROP_OBJECT = {
  active: false,
  type: undefined
};
var TRANSFORM = {
  active: false,
  type: undefined,
  initial_pos: null,
  target_pos: null,
  initial_val: NaN,
  ratio: NaN,
  initial_distance: NaN
};
var LINEMAKING = {
  active: false,
  type: "line"
};
var runTime = {
  frames: 0
};
var PREVENT_HOTKEYS = false;
var EXPRESSION_PANEL_OPEN = false;

var width = window.innerWidth;
var height = window.innerHeight;
var current_project = new Scene({});
var current_element = new Element({});
var current_expression = {
  dataBehaviour: undefined,
  dataSource: "time",
  dataType: "frames",
  expression: "",
  inputType: ""
};
var paper_elements = [];
var paper_tool;

var scene_state = {
  play_setting: {
    sensor: false
  },

  settings: {
    background: {
      color: "#000000",
      position: "center",
      size: "auto",
      repeat: "no-repeat",
      imgPath: ""
    }
  },

  elements: [],

  objects: {}
};
var tracker;

var mouseX = 0;
var mouseY = 0;
