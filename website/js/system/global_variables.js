var G = {
  INCREMENTALS: {
    x: 20,
    y: 20,
    w: 0,
    h: 0,
    r: 0,
    hue: 0,
    width: 0,
    saturation: 0,
    lightness: 0,
    opacity: 0
  },
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
var runTimeInput = {
  frames: 0,
  distance: 50,
  detection: 0,
  detection_count: 0,
  neutral: 1,
  seconds: 0,
  minutes: 0,
  hours: 0,
  current_seconds: 0,
  current_minutes: 0,
  current_hours: 0,
  meteo_decription: "",
  meteo_index: 0,
  temperature: 0,
  pressure: 0,
  humidity: 0,
  precipitation: 0,
  precipitation_kind: "",
  snow_centimeter: 0,
  precipitation_forecast: 0,
  clouds_coverage: 0,
  wind_speed: 0,
  wind_direction: 0,
  sunset: 0,
  sunrise: 0,
  sun_height: 0,
  moon_phase: 0,
  moon_phase_description: "",
  quake_count: 0,
  last_quake_intensity: 0,
  wave_frequency: 0,
  wave_height: 0
  // current_consumption: 0,
  // daily_consumption: 0,
  // current_country_average: 0,
  // run_today: 0,
  // average_daily_run: 0,
  // run_this_week: 0,
  // average_weekly_run: 0
};
var dataSets = {
  time: null
};
var first_load = true;
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
  valueType: ""
};
var paper_elements = [];
var paper_tool;
var RIO = 1;
var RESPONSIVE_RELOAD = { active: false };
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
var datas;

var mouseX = 0;
var mouseY = 0;
