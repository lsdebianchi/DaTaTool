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
    if (e.which == 91) {
      //G.MAIUSC
      G.CMD = false;
    }
  }
});
$("body").on("keydown", function(e) {
  //ARROW UP
  if (e.which == 38) {
    if (G.LOAD_LOG.focus) {
      G.LOAD_LOG.index--;
      if (G.LOAD_LOG.index === -1) {
        G.LOAD_LOG.index = G.LOAD_LOG.saved_scenes_list.length - 1;
      }
      $("#load_log").val(G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index]);
      current_project.name = G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index];
    }
  }
  //ARROW DOWN
  else if (e.which == 40) {
    if (G.LOAD_LOG.focus) {
      G.LOAD_LOG.index++;
      if (G.LOAD_LOG.index === G.LOAD_LOG.saved_scenes_list.length) {
        G.LOAD_LOG.index = 0;
      }
      $("#load_log").val(G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index]);
      current_project.name = G.LOAD_LOG.saved_scenes_list[G.LOAD_LOG.index];
    }
  }
  //esc
  if (e.which == 27) {
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
  //enter
  if (e.which == 13) {
    if (G.EXPRESSION_PANEL_OPEN) confirm_expression();
  }
  /////////////////////////// LETTERS HERE
  if (!G.PREVENT_HOTKEYS) {
    //g
    if (e.which == 71) {
      for (let i = 0; i < current_multiselection.length; i++) {
        if (scene_state.elements[current_multiselection[i]].type == "group") {
          alert("CAUTION:\nYou cannot make groups that contains other groups");
          return;
        }
      }
      if (current_multiselection.length > 1) {
        create_group(current_multiselection);
        current_multiselection = [];
      }
    }
    //x
    if (e.which == 88) {
      if (current_multiselection.length > 1) {
        for (let i in current_multiselection) {
          let p =
            paper_elements[
              scene_state.elements[current_multiselection[i]]
                .paper_element_index
            ];
          if (p) delete_element(p);
        }
        current_multiselection = [];
      } else {
        let p = get_current_paper_el();
        if (p) delete_element(p);
      }
    }
    //p
    if (e.which == 80) {
      $("#run_all").addClass("active");
      if (!G.SCENE_RUNNING.active) run_scene();
    }
    //spacebar
    if (e.which == 32) {
      $("#headcontent").toggleClass("hide");
      window.G.HIDE_HEADBAR = !window.G.HIDE_HEADBAR;

      $(".panel").toggleClass("open");
    }
    //G.MAIUSC
    if (e.which == 16) {
      G.MAIUSC = true;
    }
    //G.MAIUSC
    if (e.which == 91) {
      G.CMD = true;
    }
    //d
    if (e.which == 68) {
      if (current_multiselection.length > 1) {
        console.log("multi");
        var new_multiselection = [];
        for (let i in current_multiselection) {
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
    //a
    if (e.which == 65 && !G.DROP_OBJECT.active) {
      $("#add_panel").toggleClass("show");
      $("#add_panel").css("left", mouseX + "px");
      $("#add_panel").css("top", mouseY + "px");
    }
    //c
    if (e.which == 67) {
      $("#picker").toggleClass("active");
    }
    //w
    if (
      e.which == 87 &&
      !G.DROP_OBJECT.active &&
      get_current_paper_el() &&
      !current_element.isGroup
    ) {
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
    //r
    if (
      e.which == 82 &&
      !G.DROP_OBJECT.active &&
      get_current_paper_el() &&
      !current_element.isGroup
    ) {
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
    //s
    if (e.which == 83) {
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
    let t = get_current_paper_el();
    if (G.TRANSFORM.type === "scale") {
      let d = t.position.getDistance(new paper.Point(mouseX, mouseY));

      let dd = d - G.TRANSFORM.initial_distance;

      let new_w = parseInt(G.TRANSFORM.initial_val) + dd / 5;

      current_element.w = parseInt(new_w);
      current_element.h = parseInt(new_w * G.TRANSFORM.ratio);
    }
    if (G.TRANSFORM.type === "rotate") {
      let t = get_current_paper_el();
      if (G.TRANSFORM.type === "rotate") {
        let d = t.position.getDistance(new paper.Point(mouseX, mouseY));

        let dd = d - G.TRANSFORM.initial_distance;

        let new_w = parseInt(G.TRANSFORM.initial_val) + dd / 2;

        current_element.r = parseInt(new_w);
      }
    }
    propagate_modifications();
  }
});
