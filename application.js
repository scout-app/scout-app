$(document).ready(function() {
  var target = document.getElementById('watchtarget');
  target.addEventListener("dragenter", dragEnterOverHandler);
  target.addEventListener("dragover", dragEnterOverHandler);
  target.addEventListener("drop", watchDropHandler);
  
  // var target = document.getElementById('sass-target');
  // target.addEventListener("dragenter", dragEnterOverHandler);
  // target.addEventListener("dragover", dragEnterOverHandler);
  // target.addEventListener("drop", sassDropHandler);
});

// function dragStartHandler(event){         
//   event.dataTransfer.effectAllowed = "copy"; 
// } 
// 
// function dragEndHandler(event){ 
//   //air.trace(event.type + ": " + event.dataTransfer.dropEffect); 
// } 
// 
function dragEnterOverHandler(event){ 
  event.preventDefault(); 
}

// function sassDropHandler(event) { 
//   var config = new Lawnchair("config");
//   var settings = {sass_executable: event.dataTransfer.getData("text/uri-list")};
//   config.save(settings);
// }

function watchDropHandler(event) { 
// for(var prop in event){ 
//   air.trace(prop + " = " + event[prop]); 
// }

// air.trace(event.dataTransfer); 

  $('#watchtarget').append('<p>Folder found!'+event.dataTransfer.getData("text/uri-list")+'</p>');

// file://localhost/Users/rmontgomery429/Projects/compassapp/sass/
// need to remove file:://localhost and the trailing slash/



// var row = document.createElement('tr'); 
// row.innerHTML = "<td>" + event.dataTransfer.getData("text/uri-list") + "</td>" + 
//   "<td>" + event.dataTransfer.getData("application/x-vnd.adobe.air.file-list") + 
//   "</td>";

// $("emptyRow").parent(); // emptyRow.parentNode; 
// parent.insertBefore(row, emptyRow);
    
  // if(air.NativeProcess.isSupported) {
  //    var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
  //    var file = air.File.applicationDirectory.resolvePath("sass");
  //    nativeProcessStartupInfo.executable = file;
  // 
  //      
  //        var processArgs = new air.Vector["<String>"]();
  //        processArgs.push("--watch <folder>");
  //        nativeProcessStartupInfo.arguments = processArgs;
  //      
  //    process = new air.NativeProcess();
  // 
  //    process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, onOutputData);
  //    process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, onErrorData);
  //    process.addEventListener(air.NativeProcessExitEvent.EXIT, onExit);
  //    process.addEventListener(air.IOErrorEvent.STANDARD_OUTPUT_IO_ERROR, onIOError);
  //    process.addEventListener(air.IOErrorEvent.STANDARD_ERROR_IO_ERROR, onIOError);
  // 
  //    process.start(nativeProcessStartupInfo);
  //  }
//     
// var imageCell = document.createElement('td'); 
// if((event.dataTransfer.types.toString()).search("image/x-vnd.adobe.air.bitmap") > -1) { 
//     imageCell.appendChild(event.dataTransfer.getData("image/x-vnd.adobe.air.bitmap")); 
// } 
// row.appendChild(imageCell); 
}

function onOutputData()
{
  air.trace("Got: ", process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable)); 
}

function onErrorData(event)
{
  air.trace("ERROR -", process.standardError.readUTFBytes(process.standardError.bytesAvailable)); 
}

function onExit(event)
{
  air.trace("Process exited with ", event.exitCode);
}

function onIOError(event)
{
  air.trace(event.toString());
}