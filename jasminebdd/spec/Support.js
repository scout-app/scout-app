
Function.prototype.stub = function(){
  var original_fn = this;
  var stubs = this.jasmineStubs = jasmine.util.argsToArray(arguments);
  var num_times_called = 0;

  return function(){
    var fn;
    num_times_called++;
    if(num_times_called > stubs.length){
      fn = stubs[stubs.length-1];
    } else {
      fn = stubs[num_times_called];
    }
    fn.apply(this, arguments);
  };
}
