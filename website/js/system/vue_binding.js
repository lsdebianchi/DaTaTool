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
  computed: {
    suggestion: function() {
      var rule = [
        ["increment", "SPEED", "SPEED, :[h/s/l]"],
        ["bounce", "AMPLITUDE, SPEED", "#COLOR, SPEED"],
        ["sin", "AMPLITUDE, SPEED", "NO-COLOR-MODE"],
        ["cos", "AMPLITUDE, SPEED", "NO-COLOR-MODE"],
        [
          "pulse",
          "AMPLITUDE, STAY_OFF, GO_ON, STAY_ON, GO_OF",
          "#COLOR, STAY_OFF, GO_ON, STAY_ON, GO_OF"
        ],
        ["random", "MIN, MAX, FREQUENCY", "NO-COLOR-MODE"],
        ["random_soft", "MIN, MAX, SPEED", "NO-COLOR-MODE"]
      ];
      for (var i in rule) {
        if (this.dataBehaviour == rule[i][0]) {
          if (
            this.inputType == "color" &&
            typeof rule[i][2] !== typeof undefined
          )
            return rule[i][2];
          else return rule[i][1];
        }
      }
    }
  }
});
