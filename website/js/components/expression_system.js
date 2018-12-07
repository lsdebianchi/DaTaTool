function close_expression_panel() {
  $("#expression_panel").removeClass("active");

  G.EXPRESSION_PANEL_OPEN = false;
}
function open_expression_panel() {
  $("#expression_panel").addClass("active");
  G.EXPRESSION_PANEL_OPEN = true;
}
function confirm_expression() {
  if (test_expression_validity()) {
    propagate_current_expression();
    close_expression_panel();
  }
}
function remove_expression() {
  current_expression.dataBehaviour = undefined;
  current_expression.dataSource = "time";
  current_expression.dataType = "frames";
  current_expression.expression = "";
  propagate_current_expression();
  close_expression_panel();
}

function test_expression_validity() {
  /// !!! EXCEPTION
  if (
    current_expression.dataBehaviour == "raw" &&
    current_expression.expression == ""
  ) {
    current_expression.expression = "1, 0";
  }
  ///
  if (!current_expression.dataBehaviour || !current_expression.dataType)
    return err5();
  var e = current_expression.expression;
  var vals = [];
  //if (e) vals = e.match(/[+-]?\d+(\.\d+)?/g);
  if (e) vals = e.split(", ");

  for (let j in vals) {
    if (vals[j] === "W") vals[j] = $("canvas").width() + "";
    if (vals[j] === "H") vals[j] = $("canvas").height() + "";
    if (
      (isNaN(Number(vals[j])) &&
        !vals[j].match(/^#(?:[0-9a-fA-F]{6})$/i) &&
        vals[j][0] !== ":") ||
      vals[j] === "" ||
      vals[j] === " "
    )
      return err0();
  }

  var test = [
    ["raw", 0, 2],
    ["clamp", 2, 3],
    ["map", 4],
    ["trigger", 2, 3],
    ["increment", 1, 2],
    ["bounce", 2],
    ["sin", 2],
    ["cos", 2],
    ["pulse", 5],
    ["pulse_trigger", 6],
    ["random", 1, 3],
    ["random_soft", 3]
  ];

  for (let i in test) {
    var name = test[i][0];
    if (current_expression.dataBehaviour !== name) continue;
    var min = test[i][1];
    var max = test[i][2];
    if (typeof max === typeof undefined) {
      var match = min;
      if (vals.length === match) return true;
      else return err4(match);
    } else {
      if (count(vals, min, max)) return true;
      else return err2(min);
    }
  }

  return err1();
}
function err0() {
  alert("One or more parameters are incorrect");
  return false;
}
function err1() {
  alert("Cannot interpret expression.");
  return false;
}
function err2(a) {
  alert(
    "Cannot interpret expression parameters.\nPlease insert at least " +
      a +
      " parameters."
  );
  return false;
}
function err4(a) {
  alert(
    "Cannot interpret expression parameters.\nPlease insert a total of " +
      a +
      " parameters."
  );
  return false;
}
function err5() {
  alert("Choose a value for BEHAVIOUR and INPUT.");
  return false;
}
function err3() {
  alert("Cannot interpret modifiers.");
  return false;
}
function count(list, min, max) {
  if (list.length >= min && list.length <= max) return true;
  else return false;
}
