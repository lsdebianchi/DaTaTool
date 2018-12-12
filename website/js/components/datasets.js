var Datasets = function() {
  this.mo = [
    {
      name: "sunny",
      prob: 50,
      temp_v: [-5, 27],
      press_v: [1014, 1030],
      humid_v: [10, 40],
      precip_v: [0, 0],
      precip_f: [40, 300],
      clouds_v: [0, 6],
      wind_v: [2, 16]
    },
    {
      name: "mainly sunny",
      prob: 50,
      temp_v: [-5, 23],
      press_v: [1012, 1028],
      humid_v: [30, 60],
      precip_v: [0, 0],
      precip_f: [30, 300],
      clouds_v: [8, 15],
      wind_v: [2, 16]
    },
    {
      name: "partially cloudy",
      prob: 20,
      temp_v: [-2, 20],
      press_v: [1008, 1020],
      humid_v: [50, 70],
      precip_v: [0, 0],
      precip_f: [20, 200],
      clouds_v: [15, 50],
      wind_v: [2, 14]
    },
    {
      name: "overcast",
      prob: 20,
      temp_v: [-2, 20],
      press_v: [980, 1000],
      humid_v: [80, 90],
      precip_v: [0, 0],
      precip_f: [5, 30],
      clouds_v: [95, 100],
      wind_v: [0, 16]
    },
    {
      name: "cloudy",
      prob: 20,
      temp_v: [-2, 20],
      press_v: [990, 1005],
      humid_v: [60, 80],
      precip_v: [0, 0],
      precip_f: [5, 80],
      clouds_v: [70, 90],
      wind_v: [0, 16]
    },
    {
      name: "mainly cloudy",
      prob: 20,
      temp_v: [-2, 20],
      press_v: [995, 1008],
      humid_v: [60, 70],
      precip_v: [0, 0],
      precip_f: [10, 100],
      clouds_v: [50, 70],
      wind_v: [0, 16]
    },
    {
      name: "fog",
      prob: 10,
      temp_v: [0, 15],
      press_v: [1000, 1005],
      humid_v: [80, 95],
      precip_v: [0, 0],
      precip_f: [10, 100],
      clouds_v: [100, 100],
      wind_v: [0, 2]
    },
    {
      name: "light rain",
      prob: 10,
      temp_v: [3, 15],
      press_v: [980, 1000],
      humid_v: [98, 100],
      precip_v: [1, 3],
      precip_f: [0, 0],
      clouds_v: [95, 100],
      wind_v: [0, 16]
    },
    {
      name: "rainy",
      prob: 10,
      temp_v: [3, 15],
      press_v: [980, 995],
      humid_v: [100, 100],
      precip_v: [3, 8],
      precip_f: [0, 0],
      clouds_v: [100, 100],
      wind_v: [0, 16]
    },
    {
      name: "heavy rain",
      prob: 5,
      temp_v: [5, 15],
      press_v: [980, 995],
      humid_v: [100, 100],
      precip_v: [8, 35],
      precip_f: [0, 0],
      clouds_v: [100, 100],
      wind_v: [0, 16]
    },
    {
      name: "storm",
      prob: 5,
      temp_v: [12, 23],
      press_v: [970, 985],
      humid_v: [100, 100],
      precip_v: [50, 60],
      precip_f: [0, 0],
      clouds_v: [100, 100],
      wind_v: [5, 20]
    },
    {
      name: "heavy storm",
      prob: 5,
      temp_v: [12, 23],
      press_v: [965, 975],
      humid_v: [100, 100],
      precip_v: [60, 100],
      precip_f: [0, 0],
      clouds_v: [100, 100],
      wind_v: [10, 25]
    },
    {
      name: "snow",
      prob: 5,
      temp_v: [-15, 1],
      press_v: [980, 1000],
      humid_v: [98, 100],
      precip_v: [3, 8],
      precip_f: [0, 0],
      clouds_v: [100, 100],
      wind_v: [0, 15]
    },
    {
      name: "heavy snow",
      prob: 5,
      temp_v: [-10, 0],
      press_v: [980, 1000],
      humid_v: [100, 100],
      precip_v: [20, 40],
      precip_f: [0, 0],
      clouds_v: [100, 100],
      wind_v: [0, 15]
    }
  ];

  this.ms = undefined;
  this.meteo_decription = undefined;
  this.meteo_index = undefined;
  this.temperature = undefined;

  this.pressure = undefined;
  this.humidity = undefined;

  this.precipitation_kind = undefined;
  this.snow_centimeter = undefined;
  this.precipitation = undefined;
  this.precipitation_forecast = undefined;
  this.clouds_coverage = undefined;
  this.wind_speed = undefined;
  this.wind_direction = undefined;
  this.wind_timer = 10 * 60;

  var hours = new Date().getHours();
  var sunrise = 8;
  var sunset = 17;
  var sun_delta = sunset - sunrise;
  var sun_height;
  if (hours < sunrise) sun_height = 0;
  else if (hours > sunset) sun_height = 0;
  else if (hours < sunrise + sun_delta / 2)
    sun_height = ((hours - sunrise) / (sun_delta / 2)) * 100;
  else if (hours >= sunrise + sun_delta / 2)
    sun_height =
      100 - ((hours - sunrise - sun_delta / 2) / (sun_delta / 2)) * 100;

  this.sunrise = sunrise;
  this.sunset = sunset;
  this.sun_height = sun_height.toFixed(2);

  this.moon_phase = 16;
  this.moon_phase_description = "waxing crescent";

  this.quake_count = 0;
  this.last_quake_intensity = 0;
  this.quake_t_v = [25, 45];
  this.quake_i_v = [3, 5];
  this.next_quake = variation(this.quake_t_v) * 60;

  this.wave_height = variation_f([2, 7]);
  this.wave_frequency = variation([12, 20]);

  this.current_consumption = 0;
  this.daily_consumption = 0;
  this.current_country_average = 0;

  this.run_today = 0;
  this.average_daily_run = 0;
  this.run_this_week = 0;
  this.average_weekly_run = 0;
};

Datasets.prototype = {
  new_meteo: function() {
    var s;
    this.ms = s = rnd_elem_pndered(this.mo);
    this.meteo_decription = this.mo[s].name;
    this.meteo_index = s;
    this.temperature = variation(this.mo[s].temp_v);
    this.pressure = variation(this.mo[s].press_v);
    this.humidity = variation(this.mo[s].humid_v);
    var name = this.mo[s].name;

    if (name == "snow" || name == "heavy snow")
      this.precipitation_kind = "snow";
    else if (
      name == "light rain" ||
      name == "rainy" ||
      name == "heavy rain" ||
      name == "storm" ||
      name == "heavy storm"
    )
      this.precipitation_kind = "rain";
    else this.precipitation_kind = " ";
    this.snow_centimeter =
      this.precipitation_kind == "snow" ? variation(this.mo[s].precip_v) : 0;
    this.precipitation =
      this.precipitation_kind != "snow" ? variation(this.mo[s].precip_v) : 0;

    this.precipitation_forecast = variation(this.mo[s].precip_f);
    this.clouds_coverage = variation(this.mo[s].clouds_v);
    this.wind_speed = variation_f(this.mo[s].wind_v, 1);
    this.wind_direction = Math.floor(Math.random() * 360);

    this.wave_height = variation_f([2, 7]);
    this.wave_frequency = variation([12, 20]);

    this.return_all_value();
  },

  tick: function() {
    //quakes
    if (this.next_quake == 0) {
      this.quake_count++;
      this.next_quake = variation(this.quake_t_v) * 60;
      this.last_quake_intensity = variation_f(this.quake_i_v, 1);

      runTimeInput.quake_count = this.quake_count;
      runTimeInput.last_quake_intensity = this.last_quake_intensity;
    } else this.next_quake--;

    if (this.wind_timer == 0) {
      this.wind_timer = 10 * 60;
      this.wind_speed =
        Number(this.wind_speed) + Number((Math.random() * 0.5).toFixed(1));
      this.wind_direction += Math.floor(Math.random() * 3);

      runTimeInput.wind_speed = this.wind_speed;
      runTimeInput.wind_direction = this.wind_direction;
    } else this.wind_timer--;
  },

  return_all_value: function() {
    var prop = [
      "meteo_decription",
      "meteo_index",
      "temperature",
      "pressure",
      "humidity",
      "precipitation",
      "precipitation_kind",
      "snow_centimeter",
      "precipitation_forecast",
      "clouds_coverage",
      "wind_speed",
      "wind_direction",
      "sunrise",
      "sunset",
      "sun_height",
      "moon_phase",
      "moon_phase_description",
      "quake_count",
      "last_quake_intensity",
      "wave_height",
      "wave_frequency"
    ];
    for (let i in prop) {
      runTimeInput[prop[i]] = this[prop[i]];
    }
  }
};

function rnd_elem_pndered(array) {
  var total = 0;
  for (let i in array) {
    total += array[i].prob;
  }
  var choice = Math.floor(Math.random() * total);

  for (var i in array) {
    choice -= array[i].prob;
    if (choice <= 0) return i;
  }
  return i;
}
function variation_f(op, f) {
  return (Math.random() * (op[1] - op[0]) + op[0]).toFixed(f ? f : 2);
}
function variation(op) {
  return Math.floor(Math.random() * (op[1] - op[0])) + op[0];
}
