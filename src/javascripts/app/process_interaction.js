$(function(){
  var process_map = {};

  $(".project").live("watch:start", startWatchingProject);
  $(".project").live("watch:stop", stopWatchingProject);
  $(".projects").live("processes:killAll", killWatchingProcesses);
  air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, killWatchingProcesses);

  function startWatchingProject(evnt, data) {
    var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
    nativeProcessStartupInfo.executable = javaDir();

    var processArgs = new air.Vector["<String>"]();
    processArgs.push(
      '-jar', jruby_complete_jar(),
      // '-r' + jar('vendor/scout.jar'),
      '-S',
      compassExecutable(),
      "watch",
      data.project.projectDir,
      "--require", "ninesixty",
      "--require", "yui",
      "--require", "compass-h5bp",
      "--sass-dir", data.project.sassDir,
      "--css-dir", data.project.cssDir,
      "--images-dir", data.project.imagesDir,
      "--javascripts-dir", data.project.javascriptsDir,
      "--environment", data.project.environment,
      "--output-style", data.project.outputStyle,
      "--trace"
    );
    
    if(data.project.configFile){
      processArgs.push("--config", data.project.configFile);
    }
    
    //air.trace(processArgs);
    nativeProcessStartupInfo.arguments = processArgs;

    process = new air.NativeProcess();
    process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, outputDataHandler);
    process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, errorDataHandler);
    process.addEventListener(air.NativeProcessExitEvent.EXIT, onExit);
    process.start(nativeProcessStartupInfo);

    $('.project[data-key='+data.project.key+']').trigger(':started');

    function onExit(evnt) {
      $('.project[data-key='+data.project.key+']').trigger('watch:stop');
    }

    function outputDataHandler(evnt) {
      var bytes = process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable);
      $('.project_details[data-key='+data.project.key+']').trigger(':newLogOutput', bytes.toString());
    }

    function errorDataHandler(evnt) {
      var bytes = process.standardError.readUTFBytes(process.standardError.bytesAvailable);
      $('.project_details[data-key='+data.project.key+']').trigger(':newLogOutput', bytes.toString());
    }

    process_map[data.project.key] = process;
  }

  function stopWatchingProject(evnt, data) {
    var project_key = $(this).attr('data-key');
    var process = process_map[project_key];
    
    if(process){
      stopProcess(process);
      delete process_map[project_key];
      $('.project[data-key='+project_key+']').trigger(':stopped');
    }
  }

  function killWatchingProcesses() {
    for (var i in process_map) {
      stopProcess(process_map[i]);
    }
  }
  
  function stopProcess(process){
    var forcibly_exit = true;
    process.exit(forcibly_exit);
  }

  function compassExecutable() {
    return air.File.applicationDirectory.resolvePath('bin/compass').nativePath;
  }

  function jruby_complete_jar() {
    return air.File.applicationDirectory.resolvePath('vendor/jruby-complete.jar').nativePath;
  }

  function jar(path) {
    // air.trace(path);
    // var app_path = air.File.applicationDirectory.resolvePath('.');
    // air.trace(app_path);
    // var jar_path = air.File.applicationDirectory.resolvePath(path);
    // air.trace(jar_path);
    // air.trace(app_path.getRelativePath(jar_path));
    // return app_path.getRelativePath(jar_path);
    return air.File.applicationDirectory.resolvePath(path).nativePath;
  }

  function javaDir() {
    if(air.Capabilities.os.match(/Windows/)) {
      path = air.File.applicationDirectory.resolvePath("C:\\Program Files\\Java\\jre7\\bin\\java.exe");
      if(!path.exists){
        path = air.File.applicationDirectory.resolvePath("C:\\Program Files (x86)\\Java\\jre7\\bin\\java.exe");
        if(!path.exists){
          path = air.File.applicationDirectory.resolvePath("C:\\Program Files\\Java\\jre6\\bin\\java.exe");
        }
      }
      return path;
    } else {
      return air.File.applicationDirectory.resolvePath("/usr/bin/java");
    }
  }

});
