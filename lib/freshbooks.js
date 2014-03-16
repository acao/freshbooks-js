/**
  filename: freshbooks.js
  author: grgory tomlinson
  copyright: 2014 gregory tomlinson
*/
var freshbooks;
(function(definintion) {

  if (typeof exports == 'object' && typeof module == 'object') {
    // CommonJS/Node
    return definition(require, exports, module);
  }
  if (typeof define == 'function') {
    //AMD or Other
    return define.amd ? define(['require', 'exports'], definition) : define('freshbooks', definition);
  }
  definition(function() {}, freshbooks = {});

})(function(require, freshbooks) {
  "use strict";
  console.log("foo!")
});