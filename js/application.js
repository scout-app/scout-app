Array.prototype.last = function() {return this[this.length-1];}

var Projects = new Lawnchair({adaptor: 'air', table: "projects"});

// UI stuff
$(document).ready(function() {
  listProjects();
  
  // create new project
  $('.option.add').live('click', createProjectBySelectingDirectory);
  $('.content').live('drop', createProjectByDroppingADirectory)
  
  // start/stop project
  $('.project .play').live('click', toggleWatch);
  $('.project .stop').live('click', toggleWatch);
  
  $('#select_sass_dir').live('click', selectInputBySelectingDirectory);
  $('#select_css_dir').live('click', selectOutputBySelectingDirectory);
  $('.project_details .delete').live('click', deleteProject);
  
  $('.project .source').live('click', function() {
    key = $(this).parents('.project:first').attr('data-key');
    Projects.get(key, function(project) {
     if(project) {
       $('.project_details').attr('data-key', key);
       $('#setting_sass_dir').html(project.sassDir);
       $('#setting_css_dir').html(project.cssDir);
     }
   });
  });
  
  $('#nuke').click(function(){
    Projects.nuke();
    listProjects();
  });
  
  function createProjectBySelectingDirectory() {
    browseDirectories(function(evnt) {
      createProject(evnt.target.nativePath.replace(/\/$/, '').split('/').last(), evnt.target.nativePath, "");  
    });
  }

  function createProjectByDroppingADirectory(evnt){ 
    evnt.preventDefault();
    createProject(evnt.dataTransfer.getData("text/uri-list").replace(/\/$/, '').split('/').last(), "", "");
  }
  
  function toggleWatch() {
    var project_container = $(this).parents('.project:first');
    key = project_container.attr('data-key');
    Projects.get(key, function(project) {
      if(project_container.hasClass("stopped")) {
        project_container.trigger("watch:start", { project: project });
      } else {
        project_container.trigger("watch:stop");
      }
      project_container.toggleClass("playing");
      project_container.toggleClass("stopped");
    });
    return false;
  }
  
});

function listProjects(){
  $('.projects').empty();
  Projects.all(function(project) {
    if(project) {
      appendProjectToProjectsList(project);
    }
  });
}

// Process stuff
$(function(){
  var process_map = {};
  
  $(".project").live("watch:start", startWatchingProject);
  $(".project").live("watch:stop", stopWatchingProject);
  air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, killWatchingProcesses);
  
  function startWatchingProject(evnt, data) {
    var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
    nativeProcessStartupInfo.executable = air.File.applicationDirectory.resolvePath("vendor/jruby-1.6.0.RC2/bin/jruby");

    var processArgs = new air.Vector["<String>"]();
    processArgs.push("-S", "compass", "--watch", "--sass-dir", data.project.sassDir, "--css-dir", data.project.cssDir, "--environment", data.project.environment, "--output-style", data.project.outputStyle);
    nativeProcessStartupInfo.arguments = processArgs;

    process = new air.NativeProcess();
    process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, dataHandler);
    process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, dataHandler);
    process.start(nativeProcessStartupInfo);

    var bytes = new air.ByteArray();
    function dataHandler(evnt) {
      process.standardOutput.readBytes(bytes, 0, process.standardOutput.bytesAvailable);
      air.trace(bytes.toString());
    }

    process_map[data.project.key] = process;
  }

  function stopWatchingProject(){
    var project_key = $(this).attr('data-key');
    var process = process_map[project_key];
    if(process){
      air.trace("Killing " + project_key);
      process.exit();
      delete process_map[project_key];
    }
  }
  
  function killWatchingProcesses(){
    for (var i in process_map) {
      process_map[i].exit();
    }
  }
  
});


function deleteProject() {
  key = $(this).parents('.project_details:first').attr('data-key');
  Projects.get(key, function(project) {
    Projects.remove(project);
  });
  listProjects();
  return false;
}

function selectOutputBySelectingDirectory() {
  key = $(this).parents('.project_details:first').attr('data-key');
  browseDirectories(function(evnt){
    Projects.get(key, function(project) {
      project.cssDir = evnt.target.nativePath;
      Projects.save(project);
    });
    $('#setting_css_dir').html(evnt.target.nativePath);
  });
  return false;
}

function selectInputBySelectingDirectory() {
  key = $(this).parents('.project_details:first').attr('data-key');
  browseDirectories(function(evnt){
    Projects.get(key, function(project) {
      project.sassDir = evnt.target.nativePath;
      Projects.save(project);
    });
    $('#setting_sass_dir').html(evnt.target.nativePath);
  });
  return false;
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


function createProject(name, sassDir, cssDir) {
  Projects.save({
    name: name,
    sassDir: sassDir,
    cssDir: cssDir,
    environment: "development",
    outputStyle: "expanded"
  });
  listProjects();
  $('.projects .project').last().children('.config').toggle();
}

function appendProjectToProjectsList(project) {
  $.tmpl($("#project_template"), project).appendTo(".projects");
}
