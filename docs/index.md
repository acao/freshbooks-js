

# Freshbooks-js

All methods are implemented, see the Freshbooks API. 
Access a given endpoint, such as ```system.current```
via ```freshbooks.system.current```

The project relies on JavaScript generators
to provide a simple interface that makes it simple
to stitch data together returned from asynchronous
API results.

All Freshbooks remote endpoints are implemented as functions
and generated dynamically. See the examples for implementation 
details.

See the Freshbooks API [docs](http://developers.freshbooks.com/)
for a complete list of available methods.

## Simple Example JavaScript

```javascript
var freshbooks = require("freshbooks-js");
var co = require("co");

// set authentication data
freshbooks.config.update({
	subdomain:"yourname.freshbooks.com",
	token:"token_here"
});

co(function*() {
	var sysdata = yield freshbooks.system.current(null,{basic_auth:true});
	console.log("System data %j", sysdata);
})();

```


The project, Freshbooks-js, dynamically creates
all methods using the ```Freshbooks.methods``` list.


## Complex Example JavaScript

Create a new category, add an expense
to that category, append a string to 
an expense note, delete the expense.


```javascript
var freshbooks = require("freshbooks-js");
var co = require("co");

freshbooks.config.update({
	subdomain:"yourname.freshbooks.com",
	token:"token_here"
});

co(function*() {

	var category = yield freshbooks.category.create({
		name:"Super Test"
	},{basic_auth:true});
	var expense = yield.freshbooks.expense.create({
		category_id:data.json.response.category_id,
		amount:"19.95",
		note:"Initial note value"
	},{basic_auth:true});

	var expense_update = yield freshbooks.expense.update({
		expense_id:expense.json.response.expense_id,
		note:expense.json.response.note + "Append this value"
	},{basic_auth:true});

	var expense_get = yield freshbooks.expense.get({
		expense_id:expense.json.response.expense_id		
	},{basic_auth:true});

	var expense_delete = yield freshbooks.expense.delete({
		expense_id:expense.json.response.expense_id			
	},{basic_auth:true});

	return [category,
			expense,
			expense_update,
			expense_get,
			expense_delete];
	
})();
```

You can find additional examples in the [Mocha tests](https://github.com/gregory80/freshbooks-js/blob/master/test/main.js)

## Pagination Support

This module transparently provides support for pagination when using `list` methods.  All you need to do is pass the pagination parameters in the request body as freshbooks expects.

For Example:

```javascript
yield freshbooks.project.list({page:2,per_page:42},{basic_auth:true})
```
Would yield the 2nd page of results at 42 results per page.

The page, total number of pages, and total number of items should be available in the response json.

While more could be done to make the pagination metadata more accessible, and to provide helper functions (or examples) for easing up the process of paging, you can already do everything you need to get started.

Read more in the [Freshbooks Pagination Docs](http://developers.freshbooks.com/pagination/)


## Freshbooks.Model

Responses from the freshbooks API are wrapped in basic ```new freshbooks.Model```.
This provides a basic API to JSON/xml data and status, as well as a ```.get()``` 
convenience method to allow simple access to nested attributes.

```javascript
var m = new Model({
	req:"outgoing xml string",
	response:{ ... },
	xml:"original xml string",
	json:{
		response:{
			status:"ok",
			client_id:"some_client_id"
		}
	}
});
m.get("client_id");
"some_client_id"
m.status
m.json
m.xml
m.req
```

### Source Code
[github.com/gregory80/freshbooks-js](https://github.com/gregory80/freshbooks-js)

### Bugs

You can file issues [here](https://github.com/gregory80/freshbooks-js/issues)


Enjoy

[gt](http://twitter.com/gregory80)
