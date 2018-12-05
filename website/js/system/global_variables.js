var G = {
  _LAST_FILLCOLOR: "#1800d7",
  _LAST_STROKECOLOR: "#15007d",
  _LAST_STROKE_WIDTH: 0,
  SCENE_RUNNING: {
    active: false,
    warning: false
  },
  LOADING: false,
  MAIUSC: false,
  CMD: false,
  LOAD_LOG: {
    index: 0,
    saved_scenes_list: [],
    focus: false
  },
  HIDE_HEADBAR: false,
  DROP_EXPRESSION: {
    active: false,
    type: ""
  },
  DROP_OBJECT: {
    active: false,
    type: undefined
  },
  TRANSFORM: {
    active: false,
    type: undefined,
    initial_pos: null,
    target_pos: null,
    initial_val: NaN,
    ratio: NaN,
    initial_distance: NaN
  },
  LINEMAKING: {
    active: false,
    type: "line"
  },
  PREVENT_HOTKEYS: false,
  EXPRESSION_PANEL_OPEN: false
};
////////////////////////////////////////////////////////////////////////////////
var runTime = {
  frames: 0
};
var width = window.innerWidth;
var height = window.innerHeight;
var current_multiselection = [];
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
