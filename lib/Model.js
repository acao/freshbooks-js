

var freshbooks;
(function(definition) {

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
  
  var xml2json = require('xml2json');  
  freshbooks.Model = function(data) {

    data||(data={});
    data.json = xml2json.toJson(data.xml, {
      object:true
    }); 

    // post process, "fix" the data
    // var fnc = post_processors[data.method_key];
    // data.json = fnc && fnc.call(this, data.method_key, data.json) || data.json;

    this.method_key = data.method_key;
    this.noun = data.noun;
    this.verb = data.verb;

    if(data.verb === 'list') {
      data.json = process_lists(data.method_key, data.json);
    }

    this.xml = data.xml;   

    Object.defineProperty(this, "json", {
      get:function() {
        return data.json;
      }
    }); 
    Object.defineProperty(this, "req", {
      get:function() {
        return data.request_data;
      }
    });
    Object.defineProperty(this, "status", {
      get:function() {
        return data.json.response.status || "fail";
      }

    });
    // this  
    this.get=function(name) {
      return data.json.response[name];
    }    
  }

  // post process, ensure .list always return arrays
  // and not just when there are >1 object
  // .arrayNotation for all variables it too tedious
  function process_lists(method_key, data) {
    // console.log("method_key", method_key,  data);
    // should ALWAWY be an array expenses.expense
    var noun,verb,items,plural_noun;
    {
      let splitted = method_key.split(".");
      noun = splitted && splitted[0];
      verb = splitted && splitted[1];
    }    
    // time_entries violates hack rules
    // anything that ends if "Y"?
    switch(noun) {
      case "time_entry":
        plural_noun = "time_entries";
        break;

      case "tax":
        plural_noun = "taxes";
        break;

      case "staff":
        plural_noun = "staff_members";
        noun = "member";
        break;

      default:
        plural_noun = noun + "s";
        break;
    }

    items = data.response && data.response[plural_noun] && data.response[plural_noun][noun];
    if(items) {
      if(! (items instanceof Array) ) {
        data.response[plural_noun][noun] = [items];
      }
    } else {
      data.response[plural_noun] || (data.response[plural_noun]={});
      data.response[plural_noun][noun] = [];
    }

    return data;
  }  

});