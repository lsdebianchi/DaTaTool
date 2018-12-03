$("body").on("mousedown", function(e) {
  if (G.TRANSFORM.active) G.TRANSFORM.active = false;
  $("canvas").removeClass("resizing");
  $("canvas").removeClass("rotating");
});
$("body").on("keyup", function(e) {
  if (!G.PREVENT_HOTKEYS) {
    if (e.which == 16) {
      //G.MAIUSC
      G.MAIUSC = false;
    }
  }
});
$("body").on("keydown", function(e) {
  if (e.which == 38) {
    //ARROW UP
    if (G.LOAD_LOG.focus) {
      G.LOAD_LOG.index--;
      if (G.LOAD_LOG.index === -1) {
        G.LOAD_LOG.index = G.LOAD_LOG.saved_scenes_list.length - 1;
      }
      $("#G.LOAD_LOG").val(G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index]);
      current_project.name = G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index];
    }
  } else if (e.which == 40) {
    //ARROW DOWN
    if (G.LOAD_LOG.focus) {
      G.LOAD_LOG.index++;
      if (G.LOAD_LOG.index === G.LOAD_LOG.saved_scenes_list.length) {
        G.LOAD_LOG.index = 0;
      }
      $("#G.LOAD_LOG").val(G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index]);
      current_project.name = G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index];
    }
  }
  if (e.which == 27) {
    //esc
    if (G.SCENE_RUNNING.active) {
      $("#run_all").removeClass("active");
      stop_scene();
    }
    if (G.EXPRESSION_PANEL_OPEN) {
      close_expression_panel();
    }
    if (G.LINEMAKING.active) {
      close_line_making();
    }
  }
  if (e.which == 13) {
    //enter
    if (G.EXPRESSION_PANEL_OPEN) confirm_expression();
  }
  if (!G.PREVENT_HOTKEYS) {
    /////////////////////////// LETTERS HERE
    if (e.which == 88) {
      //x
      if (current_multiselection.length > 1) {
        for (var i in current_multiselection) {
          var p =
            paper_elements[
              scene_state.elements[current_multiselection[i]]
                .paper_element_index
            ];
          if (p) delete_element(p);
        }
        current_multiselection = [];
      } else {
        var p = get_current_paper_el();
        if (p) delete_element(p);
      }
    }
    if (e.which == 80) {
      //p
      $("#run_all").addClass("active");
      if (!G.SCENE_RUNNING.active) run_scene();
    }
    if (e.which == 32) {
      //spacebar
      $(".panel").toggleClass("open");
    }
    if (e.which == 16) {
      //G.MAIUSC
      G.MAIUSC = true;
    }
    if (e.which == 68) {
      //d
      if (current_multiselection.length > 1) {
        var new_multiselection = [];
        for (var i in current_multiselection) {
          var el = scene_state.elements[current_multiselection[i]];
          if (el) {
            var new_el = duplicate_element(el);
            new_multiselection.push(new_el.original_element_index);
          }
        }
        current_multiselection = new_multiselection.slice();
      } else {
        duplicate_element(current_element);
      }
    }
    if (e.which == 65 && !G.DROP_OBJECT.active) {
      //a
      $("#add_panel").toggleClass("show");
      $("#add_panel").css("left", mouseX + "px");
      $("#add_panel").css("top", mouseY + "px");
    }
    if (e.which == 67) {
      //c
      $("#picker").toggleClass("active");
    }
    if (e.which == 87 && !G.DROP_OBJECT.active && get_current_paper_el()) {
      //w
      G.TRANSFORM.active = !G.TRANSFORM.active;

      $("canvas").toggleClass("resizing");
      if (G.TRANSFORM.active) {
        G.TRANSFORM.type = "scale";
        G.TRANSFORM.initial_pos = new paper.Point(mouseX, mouseY);
        G.TRANSFORM.target_pos = new paper.Point(
          get_current_paper_el().position.x,
          get_current_paper_el().position.y
        );
        G.TRANSFORM.initial_distance = G.TRANSFORM.initial_pos.getDistance(
          G.TRANSFORM.target_pos
        );
        G.TRANSFORM.initial_val = current_element.w;
        G.TRANSFORM.ratio = current_element.h / current_element.w;
      }
    }
    if (e.which == 82 && !G.DROP_OBJECT.active && get_current_paper_el()) {
      //r
      G.TRANSFORM.active = !G.TRANSFORM.active;

      $("canvas").toggleClass("rotating");
      if (G.TRANSFORM.active) {
        G.TRANSFORM.type = "rotate";
        G.TRANSFORM.initial_pos = new paper.Point(mouseX, mouseY);
        G.TRANSFORM.target_pos = new paper.Point(
          get_current_paper_el().position.x,
          get_current_paper_el().position.y
        );
        G.TRANSFORM.initial_distance = G.TRANSFORM.initial_pos.getDistance(
          G.TRANSFORM.target_pos
        );
        G.TRANSFORM.initial_val = current_element.r;
      }
    }
    if (e.which == 83) {
      //s
      save_scene();
    }
  }
});
////////////////////////////////////////////////////////////////////////////////
$("#paper_canvas").mousemove(function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;

  if (G.DROP_OBJECT.active) {
    $("#drop_icon").css("left", mouseX - 15 + "px");
    $("#drop_icon").css("top", mouseY - 15 + "px");
  }

  if (G.TRANSFORM.active) {
    var t = get_current_paper_el();
    if (G.TRANSFORM.type === "scale") {
      var d = t.position.getDistance(new paper.Point(mouseX, mouseY));

      var dd = d - G.TRANSFORM.initial_distance;

      var new_w = parseInt(G.TRANSFORM.initial_val) + dd / 5;

      current_element.w = parseInt(new_w);
      current_element.h = parseInt(new_w * G.TRANSFORM.ratio);
    }
    if (G.TRANSFORM.type === "rotate") {
      var t = get_current_paper_el();
      if (G.TRANSFORM.type === "rotate") {
        var d = t.position.getDistance(new paper.Point(mouseX, mouseY));

        var dd = d - G.TRANSFORM.initial_distance;

        var new_w = parseInt(G.TRANSFORM.initial_val) + dd / 2;

        current_element.r = parseInt(new_w);
      }
    }
    propagate_modifications();
  }
});
