///////////PROPERTY VUE/////////////////////////////////////////////////////////

var property_bind = new Vue({
  el: "#property_panel",
  data: current_element,
  methods: {
    processFile(event) {
      this.someData = event.target.files[0];
      window.current_element.sourceFile =
        "./scenes/assets/" + this.someData.name;
      window.reload_current_img();
    }
  }
});

///////SETTING VUE /////////////////////////////////////////////////////////////

var settings_bind = new Vue({
  el: "#main_settings",
  data: scene_state.settings,
  methods: {
    processFile(event) {
      this.someData = event.target.files[0];
      window.scene_state.settings.background.imgPath =
        "../scenes/assets/" + this.someData.name;
      window.propagate_settings();
    }
  }
});
///////INCREMENTALS VUE /////////////////////////////////////////////////////////////

var incrementals_bind = new Vue({
  el: "#incrementals_panel",
  data: G.INCREMENTALS
});
///////RESPONSIVE RELOAD VUE /////////////////////////////////////////////////////////////

var rr_bind = new Vue({
  el: "#responsive_reload",
  data: RESPONSIVE_RELOAD,
  methods: {
    updateCookie: function() {
      document.cookie = "" + this.active;
    }
  }
});
///////EPRESSION VUE /////////////////////////////////////////////////////////////
var responsive_parameters = {
  raw: [0, 1],
  clamp: [1, 1, 1],
  map: [0, 0, 1, 1],
  trigger: [0, [1, 0], 0],
  trigger_soft: [0, [1, 0], 0, 0, 0, 0],
  increment: [0, 0],
  bounce: [[1, 0], 0],
  sin: [[1, 0], 0],
  cos: [[1, 0], 0],
  pulse: [[1, 0], 0, 0, 0, 0],
  pulse_trigger: [[1, 0], 0, 0, 0, 0, 0],
  random: [[1, 0]],
  random_soft: [0, 0, 0]
};
var expression_bind = new Vue({
  el: "#expression_panel",
  data: current_expression,
  methods: {
    clearType() {
      this.dataType = undefined;
    }
  },
  computed: {
    suggestion: function() {
      var rule = [
        ["raw", "(SCALE), (OFFSET)", "-"],
        ["clamp", "MIN, MAX, (SCALE)", "-"],
        ["map", "MIN_in, MAX_in, MIN_out, MAX_out", "-"],
        ["trigger", "TRESHOLD, VALUE, :[>/</=]", "TRESHOLD, #COLOR, :[>/</=]"],
        [
          "trigger_soft",
          "TRESHOLD, VALUE, TIME_in, TIME_out, :[>/</=], (:i)",
          "TRESHOLD, hue_VALUE, TIME_in, TIME_out, :[>/</=], (:i)"
        ],
        ["increment", "SPEED", "SPEED, :[h/s/l]"],
        ["bounce", "AMPLITUDE, SPEED", "#COLOR, SPEED"],
        ["sin", "AMPLITUDE, SPEED", "#COLOR, SPEED"],
        ["cos", "AMPLITUDE, SPEED", "#COLOR, SPEED"],
        [
          "pulse",
          "AMPLITUDE, STAY_OFF, GO_ON, STAY_ON, GO_OF",
          "#COLOR, STAY_OFF, GO_ON, STAY_ON, GO_OF"
        ],
        [
          "pulse_trigger",
          "AMPLITUDE, GO_ON, STAY_ON, GO_OF, TRESHOLD, :[!/=/</>]",
          "#COLOR, GO_ON, STAY_ON, GO_OF, TRESHOLD, :[!/=/</>]"
        ],
        ["random", "MIN, MAX, FREQUENCY", "FREQUENCY"],
        ["random_soft", "MIN, MAX, SPEED", "-"]
      ];
      for (let i in rule) {
        if (this.dataBehaviour == rule[i][0]) {
          if (
            this.valueType == "color" &&
            typeof rule[i][2] !== typeof undefined
          )
            return rule[i][2];
          else return rule[i][1];
        }
      }
    },
    descriptionCompA: function() {
      var behaviours = [
        [
          "raw",
          "RAW: Takes the input source value as it is. SCALE and OFFSET are optional, they multiply or add some value to the input."
        ],
        [
          "clamp",
          "CLAMP: Same as 'raw' but prevent the input to go below MINor above MAX. SCALE its optional."
        ],
        [
          "map",
          "MAP: Remap the input so that its minimum correspond to MIN_out and its maximum to MAX_out. MIN_in and MAX_in are the minumum and maximum of the input (example: for the distance sensor they are 0 and 100)."
        ],
        [
          "trigger",
          "TRIGGER: When the input reach a certain TRESHOLD it assign VALUE. For checkBoxes the value can be 0 or 1."
        ],
        [
          "trigger_soft",
          "TRIGGER SOFT: Same as trigger but the change is not immediate but it takes TIME_in and TIME_out to occur. Adding :i as the last paramiter make sure the value is incremental to the initial one and not absolute."
        ],
        ["increment", "INCREMENT: It keeps adding the input."],
        [
          "bounce",
          "BOUNCE: Keeps moving between the current state and an AMPLITUDE/#COLOR with a certain SPEED. The input modulate the speed."
        ],
        ["sin", "SIN: Same as 'bounce' but in a softer way."],
        ["cos", "COS: same as 'sin' but with a different phase"],
        [
          "pulse",
          "PULSE: Keeps moving between the current state and an AMPLITUDE/#COLOR following the given timings. It ignores the input."
        ],
        [
          "pulse_trigger",
          "PULSE_TRIGGER: Every time the input meet a condition it trigger a pulse. The condition are !(change of input) =(meet threshold) >(go above treshold) <(go below treshold)."
        ],
        [
          "random",
          "Return a value between MIN and MAX every FREQUENCY. It ignores the input."
        ],
        [
          "random_soft",
          "Keeps adding a value between MIN and MAX. It ignores the input."
        ]
      ];
      var t = "";
      for (let i in behaviours) {
        if (this.dataBehaviour == behaviours[i][0]) {
          t += behaviours[i][1];
          break;
        }
      }
      if (t === "") t = "-";
      return t;
    },
    descriptionCompB: function() {
      var inputs = [
        [
          "frames",
          "FRAMES: Start from 0 and increase constantly through time. It's around 60 " +
            "frame per second, depending on the coumputer performance. Its the simplest input for all the behaviours."
        ],
        [
          "seconds",
          "SECONDS: increase of 1 every second since the scene played."
        ],
        [
          "minutes",
          "MINUTES: increase of 1 every minute since the scene played."
        ],
        ["hours", "HOURS: increase of 1 every hours since the scene played."],
        [
          "current_seconds",
          "CURRENT SECONDS: the seconds of the current time."
        ],
        [
          "current_minutes",
          "CURRENT MINUTES: the minutes of the current time."
        ],
        ["current_hours", "CURRENT HOURS: the hours of the current time."],
        [
          "distance",
          "DISTANCE: Give values between 0 and 200, where 0 is maximum close and 200 is maximum far."
        ],
        [
          "detection",
          "DETECTION: Give 1 when a person is recognized by the camera, otherwise gives 0."
        ],
        [
          "detection_count",
          "DETECTION COUNT: Counts the number of times the camera recognize someone."
        ],
        [
          "meteo_decription",
          "METEO DESCRIPTION: Couple of words that describe the current meteo."
        ],
        ["temperature", "TEMPERATURE: The current temperature in cesius."],
        ["pressure", "PRESSURE: The current pressure in hPa (hecto-pascal)."],
        ["humidity", "HUMIDITY: The current humidity percent (100% = rain)."],
        [
          "precipitation",
          "PRECIPITATION: The current mm of rain per hour that is falling."
        ],
        ["precipitation_kind", "PRECIPITATION KIND: rain/snow/nothing."],
        [
          "snow_centimeter",
          "SNOW CENTIMETER: The current cm of snow that have fallen."
        ],
        [
          "precipitation_forecast",
          "PRECIPITATION FORECAST: How many hours until the next expected precipitation."
        ],
        [
          "clouds_coverage",
          "CLOUDS COVERAGE: Percentage of the sky covered in clouds."
        ],
        ["wind_speed", "WIND SPEED: Current wind speed in meters per second."],
        [
          "wind_direction",
          "WIND DIRECTION: A 360° angle that rapresent the wind direction."
        ],
        ["sunset", "SUNSET: Time of sunset in hours."],
        ["sunrise", "SUNRISE: Time of sunrise in hours."],
        [
          "sun_height",
          "SUN HEIGHT: Tell on a scale from 0 to 100 if the sun is at its lowes or at his highest of the day."
        ],
        ["moon_phase", "MOON PHASE: What percentage of the moon is visible."],
        [
          "moon_phase_description",
          "MOON PHASE DESCRIPTION: The name of the moon phase."
        ]
      ];
      var t = "";
      for (let i in inputs) {
        if (this.dataType == inputs[i][0]) {
          t += inputs[i][1];
          break;
        }
      }
      if (t === "") t = "-";
      return t;
    }
  }
});
