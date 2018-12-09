function hasElement(type, test) {
  if (type == "line" || type == "curve") {
    if (test == "dimension") return true;
    if (test == "stroke") return true;
    if (test == "fill") return true;
    if (test == "img") return false;
    if (test == "text") return false;
    if (test == "opacity") return true;
  }
  if (
    type == "circle" ||
    type == "square" ||
    type == "triangle" ||
    type == "esagon" ||
    type == "pentagon"
  ) {
    if (test == "dimension") return true;
    if (test == "stroke") return true;
    if (test == "fill") return true;
    if (test == "img") return false;
    if (test == "text") return false;
    if (test == "opacity") return true;
  }
  if (type == "text") {
    if (test == "dimension") return true;
    if (test == "stroke") return true;
    if (test == "fill") return true;
    if (test == "img") return false;
    if (test == "text") return true;
    if (test == "opacity") return true;
  }
  if (type == "raster") {
    if (test == "dimension") return true;
    if (test == "stroke") return false;
    if (test == "fill") return false;
    if (test == "img") return true;
    if (test == "text") return false;
    if (test == "opacity") return true;
  }
  if (type == "group") {
    if (test == "dimension") return true;
    if (test == "stroke") return false;
    if (test == "fill") return false;
    if (test == "img") return false;
    if (test == "text") return false;
    if (test == "opacity") return true;
  }
}

function input_type(attr_name) {
  if (attr_name === "x") return "number";
  if (attr_name === "y") return "number";
  if (attr_name === "w") return "number";
  if (attr_name === "h") return "number";
  if (attr_name === "r") return "number";
  if (attr_name === "lockRatio") return "checkbox";
  if (attr_name === "fillColor") return "color";
  if (attr_name === "strokeColor") return "color";
  if (attr_name === "visible") return "checkbox";
  if (attr_name === "opacity") return "number";
  if (attr_name === "strokeWidth") return "number";
  if (attr_name === "textContent") return "text";
  if (attr_name === "sendTop") return "none";
  if (attr_name === "sendBottom") return "none";
}
