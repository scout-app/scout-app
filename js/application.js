Array.prototype.last = function() {return this[this.length-1];}

var projects = new Lawnchair({adaptor: 'air', table: "projects"});

$(document).ready(function() {
  listProjects();
  
  var target = document.getElementById('watchtarget');
  target.addEventListener("dragenter", dragEnterHandler);
  target.addEventListener("dragover", dragOverHandler);
  target.addEventListener("drop", dropHandler);
  
  $('.option.add').click(createProjectBySelectingDirectory);
  
  $('#nuke').click(function(){
    projects.nuke();
    listProjects();
  });
});

function listProjects(){
  $('.projects').empty();
  projects.all(function(project){
    if(project){
      appendProjectToProjectsList(project);
    }
  });
  $('.project .select.input').click(selectInputBySelectingDirectory);
  $('.project .select.output').click(selectOutputBySelectingDirectory);
  $('.project .delete').click(deleteProject);
  
  $('.project .play').live('click', toggleWatch);
  $('.project .stop').live('click', toggleWatch);
  
  $('.project .source').click(function() {
    $(this).parents('.project').children('.config').toggle();
  });
}

function startWatch(inputPath, outputPath) {
  air.trace("started watching..." + inputPath);
}

function stopWatch() {
  air.trace("stopped watching.");
}

function toggleWatch(evnt) {
  key = $(this).parents('.project:first').attr('data-key');
  thing = $(this);
  projects.get(key, function(project) {
    if(thing.hasClass("play")) {
      startWatch(project.inputPath, project.outputPath);
      thing.html("Stop");
    } else {
      stopWatch();
      thing.html("Play");
    }
    thing.toggleClass("play");
    thing.toggleClass("stop");
  });
  return false;
}

// function playProject() {
//   projects.get(key, function(project) {
//     startWatch(project.inputPath, project.outputPath);
//   });
//   $(this).removeClass("play");
//   $(this).addClass("stop");
//   $('.project .stop').click(stopProject);
//   $(this).html("stop");
//   return false;
// }
// 
// function stopProject() {
//   key = $(this).parents('.project:first').attr('data-key');
//   projects.get(key, function(project) {
//     stopWatch();
//   });
//   $(this).removeClass("stop");
//   $(this).addClass("play");
//   $('.project .play').click(playProject);
//   $(this).html("play");
//   return false;
// }

function deleteProject() {
  key = $(this).parents('.project:first').attr('data-key');
  projects.get(key, function(project) {
    projects.remove(project);
  });
  listProjects();
  return false;
}

function selectOutputBySelectingDirectory() {
  key = $(this).parents('.project:first').attr('data-key');
  config = $(this).siblings('span');
  browseDirectories(function(evnt){
    projects.get(key, function(project) {
      project.outputPath = evnt.target.nativePath;
      projects.save(project);
    });
    config.html(evnt.target.nativePath);
  });
  return false;
}

function selectInputBySelectingDirectory() {
  key = $(this).parents('.project:first').attr('data-key');
  config = $(this).siblings('span');
  browseDirectories(function(evnt){
    projects.get(key, function(project) {
      project.inputPath = evnt.target.nativePath;
      projects.save(project);
    });
    config.html(evnt.target.nativePath);
  });
  return false;
}

function createProjectBySelectingDirectory() {
  browseDirectories(createProjectFromFolder);
}

function browseDirectories(callback) {
  var directory = air.File.documentsDirectory;
  try
  {
    directory.browseForDirectory("Select Directory");
    directory.addEventListener(air.Event.SELECT, callback);
  }
  catch (error)
  {
    air.trace("Failed:", error.message)
  }
}

function createProjectFromFolder(evnt) {
  createProject(evnt.target.nativePath.replace(/\/$/, '').split('/').last(), evnt.target.nativePath, "");
}

function createProject(name, inputPath, outputPath) {
  projects.save({
    name: name,
    inputPath: inputPath,
    outputPath: outputPath
  });
  listProjects();
  $('.projects .project').last().children('.config').toggle();
}

function appendProjectToProjectsList(project) {
  $.tmpl($("#project-template"), project).appendTo(".projects");
}

function dragEnterHandler(evnt) {
  evnt.preventDefault();
}

function dragOverHandler(evnt){ 
  evnt.preventDefault();
}

function dropHandler(evnt){ 
  evnt.preventDefault();
  createProject(evnt.dataTransfer.getData("text/uri-list").replace(/\/$/, '').split('/').last(), "", "");
}

function onOutputData()
{
  //air.trace("Got: ", process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable)); 
}

function onErrorData(evnt)
{
  //air.trace("ERROR -", process.standardError.readUTFBytes(process.standardError.bytesAvailable)); 
}

function onExit(evnt)
{
  //air.trace("Process exited with ", evnt.exitCode);
}

function onIOError(evnt)
{
  //air.trace(evnt.toString());
}

// $(document).ready(function(){
//   air.trace($("#m").length);
//   $("#m").click(function(){
//      var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
//      var file = air.File.applicationDirectory.resolvePath("vendor/jruby-1.6.0.RC2/bin/jruby");
//      nativeProcessStartupInfo.executable = file;
// 
//      var processArgs = new air.Vector["<String>"]();
//      processArgs.push("--version");
//      nativeProcessStartupInfo.arguments = processArgs;
//        
//      process = new air.NativeProcess();
//      process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, dataHandler);
//     process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, dataHandler);
//      process.start(nativeProcessStartupInfo);
//     
//       var bytes = new air.ByteArray();
//      function dataHandler(evnt) {
//        process.standardOutput.readBytes(bytes, 0, process.standardOutput.bytesAvailable);
//        alert(bytes.toString());
//        air.trace(bytes.toString());
//       // $("body").append(bytes.toString());
//      }    
//   });
// });
