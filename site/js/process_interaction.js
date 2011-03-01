$(function(){
  var process_map = {};
  
  $(".project").live("watch:start", startWatchingProject);
  $(".project").live("watch:stop", stopWatchingProject);
  $(".projects").live("processes:killAll", killWatchingProcesses);  
  air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, killWatchingProcesses);
  
  function startWatchingProject(evnt, data) {
    var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
    
    if(air.Capabilities.os.match(/Windows/)) {
      nativeProcessStartupInfo.executable = air.File.applicationDirectory.resolvePath("vendor/jruby-1.6.0.RC2/bin/jruby.exe");
    } else {
      nativeProcessStartupInfo.executable = air.File.applicationDirectory.resolvePath("vendor/jruby-1.6.0.RC2/bin/jruby");
    }
    
    var processArgs = new air.Vector["<String>"]();
    processArgs.push("-S", "compass", "watch", "--sass-dir", data.project.sassDir, "--css-dir", data.project.cssDir, "--environment", data.project.environment, "--output-style", data.project.outputStyle, "--trace");
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
      process.exit();
      delete process_map[project_key];
      $('.project[data-key='+project_key+']').trigger(':stopped');
    }
  }
  
  function killWatchingProcesses(){
    for (var i in process_map) {
      process_map[i].exit();
    }
  }
  
});