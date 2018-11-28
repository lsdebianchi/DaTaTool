$("#paper_canvas").mousemove(function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;

  if (DROP_OBJECT.active) {
    $("#drop_icon").css("left", mouseX - 15 + "px");
    $("#drop_icon").css("top", mouseY - 15 + "px");
  }

  if (TRANSFORM.active) {
    var t = get_current_paper_el();
    if (TRANSFORM.type === "scale") {
      var d = t.position.getDistance(new paper.Point(mouseX, mouseY));

      var dd = d - TRANSFORM.initial_distance;

      var new_w = parseInt(TRANSFORM.initial_val) + dd / 5;

      current_element.w = parseInt(new_w);
      current_element.h = parseInt(new_w * TRANSFORM.ratio);
    }
    if (TRANSFORM.type === "rotate") {
      var t = get_current_paper_el();
      if (TRANSFORM.type === "rotate") {
        var d = t.position.getDistance(new paper.Point(mouseX, mouseY));

        var dd = d - TRANSFORM.initial_distance;

        var new_w = parseInt(TRANSFORM.initial_val) + dd / 2;

        current_element.r = parseInt(new_w);
      }
    }
    propagate_modifications();
  }
});

$("body").on("mousedown", function(e) {
  if (TRANSFORM.active) TRANSFORM.active = false;
  $("canvas").removeClass("resizing");
  $("canvas").removeClass("rotating");
});

$("body").on("keydown", function(e) {
  if (e.which == 27) {
    if (SCENE_RUNNING) {
      $("#run_all").removeClass("active");
      stop_scene();
    }
  }
  if (EXPRESSION_PANEL_OPEN) {
    if (e.which == 27) {
      //esc

      close_expression_panel();
    }
    if (e.which == 13) {
      //enter
      confirm_expression();
    }
  }
  if (!PREVENT_HOTKEYS) {
    if (e.which == 88) {
      //x
      var p = get_current_paper_el();
      if (p) delete_element(p);
    }
    if (e.which == 80) {
      //p
      $("#run_all").addClass("active");
      if (!SCENE_RUNNING) run_scene();
    }
    if (e.which == 32) {
      //spacebar
      $(".panel").toggleClass("open");
    }
    if (e.which == 68) {
      //d
      create_new_element(
        current_element.type,
        current_element.x,
        current_element.y,
        current_element,
        20,
        20
      );
    }
    if (e.which == 65 && !DROP_OBJECT.active) {
      //a
      $("#add_panel").toggleClass("show");
      $("#add_panel").css("left", mouseX + "px");
      $("#add_panel").css("top", mouseY + "px");
    }
    if (e.which == 87 && !DROP_OBJECT.active && get_current_paper_el()) {
      //w
      TRANSFORM.active = !TRANSFORM.active;

      $("canvas").toggleClass("resizing");
      if (TRANSFORM.active) {
        TRANSFORM.type = "scale";
        TRANSFORM.initial_pos = new paper.Point(mouseX, mouseY);
        TRANSFORM.target_pos = new paper.Point(
          get_current_paper_el().position.x,
          get_current_paper_el().position.y
        );
        TRANSFORM.initial_distance = TRANSFORM.initial_pos.getDistance(
          TRANSFORM.target_pos
        );
        TRANSFORM.initial_val = current_element.w;
        TRANSFORM.ratio = current_element.h / current_element.w;
      }
    }
    if (e.which == 82 && !DROP_OBJECT.active && get_current_paper_el()) {
      //r
      TRANSFORM.active = !TRANSFORM.active;

      $("canvas").toggleClass("rotating");
      if (TRANSFORM.active) {
        TRANSFORM.type = "rotate";
        TRANSFORM.initial_pos = new paper.Point(mouseX, mouseY);
        TRANSFORM.target_pos = new paper.Point(
          get_current_paper_el().position.x,
          get_current_paper_el().position.y
        );
        TRANSFORM.initial_distance = TRANSFORM.initial_pos.getDistance(
          TRANSFORM.target_pos
        );
        TRANSFORM.initial_val = current_element.r;
      }
    }
    if (e.which == 83) {
      //s
      save_scene();
    }

    //   setTimeout(function() {
    //     propagate_modifications();
    //   }, 100);
  }
});
//
// $("body").on("keyup", function(e) {
//   setTimeout(function() {
//     propagate_modifications();
//   }, 100);
// });
