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
  el: "#settings_panel",
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

///////EPRESSION VUE /////////////////////////////////////////////////////////////

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
        ["trigger", "TRESHOLD, VALUE, :[>/</=]"],
        ["increment", "SPEED", "SPEED, :[h/s/l]"],
        ["bounce", "AMPLITUDE, SPEED", "#COLOR, SPEED"],
        ["sin", "AMPLITUDE, SPEED", "NO-COLOR-MODE"],
        ["cos", "AMPLITUDE, SPEED", "NO-COLOR-MODE"],
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
        ["random", "MIN, MAX, FREQUENCY", "NO-COLOR-MODE"],
        ["random_soft", "MIN, MAX, SPEED", "NO-COLOR-MODE"]
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
          "distance",
          "DISTANCE: Give values between 0 and 200, where 0 is maximum close and 200 is maximum far."
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
