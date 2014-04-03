// mocha

(function() {
  "use strict";
  
  var expect = require('expect.js');
  var freshbooks = require('./lib/helpers');
  var thunkify = require('thunkify');
  var request = require('request');
  var post = thunkify(request.post); 


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

  describe('Setup and Config:', function() {

    it('Has a subdomin to test with', function() {
      expect(freshbooks.config.subdomain).to.be.a('string');


    });     
    it('has a method to set auth info', function() {
      expect(freshbooks.config.update).to.be.a('function');
    });
    // it('Has an api url')
  });

  describe('The API methods', function() {
    it('has a function for every freshbooks.methods item', function() {
      for(var i=0,len=freshbooks.methods.length; i<len; i++) {
        expect( get_deep_value(freshbooks, freshbooks.methods[i]) ).to.be.a('function');  
      }
    });
  });  

  /**
    TODO, 

    1. ensure parsed JSON response matches to random sample
    1. add DOM / xpath methods for checking XML against JSON

  */

describe("Connections to system", function() {  

  var data;
  var data1;
  before(function*() {

    data = yield freshbooks.system.current(null, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

    data1 = yield freshbooks.api.open("system.current", null, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
  });

  it("should connect to the system endpoint", function*() {
    console.log("data", data.json);
    expect(data.status).to.be("ok");
    expect(data.json.response.system.company_name).to.equal(data1.json.response.system.company_name)
    // console.log("system() %j", data && data.json);
  });



});


describe("Test update expense", function() {
  var data2;
  var category;
  var expenses;
  var expense_id;
  before(function*(){
    category = yield freshbooks.category.create({
      name:"test update expense, category " + (1000*Math.random())
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });    
    yield freshbooks.expense.create({
      staff_id:1,
      amount:25.55,
      notes:"Test amount",
      category_id:category.get("category_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });    
    expenses = yield freshbooks.expense.list(null, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    // console.log("expenses %j", expenses.json)
    expense_id = expenses.get("expenses").expense[0].expense_id;
    // console.log("expense_id", expense_id)
    var data1 = yield freshbooks.expense.get({
      expense_id:expense_id
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    data2 = yield freshbooks.expense.update({
      expense_id:expense_id,
      notes:data1.json.response.note + "This is an updated value"
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    // console.log("Results", data1.json, data2.json);
      
  });

  it("modify the note field",function*(){
    expect(expense_id).to.be.ok();
    // console.log(data2.get("note"), "", expenses);
  });

});



describe("Connections to expenses", function() {  
  var data;
  var expense;
  var category;
  var expense_get;
  var expense_delete;
  var expense_update;
  var expense_list;
  before(function*() {

    category = yield freshbooks.category.create({
      name:"test category " + (1000*Math.random())
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    // console.log("category.json", category.json)
    
    // need to get a staff id
    expense = yield freshbooks.expense.create({
      staff_id:1,
      amount:25.55,
      notes:"Test amount",
      category_id:category.get("category_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    // console.log("expense.json", expense.json);
    expense_get = yield freshbooks.expense.get({
      expense_id:expense.get("expense_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

    expense_list = yield freshbooks.expense.list(null, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    expense_update = yield freshbooks.expense.update({
      expense_id:expense.get("expense_id"),
      notes:"This is an updated amout"
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

    expense_delete = yield freshbooks.expense.delete({
      expense_id:expense.get("expense_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

  });

  it("should have a category id b/c expenses require it.", function*() {
    expect(category.get("category_id")).to.equal( category.get("category_id") );
  });
  it("should connect to the expense list endpoint", function*() {
    expect(expense_list.status).to.be("ok");
  });
  it("should connect to the expense_update endpoint", function*() {
    expect(expense_update.status).to.be("ok");
  });
  it("should connect to the expense_get endpoint", function*() {
    expect(expense_get.status).to.be("ok");
  });  

  it("should connect to the expense_delete endpoint", function*() {
    expect(expense_delete.status).to.be("ok");
  }); 

  it("should create a new expense via the expense endpoint", function*() {
    expect(expense.status).to.be("ok");
    expect(expense.get("expense_id")).to.be.a("number");
  }); 

});

describe("During a connection to the estimate endpoint", function() {  
  var estimate;
  var client;
  var estimate_get;
  var estimate_delete;
  var client_delete;
  var send_email;
  var estimate_list;
  before(function*() {

    client = yield freshbooks.client.create({
      email:"username@example.com"
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    // console.log("client", client.json.response, client.get("client_id"));
    estimate = yield freshbooks.estimate.create({
      client_id:client.get("client_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
    // console.log("estimate", estimate.json, estimate.status)
    estimate_get = yield freshbooks.estimate.get({
      estimate_id:estimate.get("estimate_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

    estimate_list = yield freshbooks.estimate.list(null, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

    send_email = yield freshbooks.estimate.sendByEmail({
      estimate_id:estimate.get("estimate_id")
      // email:"gregory.tomlinson@gmail.com"
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    })

    estimate_delete = yield freshbooks.estimate.delete({
      estimate_id:estimate.get("estimate_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

    client_delete = yield freshbooks.client.delete({
      client_id:client.get("client_id")
    }, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });

  });

  it("allows a new client to be created", function*() {
    // console.log("client %j", client.json, client.status)
    expect(client.status).to.equal("ok");
    expect(client.get("client_id")).to.be.ok();
  });

  it("estimate_get", function*() {
    // console.log("%j", estimate_get && estimate_get.json.response);
    expect(estimate_get.get("estimate").estimate_id).to.equal( estimate.get("estimate_id") );
  });

  it("should send and email via sendByEmail endpoint", function*() {
    expect(send_email.status).to.be("ok");
  });

  it("should connect via estimate_list endpoint", function*() {
    expect(estimate_list.status).to.be("ok");
  });  


  it("should connect via client_delete endpoint", function*() {
    expect(client_delete.status).to.be("ok");
  });

  it("should connect via estimate_delete endpoint", function*() {
    expect(estimate_delete.status).to.be("ok");
  });

  it("should connect via estimate_get endpoint", function*() {
    expect(estimate_get.status).to.be("ok");
  });  




});


describe("Connection to the payment gateway", function() {  
  var data;
  
  before(function*() {
    data = yield freshbooks.gateway.list(null, {
      basic_auth:true,
      subdomain:freshbooks.config.subdomain
    });
  });

  it("should connect to the gateway endpoint", function*() {
    // console.log("gateway.list() %j", data && data.json.response);
  });

});


// describe("Cleanup", function() {
//   var clients;
//   var resps;

//   before(function*() {
//     clients = yield freshbooks.client.list;
//     resps = [];
//     console.log(clients.get("clients"), "clients.json.")
//     for(var i=0, len=clients.get("clients").length; i<len; i++) {
//       var item = clients.get("clients")[i];
//       console.log("item", item)
//       var clientd = yield freshbooks.client.delete({
//         client_id:item.client_id
//       });
//       resps.push(clientd);          
//     }

//   })  
//   it("Had clients", function* (){
//     // console.log("clients.get("clients")", clients.get("clients"))
//     expect(clients.get("clients").length===0).to.be(true)
//   });

// })


})();
