function close_expression_panel() {
  $("#expression_panel").removeClass("active");

  EXPRESSION_PANEL_OPEN = false;
}
function open_expression_panel() {
  $("#expression_panel").addClass("active");
  EXPRESSION_PANEL_OPEN = true;
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
  var e = current_expression.expression;
  var vals = [];
  //if (e) vals = e.match(/[+-]?\d+(\.\d+)?/g);
  if (e) vals = e.split(", ");

  //
  if (current_expression.dataBehaviour == "increment") {
    if (count(vals, 1, 2)) return true;
    else return err2(1);
  }
  if (current_expression.dataBehaviour == "bounce") {
    if (vals.length == 2) return true;
    else return err2(2);
  }
  if (current_expression.dataBehaviour == "sin") {
    if (vals.length == 2) return true;
    else return err2(2);
  }
  if (current_expression.dataBehaviour == "cos") {
    if (vals.length == 2) return true;
    else return err2(2);
  }
  if (current_expression.dataBehaviour == "pulse") {
    if (vals.length == 5) return true;
    else return err2(5);
  }
  if (current_expression.dataBehaviour == "random") {
    if (vals.length == 3) return true;
    else return err2(3);
  }
  if (current_expression.dataBehaviour == "random_soft") {
    if (vals.length == 3) return true;
    else return err2(3);
  }

  return err1();
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
function err3() {
  alert("Cannot interpret modifiers.");
  return false;
}
function count(list, min, max) {
  if (list.length >= min && list.length <= max) return true;
  else return false;
}
