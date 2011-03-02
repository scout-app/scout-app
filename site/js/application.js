Array.prototype.last = function() {return this[this.length-1];}

var Projects = new Lawnchair({adaptor: 'air', table: "projects"+ENV});

var app = {
  delegateTo: function(targetMethod){
    return function(evnt){
      app[targetMethod](evnt);
    };
  },
  
  initialize: function() {
    app.listProjects();
  },
  
  createProjectBySelectingDirectory: function() {
    browseDirectories(air.File.userDirectory.nativePath, function(evnt) {
      if(air.Capabilities.os.match(/Windows/)) {
        app.createProject(evnt.target.nativePath.replace(/\\$/, '').split('\\').last(), evnt.target.nativePath, "", "");  
      } else {
        app.createProject(evnt.target.nativePath.replace(/\/$/, '').split('/').last(), evnt.target.nativePath, "", "");  
      }
    });
  },
  
  createProjectByDroppingADirectory: function(evnt){ 
    evnt.preventDefault();
    directoryPath = evnt.dataTransfer.getData("text/uri-list");
    app.createProject(directoryPath.replace(/\/$/, '').split('/').last(), directoryPath, "", "");
  },
  
  createProject: function(name, projectDir, sassDir, cssDir) {
    Projects.save({
      name: name,
      projectDir: projectDir,
      sassDir: sassDir,
      cssDir: cssDir,
      environment: "development",
      outputStyle: "expanded"
    }, function(project){
      $('.projects').trigger(':changed');
      $('.project[data-key='+project.key+']').trigger(':select_and_configure');
    });
  },
  
  listProjects: function() {
    $('.projects').empty();
    Projects.all(function(projects) {
      $.each(projects, function(i, project){
        if(project) {
          // add project to project_list
          $.tmpl($("#project_template"), project).appendTo(".projects");
          // add project details pane
          if($('.project_details[data-key='+project.key+']').length == 0){
            $.tmpl($("#project_details_template"), project).appendTo("body");
          }
        }
      });
    });
  },
  
  nukeAllProjects: function(){
    Projects.all(function(projects) {
      $.each(projects, function(i, project){
        if(project){
          $('.project[data-key=' + project.key + ']').remove();
          $('.project_details[data-key=' + project.key + ']').remove();
        }
      });
    });
    Projects.nuke();
    $('.projects').trigger(':changed');
    $('.projects').trigger('processes:killAll');
    $('.project_details').hide();
    $('.non_selected').show();
  },
  
  viewProjectConfiguration: function() {
    $('.pane.project_details').show();
    $('.pane.project_details').addClass('configure');
    $('.pane.project_details').removeClass('log');
  },

  viewProjectLog: function() {
    $('.pane.project_details').show();
    $('.pane.project_details').removeClass('configure');
    $('.pane.project_details').addClass('log');
  }
  
};

// UI stuff
$(document).ready(function() {

  
  $.tmpl($('#colorize_template'));
  $.tmpl($('#project_template'));
  $.tmpl($('#project_details_template'));
    
  // create new project
  $('.option.add').live('click', app.delegateTo('createProjectBySelectingDirectory'));
  
  $('.content').live('drop', app.createProjectByDroppingADirectory);
  $('.projects').live(':changed', app.listProjects);
  
  $('.project').live(':started', projectStarted);
  $('.project').live(':stopped', projectStopped);
  $('.project').live(':select', selectProject);
  $('.project').live(':select_and_configure', selectProjectConfiguration);
  
  $('.project_details').live(':newLogOutput', updateProjectLog);
  
  $('.modes .mode.configure').live('click', app.viewProjectConfiguration);
  $('.modes .mode.log').live('click', app.viewProjectLog);
  
  // start/stop project
  $('.project .start').live('click', startWatchingProject);
  $('.project .stop').live('click', stopWatchingProject);
  
  $('.select_sass_dir').live('click', selectInputBySelectingDirectory);
  $('.select_css_dir').live('click', selectOutputBySelectingDirectory);
  $('.project_details .delete').live('click', deleteProject);
  
  $('.project .item').live('click', function() {
    key = $(this).parents('.project:first').attr('data-key');
    $('.project_details').hide();
    $('.project_details[data-key='+key+']').show();
    $(this).parents('.project:first').trigger(':select');
  });
  
  $('#nuke').live('click', app.delegateTo('nukeAllProjects'));
  
  function updateProjectLog(evnt, data) {
    var key = $(this).attr('data-key');
    $('.project_details[data-key='+key+'] .log_output').append(colorize(data.replace("\n", "<br />")));
  }
  
  function selectProject() {
    $('.project').removeClass('selected');
    $(this).addClass('selected');
  }

  function selectProjectConfiguration(){ 
    $(this).trigger(":select");
    app.viewProjectConfiguration();
  }
  
  var colors = {
    "33": "yellow",
    "32": "green",
    "31": "red",
    "0": ""
  }
  
  function colorize(string) {
    new_string = string.replace(/\033\[(\d+)m([^\033]+)\033\[0m/g, function(match, color, string, offset, original) {
      thing = $.tmpl($('#colorize_template'),  { color: colors[color], string: string }).html();
      return thing;
    });    
    return new_string.replace(/\033\[(\d+)m/g, '');
  }
  
  function startWatchingProject() {
    var project_container = $(this).parents('.project:first');
    key = project_container.attr('data-key');
    Projects.get(key, function(project) {
      setProjectState(project_container, "starting");
      project_container.trigger("watch:start", { project: project });
    });
    return false;
  }
  
  function stopWatchingProject(){
    var project_container = $(this).parents('.project:first');
    key = project_container.attr('data-key');
    Projects.get(key, function(project) {
      setProjectState(project_container, "stopping");
      project_container.trigger("watch:stop", { project: project });
    });
    return false;
  }
  
  function setProjectState(project, state){
    $(project).removeClass("starting")
      .removeClass("stopping")
      .removeClass("started")
      .removeClass("stopped")
      .addClass(state);
  };
  
  function projectStopped() {
    setProjectState(this, "stopped");
  }
  
  function projectStarted() {
    setProjectState(this, "started");
  }
  
  app.initialize();
});


function deleteProject() {
  key = $(this).parents('.project_details:first').attr('data-key');
  Projects.get(key, function(project) {
    Projects.remove(project);
  });
  $('.project[data-key='+key+']:first').trigger('watch:stop');
  $('.projects').trigger(':changed');
  
  $('.project_details').hide();
  $('.non_selected').show();
  
  return false;
}

function selectOutputBySelectingDirectory() {
  key = $(this).parents('.project_details:first').attr('data-key');
  Projects.get(key, function(project) {
    browseDirectories(project.projectDir, function(evnt){
      project.cssDir = evnt.target.nativePath;
      Projects.save(project);
      $('.project_details[data-key='+key+'] .css_dir').val(evnt.target.nativePath);
    });
  });
  return false;
}

function selectInputBySelectingDirectory() {
  key = $(this).parents('.project_details:first').attr('data-key');
  Projects.get(key, function(project) {
    browseDirectories(project.projectDir, function(evnt){
      project.sassDir = evnt.target.nativePath;
      Projects.save(project);
      $('.project_details[data-key='+key+'] .sass_dir').val(evnt.target.nativePath);
    });
  });
  return false;
}


function browseDirectories(initialPath, callback) {
  var directory = new air.File(initialPath);
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
