function clear_scene() {
  for (let i in scene_state.elements) {
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

  $("#save_status").removeClass("hide");
  propagate_settings();
}

function save_scene(name, runtime_save) {
  var save_name = name ? name : current_project.name;
  consolidate_lines_data();
  //consolidate_hierarchy();
  //consolidate_group_children_coordinates();

  var fileContent = JSON.stringify(scene_state);
  fileContent = JSON.parse(fileContent);

  clear_unused_data_parameters(fileContent);

  fileContent = JSON.stringify(fileContent);

  $.post(
    "http://localhost:3000/save_scene/",
    { scene: fileContent, scene_name: save_name },
    function(data, status) {
      if (!G.SCENE_RUNNING.active) $("#save_status").addClass("hide");
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
  for (let i in loading_scene_state.saved_scenes_list) {
    G.LOAD_LOG.saved_scenes_list.push(loading_scene_state.saved_scenes_list[i]);
  }
  G.LOAD_LOG.index = 0;

  for (let i in scene_state.elements) {
    let el = scene_state.elements[i];
    if (el === undefined || el === null) continue;
    let p = paper_elements[el.paper_element_index];
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

  var grouping_list = [];

  console.log(loading_scene_state.elements);
  for (let i in loading_scene_state.elements) {
    let el = loading_scene_state.elements[i];
    if (typeof el === typeof undefined || el === null) {
      console.log("null!");
      scene_state.elements.push(null);
      continue;
    }
    if (el.type !== "group") create_new_element(el.type, el.x, el.y, el);
    else {
      console.log(el.group_children_index);
      create_group(el.group_children_index, el);
    }
  }

  // for (let i in grouping_list) {
  //   let gl = grouping_list[i];
  //   console.log(gl.group_children_index);
  //   var group = create_group(gl.group_children_index, gl);
  //   // for (let j in gl.group_children_index) {
  //   //   var child = scene_state.elements[gl.group_children_index[j]];
  //   //   console.log(child.type + ": ");
  //   //   console.log(child.x + " | " + child.y);
  //   // }
  // }

  for (let i in scene_state.hierarchy_order) {
    var elem = scene_state.elements[scene_state.hierarchy_order[i]];
    if (!elem) continue;
    var p_el = paper_elements[elem.paper_element_index];
    p_el.bringToFront();
  }

  //REBUILD group children index
  // for (let i in scene_state.elements) {
  //   let elem = scene_state.elements[i];
  //   if (elem && elem.type == "group") {
  //     let p_group = paper_elements[elem.paper_element_index];
  //     let elem_children_index = [];
  //     for (let j in p_group.children) {
  //       let child = p_group.children[j];
  //       child._element.group_parent_index = elem.original_element_index;
  //       elem_children_index.push(child._element.paper_element_index);
  //     }
  //     elem.group_children_index = elem_children_index.slice();
  //   }
  // }
  propagate_settings();
}

function consolidate_lines_data() {
  for (let i in scene_state.elements) {
    var el = scene_state.elements[i];
    if (!el) continue;
    if (el.type != "line" && el.type != "curve") continue;

    var p_el = paper_elements[el.paper_element_index];
    el.lineData = [];
    for (let j = 0; j < p_el.segments.length; j++) {
      var pos = p_el.segments[j].point;

      el.lineData.push([pos.x, pos.y]);
    }
  }
}
function consolidate_hierarchy() {
  var hierarchy_order = [];
  var al = paper.projects[0].activeLayer;
  if (!al) return;
  for (let i in al.children) {
    var p_el = al.children[i];
    hierarchy_order.push(p_el._element.original_element_index);
  }
  scene_state.hierarchy_order = hierarchy_order;
}
function clear_unused_data_parameters(fileContent) {
  for (let i in fileContent.elements) {
    let elem = fileContent.elements[i];
    if (!elem) continue;
    for (let j in attr_list) {
      if (elem["data_" + attr_list[j]].expression === "") {
        elem["data_" + attr_list[j]] = undefined;
      }
    }
  }
}
function consolidate_group_children_coordinates() {
  for (let i in scene_state.elements) {
    var elem = scene_state.elements[i];
    if (!elem) continue;
    var parent = scene_state.elements[elem.group_parent_index];
    if (parent) {
      var p_el = paper_elements[elem.paper_element_index];
      var parent_p_el = paper_elements[parent.paper_element_index];

      var newPoint = p_el.position;
      // var newPoint = p_el.localToGlobal(p_el.position);

      elem.x = newPoint.x;
      elem.y = newPoint.y;
    }
  }
}
