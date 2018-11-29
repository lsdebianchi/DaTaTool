window.onload = function() {
  paper.setup(document.getElementById("paper_canvas"));
  paper_tool = new paper.Tool();
  load_paper_handlers();
  load_scene("test_scene");
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

function run_scene() {
  SCENE_RUNNING.active = true;
  SCENE_RUNNING.warning = false;

  save_scene(current_project.name + "_LOG");

  for (var i in scene_state.elements) {
    if (scene_state.elements[i]) assign_methods(scene_state.elements[i]);
  }

  paper.view.onFrame = function(event) {
    for (var i in scene_state.elements) {
      for (var j in attr_list) {
        var elem = scene_state.elements[i];
        if (!elem) continue;
        var d = scene_state.elements[i]["data_" + attr_list[j]];
        if (d.method) d.method(d.var);
      }
      if (scene_state.elements[i].edgeLoop)
        applyEdgeLoop(scene_state.elements[i]);
      core_propagation(
        scene_state.elements[i],
        scene_state.elements[i]._paper_elem
      );
    }
    runTime.frames++;
  };
}

function stop_scene() {
  SCENE_RUNNING.active = false;

  runTime = {
    frames: 0
  };
  load_scene(current_project.name + "_LOG");
  paper.view.onFrame = function(event) {};
}
