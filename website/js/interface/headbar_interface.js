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
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});
$("#show_hierarchy_option").click(function() {
  $("#hierarchy_panel").toggleClass("active");
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});
$("#show_settings_option").click(function() {
  $("#settings_panel").toggleClass("active");
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});
$("#show_headbar_option").click(function() {
  window.HIDE_HEADBAR = !window.HIDE_HEADBAR;
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});
$("#add_option").click(function() {
  if (!DROP_OBJECT.active) {
    $("#add_panel").css("left", "320px");
    $("#add_panel").css("top", "40px");
    $("#add_panel").addClass("show");
  }
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});
$("#load_option").click(function() {
  load_scene();
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});
$("#save_option").click(function() {
  save_scene();
  $(this)
    .parent()
    .css("display", "none");
  $(this)
    .parent()
    .parent()
    .css("background-color", _GRAY_MENU_DARK);
});

$(".runButton").click(function() {
  $(this).toggleClass("active");
});

$("#run_sensor").click(function() {
  if (SCENE_RUNNING.active && !SCENE_RUNNING.warning) {
    SCENE_RUNNING.warning = true;
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
    if (window.HIDE_HEADBAR) {
      $("#headcontent").toggleClass("hide");
    }
  },
  function() {
    if (window.HIDE_HEADBAR) {
      $("#headcontent").toggleClass("hide");
    }
  }
);

$("#run_all").click(function() {
  if (!SCENE_RUNNING.active) run_scene();
  else stop_scene();
});
