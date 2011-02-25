$(function(){
  var process_map = {};
  
  $(".project").live("watch:start", startWatchingProject);
  $(".project").live("watch:stop", stopWatchingProject);
  $(".projects").live("processes:killAll", killWatchingProcesses);  
  air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, killWatchingProcesses);
  
  function startWatchingProject(evnt, data) {
    var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
    nativeProcessStartupInfo.executable = air.File.applicationDirectory.resolvePath("vendor/jruby-1.6.0.RC2/bin/jruby");

    var processArgs = new air.Vector["<String>"]();
    processArgs.push("-S", "compass", "watch", "--sass-dir", data.project.sassDir, "--css-dir", data.project.cssDir, "--environment", data.project.environment, "--output-style", data.project.outputStyle, "--trace");
    nativeProcessStartupInfo.arguments = processArgs;

    process = new air.NativeProcess();
    process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, outputDataHandler);
    process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, errorDataHandler);
    process.start(nativeProcessStartupInfo);

    //var bytes = new air.ByteArray();
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

  function stopWatchingProject(){
    var project_key = $(this).attr('data-key');
    var process = process_map[project_key];
    if(process){
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