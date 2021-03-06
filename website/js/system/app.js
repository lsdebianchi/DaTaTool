window.onload = function() {
  RESPONSIVE_RELOAD.active = document.cookie === "true" ? true : false;
  console.log(document.cookie);
  paper.setup(document.getElementById("paper_canvas"));
  paper_tool = new paper.Tool();
  load_paper_handlers();
  load_scene("test_scene");
  first_load = false;
  tracker = new Distance_tracker();
  datas = new Datasets();
  datas.new_meteo();
};

window.onerror = function(msg, url, linenumber) {
  var t1 = "An error occurred. You might need to reload the page";
  var t2 =
    "\nError message: " +
    msg +
    "\nURL: " +
    url +
    "\nLine Number: " +
    linenumber;
  alert(t1 + t2);
  return true;
};
function propagate_settings() {
  $("canvas").css("background-color", scene_state.settings.background.color);
  $("canvas").css(
    "background-position",
    scene_state.settings.background.position
  );
  $("canvas").css("background-size", scene_state.settings.background.size);
  $("canvas").css("background-repeat", scene_state.settings.background.repeat);
  $("canvas").css(
    "background-image",
    "url(" + scene_state.settings.background.imgPath + ")"
  );
}

function run_scene(preventListUpdate) {
  deselect_all_elements();
  if (scene_state.play_setting.sensor) {
    $("#distance_meter").addClass("active");
    tracker.start();
  }
  G.SCENE_RUNNING.active = true;
  G.SCENE_RUNNING.warning = false;

  save_scene(current_project.name + "_LOG");

  for (let i in scene_state.elements) {
    if (scene_state.elements[i]) assign_methods(scene_state.elements[i]);
  }

  /////START dataSets
  datas.return_all_value();
  dataSets.time = new Date().getTime();

  paper.view.onFrame = function(event) {
    for (let i in scene_state.elements) {
      if (!scene_state.elements[i]) continue;
      for (let j in attr_list) {
        var elem = scene_state.elements[i];
        var d = scene_state.elements[i]["data_" + attr_list[j]];

        if (typeof d.method !== typeof undefined) d.method(d.var);
      }
      if (scene_state.elements[i].edgeLoop)
        applyEdgeLoop(scene_state.elements[i]);
      core_propagation(
        scene_state.elements[i],
        scene_state.elements[i]._paper_elem
      );
    }

    //// tick datasets
    datas.tick();
    var delta_time = new Date().getTime() - dataSets.time;
    runTimeInput.hours = Math.floor(
      (delta_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    runTimeInput.minutes = Math.floor(
      (delta_time % (1000 * 60 * 60)) / (1000 * 60)
    );
    runTimeInput.seconds = Math.floor((delta_time % (1000 * 60)) / 1000);
    runTimeInput.current_seconds = new Date().getSeconds();
    runTimeInput.current_minutes = new Date().getMinutes();
    runTimeInput.current_hours = new Date().getHours();
    runTimeInput.frames++;
    runTimeInput.distance = tracker.value;

    runTimeInput.detection = tracker.detected;
    runTimeInput.detection_count +=
      tracker.detected && !tracker.was_detected ? 1 : 0;
    //////////
  };
}

function stop_scene(preventListUpdate) {
  if (scene_state.play_setting.sensor) tracker.stop();
  $("#distance_meter").removeClass("active");
  G.SCENE_RUNNING.active = false;

  runTimeInput = {
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
    wave_height: 0,
    wave_frequency: 0
    // current_consumption: 0,
    // daily_consumption: 0,
    // current_country_average: 0,
    // run_today: 0,
    // average_daily_run: 0,
    // run_this_week: 0,
    // average_weekly_run: 0
  };

  load_scene(current_project.name + "_LOG", preventListUpdate);
  paper.view.onFrame = function(event) {};
}
