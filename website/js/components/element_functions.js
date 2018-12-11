function getValues(obj1, obj2) {
  obj1.type = obj2.type;

  obj1.selected = obj2.selected;
  obj1.visible = obj2.visible;

  obj1.paper_element_index = obj2.paper_element_index;
  obj1.original_element_index = obj2.original_element_index;

  obj1.layerOrder = obj2.layerOrder;
  //
  obj1.x = obj2.x;
  obj1.y = obj2.y;

  obj1.w = obj2.w;
  obj1.h = obj2.h;
  obj1.ratio = obj2.ratio;
  obj1.lockRatio = obj2.lockRatio;

  obj1.r = obj2.r;
  obj1.edgeLoop = obj2.edgeLoop;
  //
  obj1.blendMode = obj2.blendMode;

  obj1.closedLine = obj2.closedLine;
  obj1.fillLine = obj2.fillLine;
  obj1.fillColor = obj2.fillColor;
  obj1.strokeColor = obj2.strokeColor;
  obj1.opacity = obj2.opacity;
  obj1.strokeWidth = obj2.strokeWidth;
  //
  obj1.fontFamily = obj2.fontFamily;
  obj1.textContent = obj2.textContent;
  //
  obj1.hasDimension = obj2.hasDimension;
  obj1.hasFill = obj2.hasFill;
  obj1.hasStroke = obj2.hasStroke;
  obj1.hasText = obj2.hasText;
  obj1.hasImg = obj2.hasImg;
  obj1.hasOpacity = obj2.hasOpacity;

  obj1.sourceFile = obj2.sourceFile;

  obj1.isGroup = obj2.isGroup;
  obj1.group_parent_index = obj2.group_parent_index;
  obj1.group_children_index = obj2.group_children_index;

  obj1.data_x = obj2.data_x;
  obj1.data_y = obj2.data_y;
  obj1.data_w = obj2.data_w;
  obj1.data_h = obj2.data_h;
  obj1.data_r = obj2.data_r;
  obj1.data_fillColor = obj2.data_fillColor;
  obj1.data_strokeColor = obj2.data_strokeColor;
  obj1.data_visible = obj2.data_visible;
  obj1.data_opacity = obj2.data_opacity;
  obj1.data_strokeWidth = obj2.data_strokeWidth;
  obj1.data_textContent = obj2.data_textContent;
  obj1.data_lockRatio = obj2.data_lockRatio;
  obj1.data_sendTop = obj2.data_sendTop;
  obj1.data_sendBottom = obj2.data_sendBottom;
}
function create_new_element(_type, x, y, copy, duplication) {
  var elem;
  if (!copy) {
    elem = new Element({
      type: _type,
      x: x,
      y: y
    });
  } else {
    if (copy.type == "curve" || copy.type == "line")
      consolidate_lines_data(copy);
    elem = new Element(copy);
    if (duplication) {
      elem.x = Number(elem.x) + Number(G.INCREMENTALS.x);
      elem.y = Number(elem.y) + Number(G.INCREMENTALS.y);
      elem.w = Number(elem.w) + Number(G.INCREMENTALS.w);
      elem.h = Number(elem.h) + Number(G.INCREMENTALS.h);
      elem.r = Number(elem.r) + Number(G.INCREMENTALS.r);
      elem.opacity = Number(elem.opacity) + Number(G.INCREMENTALS.opacity);
      elem.strokeWidth =
        Number(elem.strokeWidth) + Number(G.INCREMENTALS.width);
      var col = chroma(elem.fillColor);
      col = col.set("hsl.h", col.get("hsl.h") + Number(G.INCREMENTALS.hue));
      col = col.set(
        "hsl.s",
        col.get("hsl.s") + Number(G.INCREMENTALS.saturation)
      );
      col = col.set(
        "hsl.l",
        col.get("hsl.l") + Number(G.INCREMENTALS.lightness)
      );

      elem.fillColor = col.hex();
    }
  }
  elem.original_element_index = allocate_new_element_in_list(elem);
  select_element(elem);
  propagate_modifications();
  return elem;
}
function get_current_paper_el() {
  return paper_elements[current_element.paper_element_index];
}
function select_element(el) {
  getValues(current_element, scene_state.elements[el.original_element_index]);
  get_current_paper_el()._permanent_selected = true;
  get_current_paper_el().selected = true;
}
function deselect_element(pe) {
  var p_el = pe ? pe : get_current_paper_el();
  if (p_el) {
    p_el._permanent_selected = false;
    p_el.selected = false;
  }
  getValues(current_element, new Element({}));
}
function duplicate_element(_el) {
  var el = new Element({});
  getValues(el, current_element);

  var new_el;
  if (el.type == "group") {
    var new_children = [];

    var old_el_to_copy = [];
    for (let i in el.group_children_index) {
      old_el_to_copy.push(scene_state.elements[el.group_children_index[i]]);
    }
    for (let i in old_el_to_copy) {
      new_children.push(
        create_new_element(
          old_el_to_copy[i].type,
          old_el_to_copy[i].x,
          old_el_to_copy[i].y,
          old_el_to_copy[i],
          true
        ).original_element_index
      );
    }
    new_el = create_group(new_children, el);
  } else {
    el = _el;
    var old_pel = paper_elements[el.paper_element_index];
    new_el = create_new_element(el.type, el.x, el.y, el, true);

    old_pel._permanent_selected = false;
    old_pel.selected = false;
  }

  return new_el;
}
function delete_element(p_el) {
  var el = p_el._element;

  //Get parent group if only child
  if (el.group_parent_index) {
    let parent = scene_state.elements[el.group_parent_index];
    if (parent && parent.group_children_index.length == 1) {
      p_el = paper_elements[parent.paper_element_index];
      el = parent;
    }
  }

  p_el.remove();

  //remove itself from parent list
  let parent = scene_state.elements[el.group_parent_index];
  if (parent) {
    let index = parent.group_children_index.indexOf(
      p_el._element.original_element_index
    );
    parent.group_children_index.splice(index, 1);
  }
  paper_elements[el.paper_element_index] = undefined;
  scene_state.elements[el.original_element_index] = undefined;
  if (el.isGroup) {
    for (let i in el.group_children_index) {
      var child = scene_state.elements[el.group_children_index[i]];
      var p_child = paper_elements[child.paper_element_index];
      delete_element(p_child);
    }
  }
  getValues(current_element, new Element({}));
}
function create_group(children, copy) {
  var elem;
  if (copy) {
    elem = new Element(copy, children);
  } else {
    elem = new Element(
      {
        type: "group"
      },
      children
    );
  }

  elem.original_element_index = allocate_new_element_in_list(elem);
  for (var i in elem.group_children_index) {
    var child = scene_state.elements[elem.group_children_index[i]];
    child.group_parent_index = elem.original_element_index;
  }
  select_element(elem);
  propagate_modifications();
  return elem;
}
function get_parent_group() {
  var p =
    paper_elements[
      scene_state.elements[current_element.group_parent_index]
        .paper_element_index
    ];
  p._permanent_selected = true;
  p.selected = true;
  getValues(current_element, p._element);
}
function paste_expression(elem) {
  G.DROP_EXPRESSION.active = false;
  elem["data_" + G.DROP_EXPRESSION.type].dataBehaviour =
    current_expression.dataBehaviour;
  elem["data_" + G.DROP_EXPRESSION.type].dataSource =
    current_expression.dataSource;
  elem["data_" + G.DROP_EXPRESSION.type].dataType = current_expression.dataType;
  elem["data_" + G.DROP_EXPRESSION.type].expression =
    current_expression.expression;
  elem["data_" + G.DROP_EXPRESSION.type].valueType =
    current_expression.valueType;

  G.DROP_OBJECT.active = false;
  $("#drop_icon").toggleClass("hide");
}
function propagate_modifications(prevent) {
  if (!prevent) $("#save_status").removeClass("hide");

  var base_el = scene_state.elements[current_element.original_element_index];
  if (base_el) {
    getValues(base_el, current_element);
  } else {
  }
  var p_el = get_current_paper_el();
  var c_el = current_element;

  core_propagation(c_el, p_el);

  G._LAST_FILLCOLOR = c_el.fillColor;
  G._LAST_STROKECOLOR = c_el.strokeColor;
  G._LAST_STROKE_WIDTH = c_el.strokeWidth;
}
function core_propagation(c_el, p_el) {
  if (c_el.type) {
    if (c_el.w == undefined || c_el.w == 0) c_el.w = 1;
    if (c_el.h == undefined || c_el.h == 0) c_el.h = 1;
    if (c_el.w > 5000) c_el.w = 5000;
    if (c_el.h > 5000) c_el.h = 5000;
    if (c_el.w < 0) c_el.w = Math.abs(c_el.w);
    if (c_el.h < 0) c_el.h = Math.abs(c_el.h);
    c_el.r %= 360;
    if (c_el.opacity > 100) c_el.opacity = 100;
    if (c_el.opacity < 0) c_el.opacity = 0;
  }

  c_el.opacity = Number(c_el.opacity);

  if (p_el) {
    p_el.position.x = c_el.x;
    p_el.position.y = c_el.y;
    if (c_el.lockRatio) {
      paperResize(p_el, Number(c_el.w), Number(c_el.w) * c_el.ratio);
      c_el.h = (Number(c_el.w) * c_el.ratio).toFixed(5);
    } else {
      paperResize(p_el, Number(c_el.w), Number(c_el.h));
      c_el.ratio = Number(c_el.h) / Number(c_el.w);
    }
    paperRotate(p_el, Number(c_el.r));

    if (!c_el.isGroup) {
      p_el.blendMode = c_el.blendMode;
      if ((c_el.type != "line" && c_el.type != "curve") || c_el.fillLine)
        p_el.fillColor = c_el.fillColor;
      p_el.strokeColor = c_el.strokeColor;
      p_el.strokeWidth = c_el.strokeWidth;
      p_el.content = c_el.textContent;
      p_el.fontFamily = c_el.fontFamily;
    }
    p_el.opacity = c_el.opacity / 100;
    p_el.visible = c_el.visible;

    if (c_el.isGroup) {
      for (let i in p_el.children) {
        reverse_dimension_propagation(p_el.children[i]);
      }
    } else if (typeof c_el.group_parent_index !== typeof undefined) {
      reverse_dimension_propagation(
        paper_elements[
          scene_state.elements[c_el.group_parent_index].paper_element_index
        ]
      );
    }
  }
}
function reverse_dimension_propagation(p_el) {
  el = p_el._element;
  el.x = p_el.position.x;
  el.y = p_el.position.y;
}
function paperResize(p, w, h) {
  p.scale(1 / p._last_resize_w, 1 / p._last_resize_h);
  p.scale(w, h);
  p._last_resize_w = w;
  p._last_resize_h = h;
}
function paperRotate(p, r) {
  p.rotate(-p._last_rotation, p.bounds.center);
  p.rotate(r, p.bounds.center);
  p._last_rotation = r;
}
function reload_current_img() {
  var p = get_current_paper_el();
  if (p) {
    p.source = current_element.sourceFile;
  }
  propagate_modifications();
}
function allocate_new_element_in_list(elem) {
  //var found_empty_spot = false;
  for (let i in scene_state.elements) {
    if (scene_state.elements[i] === undefined) {
      scene_state.elements[i] = elem;
      return i;
    }
  }
  scene_state.elements.push(elem);
  return scene_state.elements.length - 1;
}
function find_free_index_in_element_list(elem) {
  //var found_empty_spot = false;
  for (let i in scene_state.elements) {
    if (scene_state.elements[i] === undefined) {
      return i;
    }
  }
  return scene_state.elements.length - 1;
}
function allocate_new_paper_in_list(pap) {
  //var found_empty_spot = false;
  for (let i in paper_elements) {
    if (paper_elements[i] === undefined) {
      paper_elements[i] = pap;
      return i;
    }
  }
  paper_elements.push(pap);
  return paper_elements.length - 1;
}
function find_free_index_in_paper_list(pap) {
  //var found_empty_spot = false;
  for (let i in paper_elements) {
    if (paper_elements[i] === undefined) {
      return i;
    }
  }
  return paper_elements.length - 1;
}
function propagate_current_expression() {
  current_element[current_expression.type].dataBehaviour =
    current_expression.dataBehaviour;
  current_element[current_expression.type].dataSource =
    current_expression.dataSource;
  current_element[current_expression.type].dataType =
    current_expression.dataType;
  current_element[current_expression.type].expression =
    current_expression.expression;
  current_element[current_expression.type].valueType =
    current_expression.valueType;
}
function deselect_all_elements() {
  for (let i in scene_state.elements) {
    var elem = scene_state.elements[i];
    if (!elem) continue;
    deselect_element(paper_elements[elem.paper_element_index]);
  }
}
function applyEdgeLoop(e) {
  var ew = e._paper_elem.bounds.width;
  var eh = e._paper_elem.bounds.height;
  var pw = paper.view.bounds.width;
  var ph = paper.view.bounds.height;
  if (e.x > pw + ew) e.x = -ew;
  if (e.x < 0 - ew) e.x = pw + ew;
  if (e.y > ph + eh) e.y = -eh;
  if (e.y < 0 - eh) e.y = ph + eh;
}
