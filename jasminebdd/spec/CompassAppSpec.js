function createProjectBySelectingDirectory(callback){
  createProjectFromFolder("project-a", "/some/path/project-a", "");
};

describe("Compass App", function(){
  beforeEach(function() {
    // stub
    projects.nuke();
    listProjects();
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
      projects.get($(".project:last").attr("data-key"), function(project){
        expect(project.name).toBe("project-a"); 
      });
    });
    
    it("displays the configuration after adding the project", function(){
      $(".option.add").click();
      expect($(".project:last").children(".config:visible").length).toBe(1);
    });
  });
  

});
