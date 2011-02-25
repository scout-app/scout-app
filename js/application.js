Array.prototype.last = function() {return this[this.length-1];}

var Projects = new Lawnchair({adaptor: 'air', table: "projects"});

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
    browseDirectories(function(evnt) {
      app.createProject(evnt.target.nativePath.replace(/\/$/, '').split('/').last(), evnt.target.nativePath, "");  
    });
  },
  
  createProjectByDroppingADirectory: function(evnt){ 
    evnt.preventDefault();
    app.createProject(evnt.dataTransfer.getData("text/uri-list").replace(/\/$/, '').split('/').last(), "", "");
  },
  
  createProject: function(name, sassDir, cssDir) {
    Projects.save({
      name: name,
      sassDir: sassDir,
      cssDir: cssDir,
      environment: "development",
      outputStyle: "expanded"
    });
    $('.projects').trigger(':changed');
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
  
  $('.project_details').live(':newLogOutput', updateProjectLog);
  
  $('.modes .mode').live('click', toggleMode);
  
  // start/stop project
  $('.project .play').live('click', toggleWatch);
  $('.project .stop').live('click', toggleWatch);
  
  $('.select_sass_dir').live('click', selectInputBySelectingDirectory);
  $('.select_css_dir').live('click', selectOutputBySelectingDirectory);
  $('.project_details .delete').live('click', deleteProject);
  
  $('.project .source').live('click', function() {
    key = $(this).parents('.project:first').attr('data-key');
    $('.project_details').hide();
    $('.project_details[data-key='+key+']').show();
  });
  
  $('#nuke').live('click', app.delegateTo('nukeAllProjects'));
  
  function updateProjectLog(evnt, data) {
    var key = $(this).attr('data-key');
    $('.project_details[data-key='+key+'] .log_output').append(colorize(data.replace("\n", "<br />")));
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
  
  function toggleMode() {
    $('.pane.project_details').toggleClass('configure');
    $('.pane.project_details').toggleClass('log');
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
  browseDirectories(function(evnt){
    Projects.get(key, function(project) {
      project.cssDir = evnt.target.nativePath;
      Projects.save(project);
    });
    $('.project_details[data-key='+key+'] .css_dir').val(evnt.target.nativePath);
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
    $('.project_details[data-key='+key+'] .sass_dir').val(evnt.target.nativePath);
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
