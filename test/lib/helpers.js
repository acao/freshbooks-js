(function() {
  
  "use strict";
  var fs = require("fs");
  var freshbooks = require('../../freshbooks');
  
  try {
    var jsonstr = fs.readFileSync('./.config.json');
    var jdata = JSON.parse(jsonstr);
    freshbooks.config.update(jdata);
  } catch(e) {
    console.log("Error", e);
    throw "config required";
  }

  // export methods, we can doctor up whatever is needed here
  for(var k in freshbooks) {
    exports[k] = freshbooks[k]
  }

  
})();
