var hitOptions = {
  fill: true,
  stroke: true,
  tolerance: 10
};
var path;
function load_paper_handlers() {
  paper_tool.onMouseDown = function(event) {
    //Unfocus Stuff
    $("input:text").blur();
    $("#picker").removeClass("active");
    //Line stuff
    if (G.LINEMAKING.active) {
      var p_el = get_current_paper_el();
      if (p_el.lastSegment.point.getDistance(event.point) < 5) {
        close_line_making();
      } else p_el.add(event.point);
    }
    //// SELECT ITEM
    else {
      if (!G.MAIUSC) {
        //CLEAR PREVIOUS SELECTION
        for (var i in paper.project.activeLayer.children) {
          paper.project.activeLayer.children[i]._permanent_selected = false;
          paper.project.activeLayer.children[i].selected = false;
        }
        current_multiselection = [];
      }

      segment = path = null;
      var hitResult = paper.project.hitTest(event.point, hitOptions);

      if (!hitResult) {
        //DESELECT ALL
        for (var i in paper.project.activeLayer.children) {
          paper.project.activeLayer.children[i]._permanent_selected = false;
          paper.project.activeLayer.children[i].selected = false;
        }
        current_multiselection = [];
        deselect_element();
        return;
      }
      // if (event.modifiers.shift) {
      //   if (hitResult.type == "segment") {
      //     hitResult.segment.remove();
      //   }
      //   return;
      // }

      if (hitResult) {
        path = hitResult.item;
        path._permanent_selected = true;
        path.selected = true;
        //current_element = path._element;
        getValues(current_element, path._element);
        current_multiselection.push(current_element.original_element_index);
        if (G.DROP_EXPRESSION.active) paste_expression(current_element);
      }

      movePath = hitResult.type == "fill";
      //if (movePath) paper.project.activeLayer.addChild(hitResult.item);
    }
  };

  paper_tool.onMouseMove = function(event) {
    //paper.project.activeLayer.selected = false;
    for (var i in paper.project.activeLayer.children) {
      if (!paper.project.activeLayer.children[i]._permanent_selected) {
        paper.project.activeLayer.children[i].selected = false;
      }
    }
    if (event.item) event.item.selected = true;
  };

  paper_tool.onMouseDrag = function(event) {
    if (path) {
      current_element.x = parseInt(path._element.x) + event.delta.x;
      current_element.y = parseInt(path._element.y) + event.delta.y;

      propagate_modifications();
    }
  };

  paper_tool.onMouseUp = function(event) {
    if (path) propagate_modifications(true);
  };
}

function close_line_making() {
  if (G.LINEMAKING.type == "curve") get_current_paper_el().smooth();
  G.LINEMAKING.active = false;
  current_element.x = get_current_paper_el().position.x;
  current_element.y = get_current_paper_el().position.y;
  propagate_modifications();

  $("canvas").removeClass("drawing");
}
