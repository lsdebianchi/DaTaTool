function assign_methods(elem) {
  elem._paper_elem = paper_elements[elem.paper_element_index];

  for (var i in attr_list) {
    var data = elem["data_" + attr_list[i]];
    data.method = undefined;
    data.var = { target: attr_list[i] };
    var param = data.expression.split(", "); //data.expression.match(/[+-]?\d+(\.\d+)?/g);

    for (var j in param) {
      if (param[j].match(/^:/) || param[j].match(/^#/))
        param[j] = param[j].substring(1);
      else param[j] = Number(param[j]);
    }

    //
    //////////////////////////////////////////////////////////////////////////////////NUMBERS
    if (data.inputType == "number") {
      //increment
      if (data.dataBehaviour == "increment") {
        data.var.speed = param[0];

        data.method = function(v) {
          this[v.target] += v.speed;
        }.bind(elem);
      }
      //bounce
      else if (data.dataBehaviour == "bounce") {
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = Math.abs(param[1]);
        data.var.state = true;

        data.method = function(v) {
          if (v.state) v.delta += v.speed;
          else v.delta -= v.speed;
          if (v.delta > v.amplitude / 2) v.state = false;
          else if (v.delta < -v.amplitude / 2) v.state = true;
          this[v.target] = v.init + v.delta;
        }.bind(elem);
      }
      //sin
      else if (data.dataBehaviour == "sin") {
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          this[v.target] =
            v.init +
            Math.sin((runTime.frames / 360) * Math.PI * v.speed) * v.amplitude;
        }.bind(elem);
      }
      //cos
      else if (data.dataBehaviour == "cos") {
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          this[v.target] =
            v.init +
            Math.cos((runTime.frames / 360) * Math.PI * v.speed) * v.amplitude;
        }.bind(elem);
      }
      //pulse
      else if (data.dataBehaviour == "pulse") {
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.state = 0;
        data.var.counter = 0;
        data.var.state_t = [param[1], param[2], param[3], param[4]];

        data.method = function(v) {
          v.counter++;
          if (v.counter >= v.state_t[v.state]) {
            v.state = (v.state + 1) % 4;
            v.counter = 0;
          }
          if (v.state === 1) {
            v.delta = ((v.counter + 1) / v.state_t[v.state]) * v.amplitude;
          } else if (v.state === 3) {
            v.delta = (1 - (v.counter + 1) / v.state_t[v.state]) * v.amplitude;
          }

          this[v.target] = v.init + v.delta;
        }.bind(elem);
      }
      //random
      else if (data.dataBehaviour == "random") {
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.freq = param[2];
        data.var.count = param[2];

        data.method = function(v) {
          v.count--;
          if (v.count <= 0) {
            v.count = v.freq;
            this[v.target] = Math.random() * (v.max - v.min) + v.min;
          }
        }.bind(elem);
      }
      //random_soft
      else if (data.dataBehaviour == "random_soft") {
        data.var.ampli_min = param[0];
        data.var.ampli_max = param[1];
        data.var.speed = param[2];
        data.var.t = elem[data.var.target];

        data.method = function(v) {
          if (Math.abs(v.t - this[v.target]) <= v.speed)
            v.t =
              this[v.target] +
              (Math.random() * (v.ampli_max - v.ampli_min) + v.ampli_min) *
                (Math.random() < 0.5 ? -1 : 1);
          else if (v.t > this[v.target]) this[v.target] += v.speed;
          else if (v.t < this[v.target]) this[v.target] -= v.speed;
        }.bind(elem);
      }
    }
    //
    //////////////////////////////////////////////////////////////////////////////////COLORS
    if (data.inputType == "color") {
      //increment
      if (data.dataBehaviour == "increment") {
        data.var.speed = param[0];
        data.var.type = param[1] ? param[1] : "h";
        if (data.var.type !== "h") data.var.speed /= 100;
        data.method = function(v) {
          var c = chroma(this[v.target]);
          c = c.set("hsl." + v.type, c.get("hsl." + v.type) + v.speed);

          this[v.target] = c.hex();
        }.bind(elem);
      }
      //bounce
      else if (data.dataBehaviour == "bounce") {
        data.var.init = chroma(elem[data.var.target]);
        data.var.delta = 0;
        data.var.t = chroma(param[0]);
        data.var.speed = Math.abs(param[1]) / 100;
        data.var.state = true;

        data.method = function(v) {
          if (v.state) v.delta += v.speed;
          else v.delta -= v.speed;
          if (v.delta > 1) v.state = false;
          else if (v.delta < 0) v.state = true;
          // console.log(this.fillColor);

          this[v.target] = chroma.mix(v.init, v.t, v.delta).hex();
        }.bind(elem);
      }
      //sin
      // else if (data.dataBehaviour == "sin") {
      //   data.var.init = elem[data.var.target];
      //   data.var.delta = 0;
      //   data.var.amplitude = param[0];
      //   data.var.speed = param[1];
      //
      //   data.method = function(v) {
      //     this[v.target] =
      //       v.init +
      //       Math.sin((runTime.frames / 360) * Math.PI * v.speed) * v.amplitude;
      //   }.bind(elem);
      // }
      //cos
      // else if (data.dataBehaviour == "cos") {
      //   data.var.init = elem[data.var.target];
      //   data.var.delta = 0;
      //   data.var.amplitude = param[0];
      //   data.var.speed = param[1];
      //
      //   data.method = function(v) {
      //     this[v.target] =
      //       v.init +
      //       Math.cos((runTime.frames / 360) * Math.PI * v.speed) * v.amplitude;
      //   }.bind(elem);
      // }
      //pulse
      else if (data.dataBehaviour == "pulse") {
        data.var.init = chroma(elem[data.var.target]);
        data.var.delta = 0;
        data.var.final_color = chroma(param[0]);
        data.var.state = 0;
        data.var.counter = 0;
        data.var.state_t = [param[1], param[2], param[3], param[4]];

        data.method = function(v) {
          v.counter++;
          if (v.counter >= v.state_t[v.state]) {
            v.state = (v.state + 1) % 4;
            v.counter = 0;
          }
          if (v.state === 1) {
            v.delta = (v.counter + 1) / v.state_t[v.state];
          } else if (v.state === 3) {
            v.delta = 1 - (v.counter + 1) / v.state_t[v.state];
          }
          //console.log(chroma.mix(v.init, v.target, v.delta).hex());
          this[v.target] = chroma.mix(v.init, v.final_color, v.delta).hex();
        }.bind(elem);
      }
      //random
      else if (data.dataBehaviour == "random") {
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.freq = param[2];
        data.var.count = param[2];

        data.method = function(v) {
          v.count--;
          if (v.count <= 0) {
            v.count = v.freq;
            this[v.target] = Math.random() * (v.max - v.min) + v.min;
          }
        }.bind(elem);
      }
      //random_soft
      else if (data.dataBehaviour == "random_soft") {
        data.var.ampli_min = param[0];
        data.var.ampli_max = param[1];
        data.var.speed = param[2];
        data.var.t = elem[data.var.target];

        data.method = function(v) {
          if (Math.abs(v.t - this[v.target]) <= v.speed)
            v.t =
              this[v.target] +
              (Math.random() * (v.ampli_max - v.ampli_min) + v.ampli_min) *
                (Math.random() < 0.5 ? -1 : 1);
          else if (v.t > this[v.target]) this[v.target] += v.speed;
          else if (v.t < this[v.target]) this[v.target] -= v.speed;
        }.bind(elem);
      }
    }
  }
}
