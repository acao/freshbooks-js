/**
  
  filename: freshbooks.js
  author: grgory tomlinson
  copyright: 2014 gregory tomlinson
  https://github.com/gregory80/freshbooks-js

  An ES Harmony, ECMAScript 6, exploration
  of the Freshbooks API for NodeJS

*/
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
  
  // address short comings in node 0.11.12+
  require("es6-shim");

  var post,methods,method_proxy;
  
  // not all libraries are ecmascript 6 ready
  var thunkify = require('thunkify');
  var Model = require("./Model").Model;
  // console.log("Model", Model);
  
  var request = require('request');
  // i/o OUTPUT for json=>XML
  var js2xmlparser = require("js2xmlparser");
  // i/o INPUT for XML=>json
  // var xml2json = require('xml2json');
  var oauth = require('oauth-sign');
  var uuid = require('node-uuid');
  post = thunkify(request.post); 
  /**
    Endpoint defintions list
      http://developers.freshbooks.com/
  */    
  methods = freshbooks.methods = [

    /***
      available callbacks: 
      http://developers.freshbooks.com/docs/callbacks/#events

      Tips:
      http://developers.freshbooks.com/api-tips/

      http://community.freshbooks.com/addons/submit
      regexp:subdomain = /(?:https?://)?([^.]+?)(?:[.](?:freshbooks|billingarm)[.]com)?/i

    */
    "callback.create",
    "callback.verify",
    "callback.resendToken",
    "callback.list",
    "callback.delete",

    "category.create",
    "category.update",
    "category.get",
    "category.delete",
    "category.list",

    "client.create",
    "client.update",
    "client.get",
    "client.delete",
    "client.list",

    "estimate.create",
    "estimate.update",
    "estimate.get",
    "estimate.delete",
    "estimate.list",
    "estimate.sendByEmail",

    "expense.create",
    "expense.update",  
    "expense.get",
    "expense.delete",
    "expense.list",

    "gateway.list",

    "invoice.create",
    "invoice.update",
    "invoice.get",
    "invoice.delete",
    "invoice.list",
    "invoice.sendByEmail",
    "invoice.sendBySnailMail",
    "invoice.lines.add",
    "invoice.lines.delete",
    "invoice.lines.update",

    "item.create",
    "item.update",
    "item.get",
    "item.delete",
    "item.list",

    "language.list",

    "payment.create",
    "payment.update",
    "payment.get",
    "payment.delete",
    "payment.list",

    "project.create",
    "project.update",
    "project.get",
    "project.delete",
    "project.list",

    "receipt.create",
    "receipt.update",
    "receipt.get",
    "receipt.delete",

    "recurring.create",
    "recurring.update",
    "recurring.get",
    "recurring.delete",
    "recurring.list",
    "recurring.lines.add",
    "recurring.lines.delete",
    "recurring.lines.update",

    "staff.current",
    "staff.get",
    "staff.list",

    "system.current",

    "task.create",
    "task.update",
    "task.get",
    "task.delete",
    "task.list",

    "tax.create",
    "tax.update",
    "tax.get",
    "tax.list",
    "tax.delete",
    "time_entry.create",
    "time_entry.update",
    "time_entry.get",
    "time_entry.delete",
    "time_entry.list"
    
  ];



  /**
    
    Declare external methods
      
  */
  methods.forEach(function(method_string_name,idx) {
    set_deep_value( freshbooks,
                    method_string_name,
                    remote_connection_wrapper(method_string_name, {
                      basic_auth:false
                    })
                  );
  });


  set_deep_value.call(this, freshbooks,"config.update", function(data) {

    data || (data={});
    delete data.update;
    // freshbooks.config.subdomain = data.subdomain;
    Object.assign(freshbooks.config, data);
    Object.defineProperty(freshbooks.config, "username", {
      get:function() {
        var matches = this.subdomain.match(/(?:https?:\/\/)?([^.]+)(?:[.](?:freshbooks|billingarm)[.]com)?/, "i");
        return matches && matches[1];
      }
    });

    // return freshbooks;
  });

  set_deep_value.call(this, freshbooks,"api.open",function(path, data, opts) {
    var args = Array.prototype.slice.call(arguments,1);
    data || (data={});
    var fnc = get_deep_value(freshbooks,path);
    return fnc && typeof fnc === "function" && fnc.apply(freshbooks,args);
  });

  
  function api_url(name) {
    return 'https://' + name + "/api/2.1/xml-in";
  }
  
  function build_oauth_str(token, token_secret) {
    var oa = {
      oauth_token:token,
      oauth_consumer_key:freshbooks.config.username,
      oauth_signature_method:"PLAINTEXT",
      oauth_signature:freshbooks.config.oauth_consumer_secret + "&" + token_secret,
      oauth_nonce:uuid().replace(/-/g, ''),
      oauth_timestamp:Math.floor( Date.now() / 1000 ).toString(),
      oauth_version:"1.0"

    }
    var authHeader = 'OAuth realm="",'+Object.keys(oa).map(function (i) {
      return i+'="'+oauth.rfc3986(oa[i])+'"'
    }).join(',');
    return authHeader;
  }  
   
  // http://stackoverflow.com/questions/13719593/javascript-how-to-set-object-property-given-its-string-name
  // TODO, support lists correctly
  function set_deep_value(obj, path, value) {

    if (typeof path === "string") {
      var path = path.split('.');
    }
    if(path.length > 1){
      var p=path.shift();
      if(obj[p]==null || typeof obj[p]!== 'object'){
        obj[p] = {};
      }
      set_deep_value(obj[p], path, value);
    } else {
      obj[path[0]] = value;        
    }
  }
  function get_deep_value(obj, path) {
    if(typeof path === "string") {
      path = path.split(".");
    }
    var p;
    while( p = path.shift() ) {
      obj = obj[p]
    }
    return obj;
  }  

  // for deprecated token connections (testing / development)
  function get_auth_data() {

    return {
      user:freshbooks.config.token,
      pass:"X"
    };    
  }

  method_proxy = Proxy.create({
    get:function(proxy,name) {
      return {
        "@":{
          method:name
        }
      }
    }
  });

  // Model = freshbooks.Model = 



  // returns a generator function
  function remote_connection_wrapper(method_key, _options) {
    if(!method_key) { throw "Method name required"; }
    _options || (_options={});

    return function *(data, opts) {
      data || (data={});
      opts || (opts={});
      var options = {};
      [_options,opts].reduce( Object.assign, options );

      var _url = api_url(freshbooks.config.subdomain);
      var xml_wrap = {}, 
          query_data_list,
          xml_req_body, 
          data, res, body,
          noun, verb;

      {
        let splitted = method_key.split(".");
        noun = splitted&&splitted[0];
        verb = splitted&&splitted[1];
      }

      /**
        When the method is .create or .update
        Freshbooks API requires an additional
        parent node that is the noun
        
        for example, if method  was
          category.create

          category:{
            category_id:"value"
          }

          .get, .current, .delete and .list do not share this
          behavior
      */      
      query_data_list = [method_proxy[method_key]];
      if(["create","update"].indexOf(verb) > -1) {
        {
          let xml_wrap = {};
          xml_wrap[noun] = data;
          query_data_list.push(xml_wrap);
        }
      } else {
        query_data_list.push(data);
      }
      //http://www.2ality.com/2014/01/object-assign.html 
      query_data_list.reduce(Object.assign, xml_wrap);  
      xml_req_body = js2xmlparser("request", xml_wrap);

      /**
        
        Actually connect to remote server
        yield  data, and pass to 
        XML => JSON processor

      */
      // console.log("xml_req_body", xml_req_body);
      var params = {
        url:_url,
        body:xml_req_body,
        headers:{
          'User-Agent': 'freshbooks-js'
        }
      }

      if(options.basic_auth) {
        params.auth = get_auth_data();        
      } else {
        params.headers.Authorization = build_oauth_str(options.oauth_token, options.oauth_token_secret);
        // oauth processing
        // check oauth pieces
      }

      Object.assign(params.headers, options.headers||{});
      // console.log("sending params", params);
      data = yield post(params);

      res = data && data[0];
      body = data && data[1];


      return new Model({
        method_key:method_key,
        noun:noun,
        verb:verb,
        xml:body,
        response:res,
        request_data:xml_req_body
      });
    }
  }

});
