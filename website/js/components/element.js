var Element = function(arg, _children) {
  this.type = arg.type === undefined ? undefined : arg.type;

  this.selected = arg.selected === undefined ? false : arg.selected;
  this.visible = arg.visible === undefined ? true : arg.visible;

  this.paper_element_index = NaN;
  this.original_element_index = undefined;

  this.layerOrder = NaN;
  //
  this.x = arg.x === undefined ? 0 : arg.x;
  this.y = arg.y === undefined ? 0 : arg.y;

  this.w = arg.w === undefined ? 10 : arg.w;
  this.h = arg.h === undefined ? 10 : arg.h;
  this.init_s = 30;
  this.ratio = this.h / this.w;
  this.lockRatio = arg.lockRatio === undefined ? false : arg.lockRatio;
  if (this.type == "text") {
    this.lockRatio = true;
  }

  if (!arg.type) {
    this.w = 0;
    this.h = 0;
  }

  this.r = arg.r === undefined ? 0 : arg.r;

  this.edgeLoop = arg.edgeLoop === undefined ? false : arg.edgeLoop;
  this.blendMode = arg.blendMode === undefined ? "normal" : arg.blendMode;

  this.fillColor =
    arg.fillColor === undefined ? G._LAST_FILLCOLOR : arg.fillColor;
  this.opacity = arg.opacity === undefined ? 100 : arg.opacity;

  this.strokeColor =
    arg.strokeColor === undefined ? G._LAST_STROKECOLOR : arg.strokeColor;
  this.strokeWidth =
    arg.strokeWidth === undefined ? G._LAST_STROKE_WIDTH : arg.strokeWidth;
  if (this.type == "text") this.strokeWidth = 0;

  this.fontFamily = arg.fontFamily === undefined ? "Questrial" : arg.fontFamily;
  this.textContent =
    arg.textContent === undefined ? "Quick Brown Fox" : arg.textContent;

  this.hasDimension = hasElement(this.type, "dimension") ? true : false;
  this.hasFill = hasElement(this.type, "fill") ? true : false;
  this.hasStroke = hasElement(this.type, "stroke") ? true : false;
  this.hasText = hasElement(this.type, "text") ? true : false;
  this.hasImg = hasElement(this.type, "img") ? true : false;
  this.hasOpacity = hasElement(this.type, "opacity") ? true : false;

  this.sourceFile =
    arg.sourceFile === undefined
      ? "./scenes/assets/something.png"
      : arg.sourceFile;

  this.isGroup = this.type === "group" ? true : false;
  this.group_parent_index = undefined;
  this.group_children_index = undefined;

  var name = this.type + ": ";
  if (_children) {
    this.group_children_index = _children.slice();
  } else if (
    arg.group_children_index &&
    arg.group_children_index.length !== 0
  ) {
    this.group_children_index = arg.group_children_index.slice();
  } else {
    this.group_children_index = [];
  }

  var ep; // = arg.ep ? arg.ep : undefined;

  if (this.type == "circle") {
    ep = new paper.Path.Circle({
      center: [this.x, this.y],
      radius: this.init_s / 2,
      fillColor: this.fillColor,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor
    });
    ep.bounds.width = this.init_s;
    ep.bounds.height = this.init_s;
  }
  if (this.type == "square") {
    ep = new paper.Path.Rectangle({
      point: [this.x - this.init_s / 2, this.y - this.init_s / 2],
      size: [this.init_s, this.init_s],
      fillColor: this.fillColor,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor
    });
  }
  if (this.type == "triangle") {
    ep = new paper.Path.RegularPolygon({
      center: [this.x, this.y],
      radius: this.init_s / 2,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      sides: 3
    });
    ep.bounds.width = this.init_s;
    ep.bounds.height = this.init_s;
  }
  if (this.type == "pentagon") {
    ep = new paper.Path.RegularPolygon({
      center: [this.x, this.y],
      radius: this.init_s / 2,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      sides: 5
    });
    ep.bounds.width = this.init_s;
    ep.bounds.height = this.init_s;
  }
  if (this.type == "esagon") {
    ep = new paper.Path.RegularPolygon({
      center: [this.x, this.y],
      radius: this.init_s / 2,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      sides: 6
    });
    ep.bounds.width = this.init_s;
    ep.bounds.height = this.init_s;
  }
  if (this.type == "text") {
    ep = new paper.PointText({
      point: [this.x, this.y],
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      content: this.textContent,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      strokeWidth: this.strokeWidth
    });
  }
  if (this.type == "raster") {
    ep = new paper.Raster({
      position: [this.x, this.y],
      source: this.sourceFile,
      size: first_load ? (G.LOADING ? [] : undefined) : undefined
    });
  }
  //group special
  let group_list = [];

  if (this.type == "group") {
    for (let i in this.group_children_index) {
      let elem = scene_state.elements[this.group_children_index[i]];
      if (!elem) continue;
      var p_el = paper_elements[elem.paper_element_index];
      group_list.push(p_el);
    }
    ep = new paper.Group({
      children: group_list
    });
    this.x = ep.position.x;
    this.y = ep.position.y;
  }
  if (this.type == "line" || this.type == "curve") {
    if (this.strokeWidth === undefined || this.strokeWidth <= 0)
      this.strokeWidth = 5;
    ep = new paper.Path({
      //fillColor: this.fillColor,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor
    });
    if (arg.lineData) {
      console.log("reconstruction");
      console.log(arg.lineData);
      for (let i = 0; i < arg.lineData.length; i++) {
        var p = arg.lineData[i];
        ep.add(new paper.Point(p[0], p[1]));
        if (this.type == "curve") {
          ep.smooth();
        }
      }
      ep.strokeWidth = this.strokeWidth;
    } else ep.add(new paper.Point(this.x, this.y));
  }

  //assign general ep variables
  if (ep) {
    ep._element = this;
    this.paper_element_index = allocate_new_paper_in_list(ep);
    ep.selected = true;
    ep.applyMatrix = true;
    ep._last_rotation = 0;
    ep._last_resize_w = 10;
    ep._last_resize_h = 10;
  }

  if (this.type == "group") {
    // if (this.lockRatio) {
    //   paperResize(ep, Number(this.w), Number(this.w) * this.ratio);
    //   this.h = (Number(this.w) * this.ratio).toFixed(5);
    // } else {
    //   paperResize(ep, Number(this.w), Number(this.h));
    //   this.ratio = Number(this.h) / Number(this.w);
    // }
    // paperRotate(ep, Number(this.r));
    //
    //ep.addChildren(group_list);
  }
  //generate data_ object/parameters
  for (let j in attr_list) {
    var name = "data_" + attr_list[j];
    if (arg[name] === undefined) {
      this[name] = {
        dataBehaviour: undefined,
        dataSource: "time",
        dataType: "frames",
        expression: "",
        valueType: input_type(attr_list[j])
      };
    } else {
      this[name] = {};
      this[name].valueType = input_type(attr_list[j]);
      this[name].dataBehaviour = arg[name].dataBehaviour;
      this[name].dataSource = arg[name].dataSource;
      this[name].dataType = arg[name].dataType;
      this[name].expression = arg[name].expression;
    }
  }
};
