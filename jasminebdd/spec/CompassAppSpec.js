var context = function(description, specDefinitions) {
  return jasmine.getEnv().describe(description, specDefinitions);
};


describe("Compass App", function(){
  beforeEach(function() {
    // stubs
    app.createProjectBySelectingDirectory = function(callback){
      app.createProject("project-a", "/some/path/project-a", "");
    };
    app.nukeAllProjects();
  });
  
  describe("with no projects", function(){
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
        $(".project_details .mode.log:visible").click();
      });

      it("keeps the log selected when switching to project b", function() {
        var project = $(".project:contains('project-b')");
        project.find(".source").click();
        var visible_project_details = $(".project_details.log[data-key=" + project.attr('data-key') + "]:visible");
        expect(visible_project_details.length).toBe(1);
      });
    });
    
  });

});
