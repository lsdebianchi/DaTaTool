var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");

var project_name = "test_scene";

getSavedFileList();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log("WEB APLICATION ONLINE");
console.log("---");
console.log('>>> go to "localhoast:3000" to use the application.');
console.log("---");
console.log(">>> press ctrl+c to stop the execution in the terminal.");
console.log("---");
console.log(
  '>>> in order for an image to be loaded, it needs to be in the "assets/" folder.'
);
console.log("---");
var server = app.listen(3000);
app.use(express.static("website"));

app.get("/load_scene/:scene_name", sendLoadScene);

function sendLoadScene(req, res) {
  var data = req.params;

  var scene_to_load = fs.readFileSync(
    "./website/scenes/user_scenes/" + data.scene_name + ".json"
  );

  scene_to_load = JSON.parse(scene_to_load);
  scene_to_load.saved_scenes_list = getSavedFileList();
  scene_to_load = JSON.stringify(scene_to_load);

  res.send(scene_to_load);
}

app.post("/save_scene/", saveScene);

function saveScene(req, res) {
  var data = req.body;

  fs.writeFile(
    "./website/scenes/user_scenes/" + data.scene_name + ".json",
    data.scene,
    finished
  );
  function finished() {
    //console.log("- file saved: " + data.scene_name);
    res.send({ success: true });
  }
}

function getSavedFileList() {
  var files = [];
  fs.readdirSync("./website/scenes/user_scenes/").forEach(file => {
    if (
      /([a-zA-Z0-9\s_\\.\-\(\):])+(.json)$/i.test(file) &&
      /^((?!_LOG).)*$/gi.test(file)
    ) {
      file = file.slice(0, -5);
      files.push(file);
    }
  });
  return files;
}
