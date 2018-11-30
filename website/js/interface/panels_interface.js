$(".panel").mousedown(function() {
  $(".panel").css("z-index", "100");
  $(this).css("z-index", "101");
});

// Make the DIV element draggable:
dragElement($("#property_panel")[0]);
dragElement($("#hierarchy_panel")[0]);
dragElement($("#settings_panel")[0]);

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  $("#" + elmnt.id).children(".header")[0].onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

///////////ADD PANEL ///////////////////////////////////////////////////////////

$(".add_option").click(function() {
  DROP_OBJECT.active = true;
  $("#drop_icon").toggleClass("hide");
  DROP_OBJECT.type = $(this).attr("kind");
  $("#drop_icon")
    .children("img")
    .attr("src", "./visual_assets/ico_" + $(this).attr("kind") + ".png");
  $("#add_panel").removeClass("show");
  $("#drop_icon").css("left", mouseX - 15 + "px");
  $("#drop_icon").css("top", mouseY - 15 + "px");
});

$("#paper_canvas").click(function(e) {
  $(".textinput").blur();
  if (DROP_OBJECT.active == true) {
    DROP_OBJECT.active = false;
    $("#drop_icon").toggleClass("hide");
    if (DROP_OBJECT.type == "line" || DROP_OBJECT.type == "curve") {
      LINEMAKING.active = true;
      if (DROP_OBJECT.type == "line") LINEMAKING.type = "line";
      else LINEMAKING.type = "curve";
      $("canvas").toggleClass("drawing");
    }
    create_new_element(DROP_OBJECT.type, e.pageX, e.pageY);
  }
});
///////////
$("input").on("input", function() {
  if (SCENE_RUNNING.active && !SCENE_RUNNING.warning) {
    SCENE_RUNNING.warning = true;
    alert(
      "The scene is currently running.\nAll the changes you make while the scene is running will be lost and might cause bugs."
    );
  }
  propagate_modifications();
  if (
    $(this).attr("kind") == "visible" ||
    $(this).attr("kind") == "edgeLoop" ||
    $(this).attr("kind") == "lockRatio"
  ) {
    setTimeout(function() {
      propagate_modifications();
    }, 1);
  }
});
$("#property_panel .selector").on("change", function() {
  propagate_modifications();
  setTimeout(function() {
    paper_tool.onMouseDown({
      point: get_current_paper_el().bounds.center,
      modifiers: false
    });
  }, 100);
});
/////////PROPERTY PANEL ////////////////////////////////////////////////////////

$("input:text, .textinput").focusin(function() {
  PREVENT_HOTKEYS = true;
  var attr = $(this).attr("load_log");
  if (typeof attr !== typeof undefined && attr !== false) {
    LOAD_LOG.focus = true;
  }
});
$("input:text, .textinput").focusout(function() {
  PREVENT_HOTKEYS = false;
  var attr = $(this).attr("load_log");
  if (typeof attr !== typeof undefined && attr !== false) {
    LOAD_LOG.focus = false;
  }
});
$("#move_bottom").click(function() {
  get_current_paper_el().sendToBack();
});
$("#move_top").click(function() {
  get_current_paper_el().bringToFront();
});
$(".entry_data").click(function() {});
/////////SETTINGS PANEL ////////////////////////////////////////////////////////
$("#settings_panel .selector").on("change", function() {
  propagate_settings();
});
$("#settings_panel input").on("input", function() {
  propagate_settings();
});

/////////EXPRESSION PANEL ////////////////////////////////////////////////////////

$(".entry_data").click(function() {
  var d = $(this).attr("pointer");
  current_expression.type = "data_" + d;
  current_expression.dataBehaviour = current_element["data_" + d].dataBehaviour;
  current_expression.dataSource = current_element["data_" + d].dataSource;
  current_expression.dataType = current_element["data_" + d].dataType;
  current_expression.expression = current_element["data_" + d].expression;
  current_expression.inputType = current_element["data_" + d].inputType;
  open_expression_panel();
});
$("#expression_panel .confirm").click(function() {
  confirm_expression();
});
$("#expression_panel .remove").click(function() {
  remove_expression();
});
$("#expression_panel .cancel").click(function() {
  close_expression_panel();
});
