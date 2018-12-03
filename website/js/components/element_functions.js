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

function create_new_element(_type, x, y, copy, dx, dy) {
  var elem;
  if (!copy) {
    elem = new Element({
      type: _type,
      x: x,
      y: y
    });
  } else {
    elem = new Element(copy);
    elem.x += dx ? dx : 0;
    elem.y += dy ? dy : 0;
  }
  elem.original_element_index = allocate_new_element_in_list(elem);
  select_element(elem);
  propagate_modifications();
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
function delete_element(p_el) {
  var el = p_el._element;
  p_el.remove();
  paper_elements[el.paper_element_index] = undefined;
  scene_state.elements[el.original_element_index] = undefined;
  getValues(current_element, new Element({}));
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

  _LAST_FILLCOLOR = c_el.fillColor;
  _LAST_STROKECOLOR = c_el.strokeColor;
  _LAST_STROKE_WIDTH = c_el.strokeWidth;
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

    p_el.blendMode = c_el.blendMode;
    if (c_el.type != "line" && c_el.type != "curve")
      p_el.fillColor = c_el.fillColor;
    p_el.strokeColor = c_el.strokeColor;
    p_el.strokeWidth = c_el.strokeWidth;
    p_el.content = c_el.textContent;
    p_el.fontFamily = c_el.fontFamily;
    p_el.opacity = c_el.opacity / 100;
    p_el.visible = c_el.visible;
  }
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
  for (var i in scene_state.elements) {
    if (scene_state.elements[i] === undefined) {
      scene_state.elements[i] = elem;
      return i;
    }
  }
  scene_state.elements.push(elem);
  return scene_state.elements.length - 1;
}
function allocate_new_paper_in_list(pap) {
  //var found_empty_spot = false;
  for (var i in paper_elements) {
    if (paper_elements[i] === undefined) {
      paper_elements[i] = pap;
      return i;
    }
  }
  paper_elements.push(pap);
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
  current_element[current_expression.type].inputType =
    current_expression.inputType;
}

function deselect_all_elements() {
  for (var i in scene_state.elements) {
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
