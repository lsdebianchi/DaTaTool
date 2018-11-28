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
  data: scene_state.settings
});

///////EPRESSION VUE /////////////////////////////////////////////////////////////

var expression_bind = new Vue({
  el: "#expression_panel",
  data: current_expression,
  computed: {
    suggestion: function() {
      if (this.dataBehaviour == "increment")
        return this.inputType != "color" ? "SPEED" : "SPEED, :[H/S/L]";
      if (this.dataBehaviour == "bounce")
        return this.inputType != "color" ? "AMPLITUDE, SPEED" : ":COLOR, SPEED";
      if (this.dataBehaviour == "sin") return "AMPLITUDE, SPEED";
      if (this.dataBehaviour == "cos") return "AMPLITUDE, SPEED";
      if (this.dataBehaviour == "pulse")
        return "AMPLITUDE, STAY_OFF, GO_ON, STAY_ON, GO_OF";
      if (this.dataBehaviour == "random") return "MIN, MAX, FREQUENCY";
      if (this.dataBehaviour == "random_soft") return "MIN, MAX, SPEED";
    }
  }
});
