function save_scene(name) {
  var save_name = name ? name : current_project.name;
  consolidate_lines_data();
  consolidate_hierarcy();
  var fileContent = JSON.stringify(scene_state);

  $.post(
    "http://localhost:3000/save_scene/",
    { scene: fileContent, scene_name: save_name },
    function(data, status) {
      $("#save_status").addClass("hide");
    }
  );
}
function load_scene(name) {
  var save_name = name ? name : current_project.name;
  $.get("http://localhost:3000/load_scene/" + save_name, function(data) {
    loading_scene_state = JSON.parse(data);

    generate_scene();
    $("#save_status").addClass("hide");
    deselect_all_elements();
  });
}

function generate_scene() {
  for (var i in scene_state.elements) {
    var el = scene_state.elements[i];
    if (el === undefined || el === null) continue;
    var p = paper_elements[el.paper_element_index];
    p.remove();
  }
  paper_elements = [];
  scene_state.play_setting = {
    time: true,
    physics: true,
    sensor: true,
    data: true,
    event: true
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
  scene_state.hierarcy_order = loading_scene_state.hierarcy_order;
  scene_state.objects = {};

  for (var i in loading_scene_state.elements) {
    var el = loading_scene_state.elements[i];
    if (el === undefined || el === null) continue;
    create_new_element(el.type, el.x, el.y, el);
  }

  for (var i in scene_state.hierarcy_order) {
    var elem = scene_state.elements[scene_state.hierarcy_order[i]];
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
function consolidate_hierarcy() {
  var hierarcy_order = [];
  var al = paper.projects[0].activeLayer;
  if (!al) return;
  for (var i in al.children) {
    var p_el = al.children[i];
    hierarcy_order.push(p_el._element.original_element_index);
  }
  scene_state.hierarcy_order = hierarcy_order;
}
