function assign_methods(elem) {
  elem._paper_elem = paper_elements[elem.paper_element_index];

  for (let i in attr_list) {
    var data = elem["data_" + attr_list[i]];
    data.method = undefined;
    data.var = { target: attr_list[i] };
    var param = data.expression.split(", "); //data.expression.match(/[+-]?\d+(\.\d+)?/g);

    for (let j in param) {
      if (param[j] === "W") param[j] = $("canvas").width() + "";
      if (param[j] === "H") param[j] = $("canvas").height() + "";

      if (param[j].match(/^:/) || param[j].match(/^#/))
        param[j] = param[j].substring(1);
      else param[j] = Number(param[j]);
    }

    //

    //
    //////////////////////////////////////////////////////////////////////////////////NUMBERS
    //////////////////////////////////////////////////////////////////////////////////NUMBERS
    //////////////////////////////////////////////////////////////////////////////////NUMBERS
    //////////////////////////////////////////////////////////////////////////////////NUMBERS
    //////////////////////////////////////////////////////////////////////////////////NUMBERS
    data.var.input = data.dataType;

    if (data.valueType == "number") {
      //raw
      if (data.dataBehaviour == "raw") {
        data.var.scale = param[0] ? param[0] : 1;
        data.var.offset = param[1] ? param[1] : 0;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          this[v.target] = INPUT * v.scale + v.offset;
        }.bind(elem);
      }
      //clamp
      if (data.dataBehaviour == "clamp") {
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.scale = param[2] ? param[2] : 1;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input] * v.scale;
          if (INPUT < v.min) INPUT = v.min;
          if (INPUT > v.max) INPUT = v.max;
          this[v.target] = INPUT;
        }.bind(elem);
      }
      //map
      if (data.dataBehaviour == "map") {
        data.var.min_in = param[0];
        data.var.max_in = param[1];
        data.var.min_out = param[2];
        data.var.max_out = param[3];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          INPUT =
            v.min_out +
            (v.max_out - v.min_out) *
              ((INPUT - v.min_in) / (v.max_in - v.min_in));

          this[v.target] = INPUT;
        }.bind(elem);
      }
      //trigger
      if (data.dataBehaviour == "trigger") {
        data.var.init = Number(elem[data.var.target]);
        data.var.tresh = param[0];
        data.var.value = param[1];
        data.var.check = 0;
        if (param[2] == "<") data.var.check = 1;
        if (param[2] == ">") data.var.check = 2;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          var test = false;
          if (v.check == 0) if (INPUT == v.tresh) test = true;
          if (v.check == 1) if (INPUT < v.tresh) test = true;
          if (v.check == 2) if (INPUT > v.tresh) test = true;

          this[v.target] = test ? v.value : v.init;
        }.bind(elem);
      }
      //increment
      if (data.dataBehaviour == "increment") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.speed = param[0];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          this[v.target] += INPUT * v.speed;
        }.bind(elem);
      }
      //bounce
      else if (data.dataBehaviour == "bounce") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = Math.abs(param[1]);
        data.var.state = true;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          if (v.state) v.delta += INPUT * v.speed;
          else v.delta -= INPUT * v.speed;
          if (v.delta > v.amplitude / 2) v.state = false;
          else if (v.delta < -v.amplitude / 2) v.state = true;
          this[v.target] = v.init + v.delta;
        }.bind(elem);
      }
      //sin
      else if (data.dataBehaviour == "sin") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          v.delta += INPUT * v.speed;

          this[v.target] =
            v.init + (Math.sin((v.delta / 360) * Math.PI) * v.amplitude) / 2;
        }.bind(elem);
      }
      //cos
      else if (data.dataBehaviour == "cos") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          v.delta += INPUT * v.speed;

          this[v.target] =
            v.init + (Math.cos((v.delta / 360) * Math.PI) * v.amplitude) / 2;
        }.bind(elem);
      }
      //pulse
      else if (data.dataBehaviour == "pulse") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.state = 0;
        data.var.counter = 0;
        data.var.state_t = [param[1], param[2], param[3], param[4]];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
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
      //pulse_trigger
      else if (data.dataBehaviour == "pulse_trigger") {
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.last_result = false;
        data.var.last_input = data.var.init;
        data.var.amplitude = param[0];
        data.var.state = 0;
        data.var.counter = 0;
        data.var.going = false;
        data.var.state_t = [param[1], param[2], param[3]];
        data.var.tresh = param[4];
        if (param[5] == "!") data.var.check = 0;
        if (param[5] == "=") data.var.check = 1;
        if (param[5] == ">") data.var.check = 2;
        if (param[5] == "<") data.var.check = 3;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          if (!v.going) {
            var result = false;
            if (v.check == 0) if (INPUT == v.last_input) result = true;
            if (v.check == 1) if (INPUT == v.tresh) result = true;
            if (v.check == 2) if (INPUT > v.tresh) result = true;
            if (v.check == 3) if (INPUT < v.tresh) result = true;

            if (result && !v.last_result) v.going = true;
            v.last_result = result;
          }

          if (v.going) {
            v.counter++;
            if (v.counter >= v.state_t[v.state]) {
              v.state = (v.state + 1) % 3;
              v.counter = 0;

              if (v.state == 0) {
                v.going = false;
                return;
              }
            }

            if (v.state === 0) {
              v.delta = ((v.counter + 1) / v.state_t[v.state]) * v.amplitude;
            } else if (v.state === 2) {
              v.delta =
                (1 - (v.counter + 1) / v.state_t[v.state]) * v.amplitude;
            }
          }

          this[v.target] = v.init + v.delta;
        }.bind(elem);
      }
      //random
      else if (data.dataBehaviour == "random") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.freq = param[2];
        data.var.count = param[2];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          v.count--;
          if (v.count <= 0) {
            v.count = v.freq;
            this[v.target] = Math.random() * (v.max - v.min) + v.min;
          }
        }.bind(elem);
      }
      //random_soft
      else if (data.dataBehaviour == "random_soft") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.ampli_min = param[0];
        data.var.ampli_max = param[1];
        data.var.speed = param[2];
        data.var.t = elem[data.var.target];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

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
    //////////////////////////////////////////////////////////////////////////////////COLORS
    //////////////////////////////////////////////////////////////////////////////////COLORS
    //////////////////////////////////////////////////////////////////////////////////COLORS
    //////////////////////////////////////////////////////////////////////////////////COLORS
    if (data.valueType == "color") {
      //raw
      if (data.dataBehaviour == "raw") {
        data.var.scale = param[0] ? param[0] : 1;
        data.var.offset = param[1] ? param[1] : 0;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          this[v.target] = INPUT * v.scale + v.offset;
        }.bind(elem);
      }
      //clamp/////////////////////////////////////NO
      if (data.dataBehaviour == "clamp") {
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.scale = param[2] ? param[2] : 1;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input] * v.scale;
          if (INPUT < v.min) INPUT = v.min;
          if (INPUT > v.max) INPUT = v.max;
          this[v.target] = INPUT;
        }.bind(elem);
      }
      ////////////////////////////////////////////NO
      //map
      if (data.dataBehaviour == "map") {
        data.var.min_in = param[0];
        data.var.max_in = param[1];
        data.var.min_out = param[2];
        data.var.max_out = param[3];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          INPUT =
            v.min_out +
            (v.max_out - v.min_out) *
              ((INPUT - v.min_in) / (v.max_in - v.min_in));

          this[v.target] = INPUT;
        }.bind(elem);
      }
      //trigger
      if (data.dataBehaviour == "trigger") {
        data.var.init = chroma(elem[data.var.target]).hex();
        data.var.tresh = param[0];
        data.var.value = chroma(param[1]).hex();
        data.var.check = 0;
        if (param[2] == "<") data.var.check = 1;
        if (param[2] == ">") data.var.check = 2;
        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          var test = false;
          if (v.check == 0) if (INPUT == v.tresh) test = true;
          if (v.check == 1) if (INPUT < v.tresh) test = true;
          if (v.check == 2) if (INPUT > v.tresh) test = true;

          this[v.target] = test ? v.value : v.init;
        }.bind(elem);
      }
      //increment
      if (data.dataBehaviour == "increment") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.speed = param[0];
        data.var.type = param[1] ? param[1] : "h";
        if (data.var.type !== "h") data.var.speed /= 100;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          var c = chroma(this[v.target]);
          c = c.set("hsl." + v.type, c.get("hsl." + v.type) + v.speed * INPUT);

          this[v.target] = c.hex();
        }.bind(elem);
      }
      //bounce
      else if (data.dataBehaviour == "bounce") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = chroma(elem[data.var.target]);
        data.var.delta = 0;
        data.var.t = chroma(param[0]);
        data.var.speed = Math.abs(param[1]) / 100;
        data.var.state = true;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          if (v.state) v.delta += v.speed;
          else v.delta -= v.speed;
          if (v.delta > 1) v.state = false;
          else if (v.delta < 0) v.state = true;

          this[v.target] = chroma.mix(v.init, v.t, v.delta).hex();
        }.bind(elem);
      }
      //sin///////////////////////////////////////NO
      else if (data.dataBehaviour == "sin") {
        data.var.init = elem[data.var.target];
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          this[v.target] =
            v.init +
            Math.sin((runTimeInput.frames / 360) * Math.PI * v.speed) *
              v.amplitude;
        }.bind(elem);
      }
      ////////////////////////////////////////////NO
      //cos///////////////////////////////////////NO
      else if (data.dataBehaviour == "cos") {
        data.var.init = elem[data.var.target];
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          this[v.target] =
            v.init +
            Math.cos((runTimeInput.frames / 360) * Math.PI * v.speed) *
              v.amplitude;
        }.bind(elem);
      }
      ////////////////////////////////////////////NO
      //pulse
      else if (data.dataBehaviour == "pulse") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = chroma(elem[data.var.target]);
        data.var.delta = 0;
        data.var.final_color = chroma(param[0]);
        data.var.state = 0;
        data.var.counter = 0;
        data.var.state_t = [param[1], param[2], param[3], param[4]];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

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
          this[v.target] = chroma.mix(v.init, v.final_color, v.delta).hex();
        }.bind(elem);
      }
      ////Pulse trigger
      else if (data.dataBehaviour == "pulse_trigger") {
        data.var.init = chroma(elem[data.var.target]);
        data.var.delta = 0;
        data.var.last_result = false;
        data.var.last_input = data.var.init;
        data.var.final_color = chroma(param[0]);
        data.var.state = 0;
        data.var.counter = 0;
        data.var.going = false;
        data.var.state_t = [param[1], param[2], param[3]];
        data.var.tresh = param[4];
        if (param[5] == "!") data.var.check = 0;
        if (param[5] == "=") data.var.check = 1;
        if (param[5] == ">") data.var.check = 2;
        if (param[5] == "<") data.var.check = 3;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          if (!v.going) {
            var result = false;
            if (v.check == 0) if (INPUT == v.last_input) result = true;
            if (v.check == 1) if (INPUT == v.tresh) result = true;
            if (v.check == 2) if (INPUT > v.tresh) result = true;
            if (v.check == 3) if (INPUT < v.tresh) result = true;

            if (result && !v.last_result) v.going = true;
            v.last_result = result;
          }

          if (v.going) {
            v.counter++;
            if (v.counter >= v.state_t[v.state]) {
              v.state = (v.state + 1) % 3;
              v.counter = 0;

              if (v.state == 0) {
                v.going = false;
                return;
              }
            }

            if (v.state === 0) {
              v.delta = (v.counter + 1) / v.state_t[v.state];
            } else if (v.state === 2) {
              v.delta = 1 - (v.counter + 1) / v.state_t[v.state];
            }
          }

          this[v.target] = chroma.mix(v.init, v.final_color, v.delta).hex();
        }.bind(elem);
      }
      //random
      else if (data.dataBehaviour == "random") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.freq = param[2];
        data.var.count = param[2];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          v.count--;
          if (v.count <= 0) {
            v.count = v.freq;
            this[v.target] = Math.random() * (v.max - v.min) + v.min;
          }
        }.bind(elem);
      }
      //random_soft
      else if (data.dataBehaviour == "random_soft") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.ampli_min = param[0];
        data.var.ampli_max = param[1];
        data.var.speed = param[2];
        data.var.t = elem[data.var.target];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

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
    /////////////////////////////////////////////////////////////////////////////////TEXT
    /////////////////////////////////////////////////////////////////////////////////TEXT
    /////////////////////////////////////////////////////////////////////////////////TEXT
    /////////////////////////////////////////////////////////////////////////////////TEXT
    /////////////////////////////////////////////////////////////////////////////////TEXT
    /////////////////////////////////////////////////////////////////////////////////TEXT
    /////////////////////////////////////////////////////////////////////////////////TEXT
    if (data.valueType == "text") {
      //raw
      if (data.dataBehaviour == "raw") {
        data.var.scale = param[0] ? param[0] : 1;
        data.var.offset = param[1] ? param[1] : 0;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          if (typeof INPUT == "number") INPUT = format(INPUT);
          this[v.target] = INPUT * v.scale + v.offset + "";
        }.bind(elem);
      }
      //clamp
      if (data.dataBehaviour == "clamp") {
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.scale = param[2] ? param[2] : 1;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input] * v.scale;
          if (INPUT < v.min) INPUT = v.min;
          if (INPUT > v.max) INPUT = v.max;
          this[v.target] = format(INPUT) + "";
        }.bind(elem);
      }
      //map
      if (data.dataBehaviour == "map") {
        data.var.min_in = param[0];
        data.var.max_in = param[1];
        data.var.min_out = param[2];
        data.var.max_out = param[3];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          INPUT =
            v.min_out +
            (v.max_out - v.min_out) *
              ((INPUT - v.min_in) / (v.max_in - v.min_in));

          this[v.target] = INPUT.toFixed(2) + "";
        }.bind(elem);
      }
      //trigger
      if (data.dataBehaviour == "trigger") {
        data.var.init = elem[data.var.target] + "";
        data.var.tresh = param[0];
        data.var.value = param[1] + "";
        data.var.check = 0;
        if (param[2] == "<") data.var.check = 1;
        if (param[2] == ">") data.var.check = 2;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          var test = false;
          if (v.check == 0) if (INPUT == v.tresh) test = true;
          if (v.check == 1) if (INPUT < v.tresh) test = true;
          if (v.check == 2) if (INPUT > v.tresh) test = true;

          this[v.target] = (test ? v.value : v.init) + "";
        }.bind(elem);
      }
      //increment
      if (data.dataBehaviour == "increment") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.speed = param[0];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
          this[v.target] += INPUT * v.speed;
        }.bind(elem);
      }
      //bounce
      else if (data.dataBehaviour == "bounce") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = Math.abs(param[1]);
        data.var.state = true;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          if (v.state) v.delta += INPUT * v.speed;
          else v.delta -= v.speed;
          if (v.delta > v.amplitude / 2) v.state = false;
          else if (v.delta < -v.amplitude / 2) v.state = true;
          this[v.target] = format(v.init + v.delta);
        }.bind(elem);
      }
      //sin
      else if (data.dataBehaviour == "sin") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          this[v.target] = (
            v.init +
            (Math.sin((runTimeInput.frames / 360) * Math.PI * v.speed) *
              v.amplitude) /
              2
          ).toFixed(2);
        }.bind(elem);
      }
      //cos
      else if (data.dataBehaviour == "cos") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.speed = param[1];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          this[v.target] = (
            v.init +
            (Math.cos((runTimeInput.frames / 360) * Math.PI * v.speed) *
              v.amplitude) /
              2
          ).toFixed(2);
        }.bind(elem);
      }
      //pulse
      else if (data.dataBehaviour == "pulse") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.init = Number(elem[data.var.target]);
        data.var.delta = 0;
        data.var.amplitude = param[0];
        data.var.state = 0;
        data.var.counter = 0;
        data.var.state_t = [param[1], param[2], param[3], param[4]];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];
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

          this[v.target] = (v.init + v.delta).toFixed(2);
        }.bind(elem);
      }
      //random
      else if (data.dataBehaviour == "random") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.min = param[0];
        data.var.max = param[1];
        data.var.freq = param[2];
        data.var.count = param[2];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          v.count--;
          if (v.count <= 0) {
            v.count = v.freq;
            this[v.target] = format(Math.random() * (v.max - v.min) + v.min);
          }
        }.bind(elem);
      }
      //random_soft///////////////////////////////NO
      else if (data.dataBehaviour == "random_soft") {
        if (data.var.input == "frames") data.var.input = "neutral";
        data.var.ampli_min = param[0];
        data.var.ampli_max = param[1];
        data.var.speed = param[2];
        data.var.t = elem[data.var.target];

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          if (Math.abs(v.t - this[v.target]) <= v.speed)
            v.t =
              this[v.target] +
              (Math.random() * (v.ampli_max - v.ampli_min) + v.ampli_min) *
                (Math.random() < 0.5 ? -1 : 1);
          else if (v.t > this[v.target]) this[v.target] += v.speed;
          else if (v.t < this[v.target]) this[v.target] -= v.speed;
        }.bind(elem);
      }
      ////////////////////////////////////////////NO
    }
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX
    /////////////////////////////////////////////////////////////////////////////////CHECKBOX

    if (data.valueType == "checkbox") {
      //raw
      if (data.dataBehaviour == "raw") {
        data.var.scale = param[0] ? param[0] : 1;
        data.var.offset = param[1] ? param[1] : 0;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          this[v.target] = !!(INPUT * v.scale + v.offset);
        }.bind(elem);
      }

      //trigger
      if (data.dataBehaviour == "trigger") {
        data.var.init = Number(elem[data.var.target]);
        data.var.tresh = param[0];
        data.var.value = param[1];
        data.var.check = 0;
        if (param[2] == "<") data.var.check = 1;
        if (param[2] == ">") data.var.check = 2;

        data.method = function(v) {
          var INPUT = runTimeInput[v.input];

          var test = false;
          if (v.check == 0) if (INPUT == v.tresh) test = true;
          if (v.check == 1) if (INPUT < v.tresh) test = true;
          if (v.check == 2) if (INPUT > v.tresh) test = true;

          this[v.target] = test ? !v.value : !!v.value;
        }.bind(elem);
      }
    }
  }
}

function format(n) {
  var d = (n + "").split(".")[1];
  if (d && d.length > 5) return n.toFixed(5);
  return n;
}
