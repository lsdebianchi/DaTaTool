$("#scene_name")
  .children("input")
  .on("input", function() {
    current_project.name = $(this).val();
  });

$("#scene_options, #edit_options, #view_options, #help_options").hover(
  function() {
    $(this).css("background-color", _BLUE_SELECT);
    $(this)
      .children(".drop_down_content")
      .css("display", "block");
  },
  function() {
    $(this).css("background-color", _GRAY_MENU_DARK);
    $(this)
      .children(".drop_down_content")
      .css("display", "none");
  }
);

$("#show_properties_option").click(function() {
  $("#property_panel").toggleClass("active");
  close_current_drop_down_menu(this);

});
$("#show_hierarchy_option").click(function() {
  $("#hierarchy_panel").toggleClass("active");
  close_current_drop_down_menu(this);

});
$("#show_settings_option").click(function() {
  $("#settings_panel").toggleClass("active");
  close_current_drop_down_menu(this);

});
$("#show_headbar_option").click(function() {
  window.G.HIDE_HEADBAR = !window.G.HIDE_HEADBAR;
  close_current_drop_down_menu(this);

});
$("#add_option").click(function() {
  if (!G.DROP_OBJECT.active) {
    $("#add_panel").css("left", "320px");
    $("#add_panel").css("top", "40px");
    $("#add_panel").addClass("show");
  }
  close_current_drop_down_menu(this);

});
$("#load_option").click(function() {
  load_scene();
  close_current_drop_down_menu(this);

});
$("#clear_option").click(function() {
  clear_scene();
  close_current_drop_down_menu(this);

});
$("#save_option").click(function() {
  save_scene();
  close_current_drop_down_menu(this);

});

function close_current_drop_down_menu(el){
  $(el)
    .parent()
    .css("display", "none");
  $(el)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
}

$(".runButton").click(function() {
  $(this).toggleClass("active");
});

$("#run_sensor").click(function() {
  if (G.SCENE_RUNNING.active && !G.SCENE_RUNNING.warning) {
    G.SCENE_RUNNING.warning = true;
    alert(
      "The scene is currently running.\nAll the changes you make while the scene is running will be lost and might cause bugs."
    );
  }
  scene_state.play_setting.sensor = !scene_state.play_setting.sensor;
  console.log(scene_state.play_setting.sensor);
});

$(".start").click(function() {
  $(this)
    .children(".drop_triangle")
    .toggleClass("open");
  $(this)
    .parent()
    .parent()
    .children(".content")
    .toggleClass("close");
});

$("#headbar").hover(
  function() {
    if (window.G.HIDE_HEADBAR) {
      $("#headcontent").toggleClass("hide");
    }
  },
  function() {
    if (window.G.HIDE_HEADBAR) {
      $("#headcontent").toggleClass("hide");
    }
  }
);

$("#run_all").click(function() {
  if (!G.SCENE_RUNNING.active) run_scene();
  else stop_scene();
});
