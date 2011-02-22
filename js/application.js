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
  $('.select.input').click(selectInputBySelectingDirectory);
  $('.select.output').click(selectOutputBySelectingDirectory);
  $('.project').click(function(){
    $(this).children('.config').toggle();
  });
}

function selectOutputBySelectingDirectory() {
  key = $(this).parents('.project:first').attr('data-key');
  config = $(this).siblings('span');
  browseDirectories(function(event){
    projects.get(key, function(project) {
      project.outputPath = event.target.nativePath;
      projects.save(project);
    });
    config.html(event.target.nativePath);
  });
  return false;
}

function selectInputBySelectingDirectory() {
  key = $(this).parents('.project:first').attr('data-key');
  config = $(this).siblings('span');
  browseDirectories(function(event){
    projects.get(key, function(project) {
      project.inputPath = event.target.nativePath;
      projects.save(project);
    });
    config.html(event.target.nativePath);
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

function createProjectFromFolder(event) {
  createProject(event.target.nativePath.replace(/\/$/, '').split('/').last(), event.target.nativePath, "");
}

function createProject(name, inputPath, outputPath) {
  projects.save({
    name: name,
    inputPath: inputPath,
    outputPath: outputPath
  });
  listProjects();
}

function appendProjectToProjectsList(project) {
  $.tmpl($("#project-template"), project).appendTo(".projects");
}

function dragEnterHandler(event) {
  event.preventDefault();
}

function dragOverHandler(event){ 
  event.preventDefault();
}

function dropHandler(event){ 
  event.preventDefault();
  createProject(event.dataTransfer.getData("text/uri-list").replace(/\/$/, '').split('/').last(), "", "");
}

function onOutputData()
{
  //air.trace("Got: ", process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable)); 
}

function onErrorData(event)
{
  //air.trace("ERROR -", process.standardError.readUTFBytes(process.standardError.bytesAvailable)); 
}

function onExit(event)
{
  //air.trace("Process exited with ", event.exitCode);
}

function onIOError(event)
{
  //air.trace(event.toString());
}

$(document).ready(function(){
  air.trace($("#m").length);
  $("#m").click(function(){
     var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
     var file = air.File.applicationDirectory.resolvePath("vendor/jruby-1.6.0.RC2/bin/jruby");
     nativeProcessStartupInfo.executable = file;

     var processArgs = new air.Vector["<String>"]();
     processArgs.push("--version");
     nativeProcessStartupInfo.arguments = processArgs;
       
     process = new air.NativeProcess();
     process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, dataHandler);
    process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, dataHandler);
     process.start(nativeProcessStartupInfo);
    
      var bytes = new air.ByteArray();
     function dataHandler(event) {
       process.standardOutput.readBytes(bytes, 0, process.standardOutput.bytesAvailable);
       alert(bytes.toString());
       air.trace(bytes.toString());
      // $("body").append(bytes.toString());
     }    
  });
});
