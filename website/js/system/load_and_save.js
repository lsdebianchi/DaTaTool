function clear_scene() {
  for (var i in scene_state.elements) {
    var el = scene_state.elements[i];
    if (el === undefined || el === null) continue;
    var p = paper_elements[el.paper_element_index];
    p.remove();
  }
  paper_elements = [];

  scene_state.settings.background.color = "#000000";
  scene_state.settings.background.imgPath = "";
  scene_state.settings.background.position = "center";
  scene_state.settings.background.size = "auto";
  scene_state.settings.background.repeat = "no-repeat";

  scene_state.elements = [];
  scene_state.hierarchy_order = [];
  scene_state.objects = {};

  propagate_settings();
}

function save_scene(name, runtime_save) {
  var save_name = name ? name : current_project.name;
  consolidate_lines_data();
  consolidate_hierarchy();
  var fileContent = JSON.stringify(scene_state);

  $.post(
    "http://localhost:3000/save_scene/",
    { scene: fileContent, scene_name: save_name },
    function(data, status) {
      if (!SCENE_RUNNING.active) $("#save_status").addClass("hide");
    }
  );
}
function load_scene(name) {
  var save_name = name ? name : current_project.name;
  $.get("http://localhost:3000/load_scene/" + save_name, function(data) {
    loading_scene_state = JSON.parse(data);

    generate_scene();
    deselect_all_elements();
    if (/^((?!_LOG).)*$/gi.test(name)) $("#save_status").addClass("hide");
  });
}

function generate_scene() {
  for (var i in loading_scene_state.saved_scenes_list) {
    LOAD_LOG.saved_scenes_list.push(loading_scene_state.saved_scenes_list[i]);
  }
  LOAD_LOG.index = 0;

  for (var i in scene_state.elements) {
    var el = scene_state.elements[i];
    if (el === undefined || el === null) continue;
    var p = paper_elements[el.paper_element_index];
    p.remove();
  }
  paper_elements = [];
  scene_state.play_setting = {
    sensor: loading_scene_state.play_setting.sensor
      ? loading_scene_state.play_setting.sensor
      : false
  };

  scene_state.settings.background.color =
    loading_scene_state.settings.background.color;
  scene_state.settings.background.imgPath =
    loading_scene_state.settings.background.imgPath;
  scene_state.settings.background.position =
    loading_scene_state.settings.background.position;
  scene_state.settings.background.size =
    loading_scene_state.settings.background.size;
  scene_state.settings.background.repeat =
    loading_scene_state.settings.background.repeat;

  scene_state.elements = [];
  scene_state.hierarchy_order = loading_scene_state.hierarchy_order;
  scene_state.objects = {};

  for (var i in loading_scene_state.elements) {
    var el = loading_scene_state.elements[i];
    if (el === undefined || el === null) continue;
    create_new_element(el.type, el.x, el.y, el);
  }

  for (var i in scene_state.hierarchy_order) {
    var elem = scene_state.elements[scene_state.hierarchy_order[i]];
    if (!elem) continue;
    var p_el = paper_elements[elem.paper_element_index];
    p_el.bringToFront();
  }
  propagate_settings();
}

function consolidate_lines_data() {
  for (var i in scene_state.elements) {
    var el = scene_state.elements[i];
    if (!el) continue;
    if (el.type != "line" && el.type != "curve") continue;

    var p_el = paper_elements[el.paper_element_index];
    el.lineData = [];
    for (var j = 0; j < p_el.segments.length; j++) {
      var pos = p_el.segments[j].point;

      el.lineData.push([pos.x, pos.y]);
    }
  }
}
function consolidate_hierarchy() {
  var hierarchy_order = [];
  var al = paper.projects[0].activeLayer;
  if (!al) return;
  for (var i in al.children) {
    var p_el = al.children[i];
    hierarchy_order.push(p_el._element.original_element_index);
  }
  scene_state.hierarchy_order = hierarchy_order;
}
