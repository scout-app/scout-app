var context = function(description, specDefinitions) {
  return jasmine.getEnv().describe(description, specDefinitions);
};

function wait(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); } 
  while(curDate-date < millis);
}

describe("Compass App", function(){
  beforeEach(function() {
    // stubs
    app.createProjectBySelectingDirectory = function(callback){
      app.createProject("project-a", "/some/path/project-a", "");
    };
    app.nukeAllProjects();
  });
  
  context("with no projects", function(){
    it("lists no projects", function(){
      expect($(".project").length).toBe(0);
    });
  });
  
  describe("adding a project", function(){
    it("adds the project to the list", function(){
      $(".option.add").click();
      expect($(".project:visible").length).toBe(1);
    });
    
    it("sets the project name to the folder name", function(){
      $(".option.add").click();
      Projects.get($(".project:last").attr("data-key"), function(project){
        expect(project.name).toBe("project-a"); 
      });
    });
    
    it("displays the configuration after adding the project", function(){
      $(".option.add").click();
      var project = $(".project:last");
      var visible_project_details = $(".project_details[data-key=" + project.attr('data-key') + "]:visible");
      expect(visible_project_details.length).toBe(1);
    });
  });
  
  describe("adding multiple projects", function(){
    beforeEach(function(){
      Projects.save({name: 'project-a'});
      app.listProjects();
    });
    
    it("lists both projects", function(){
      app.createProjectBySelectingDirectory = function(callback){
        app.createProject("project-b", "/some/path/project-b", "");
      };
      $(".option.add").click();
      expect($(".project:visible").length).toBe(2);
    });
  });
  
  describe("switching between projects", function(){
    beforeEach(function(){
      app.createProject("project-a", "/project-a/sass", "project-a/css");
      app.createProject("project-b", "/project-b/sass", "project-b/css");
      app.listProjects();
    });
    
    context("when viewing project a and the log is selected", function() {
      beforeEach(function(){
        $(".project:contains('project-a') .source").click();
        $(".project_details:visible .mode.log").click();
      });

      it("keeps the log selected when switching to project b", function() {
        var project = $(".project:contains('project-b')");
        project.find(".source").click();
        var visible_project_details = $(".project_details.log[data-key=" + project.attr('data-key') + "]:visible");
        expect(visible_project_details.length).toBe(1);
      });
    });
    
    context("when viewing project a and the configuration is selected", function() {
      beforeEach(function(){
        $(".project:contains('project-a') .source").click();
        $(".project_details:visible .mode.configure").click();
      });

      it("keeps the configuration selected when switching to project b", function() {
        var project = $(".project:contains('project-b')");
        project.find(".source").click();
        var visible_project_details = $(".project_details.configure[data-key=" + project.attr('data-key') + "]:visible");
        expect(visible_project_details.length).toBe(1);
      });
    });    
  });

  describe("watching a project", function(){
    beforeEach(function(){
      var project_dir = air.File.createTempDirectory(),
        project_path = project_dir.nativePath,
        sass_dir = project_dir.resolvePath("sass"),
        css_dir = project_dir.resolvePath("css");
      app.createProject("project-a", css_dir.nativePath, sass_dir.nativePath);
      app.listProjects();
    });
    
    it("outputs that compass started to the log", function(){
      var project = $(".project:contains('project-a')");
      project.find(".source").click();
      
      var verified_logged_output = false; 
      
      
      project.find("a.play").click();
      $(".project_details:visible .mode.log").click();

      // after("receiving a notification from jquery that compass has output", function(){
      //   // this will be called every 1000 until it returns true
      // }, function() {
      //   it("verifies that the log has a message", function() {
      //     // then continue wth this
      //   });
      // }, 1000);

      // var verified_logged_output = false; 
      // for (var i=0; i < 5; i++) {
      //   wait(1000);
      //   expected_output = $(".project_details:visible .log_output:contains('compass')");
      //   if(expected_output.length > 0) {
      //     verified_logged_output = true;
      //     break;
      //   }
      // };
      //     
      // expect(verified_logged_output).toBe(true);          
      
      var spec = this;
      setTimeout(function(){
        try {
          throw "failure";
        } catch(e) {
          spec.fail(e);
          
        }
        expect(verified_logged_output).toBe(true);
        air.Introspector.Console.log('end of setTimeout');
      }, 5000);
      
      //wait(5000); // give compass time to spin up
    });
  });
  


});
