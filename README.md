# Freshbooks JS

A NodeJS ES Harmony project. Provides a thin, semi-transparent
view of the Freshbooks API, masking XML as JSON.

The freshbooks API only returns XML and requires
XML for queries. This JS API tries hard to completely
abstract away the XML and provide
a JSON based interface.


## Status

[![NPM](https://nodei.co/npm/freshbooks-js.png)](https://nodei.co/npm/freshbooks-js/)
[![Dependency Status](https://david-dm.org/gregory80/freshbooks-js.png)](https://david-dm.org/gregory80/freshbooks-js)
[![devDependency Status](https://david-dm.org/gregory80/freshbooks-js/dev-status.png)](https://david-dm.org/gregory80/freshbooks-js#info=devDependencies)

In progress, basic connections and test coverage.

## Install

    npm install freshbooks-js


## Usage

A simple example that appends a string to an existing 
expense note.


1. Setup the subdomain and token and connection endpoint

        freshbooks.config.update({
            subdomain:"your_username.freshbooks.com",
            token:""
        });

1. Fetch an expense by ID and modify the notes field.

        co(function* () {
            var expenses = yield freshbooks.expense.list(null,{basic_auth:true});
            var expense_id = expenses.get("expenses").expense[0].expense_id; 
            var data1 = yield freshbooks.expense.get({
              expense_id:expense_id
            },{basic_auth:true});
            var data2 = yield freshbooks.expense.update({
              expense_id:data1.json.response.expense_id,
              notes:data1.json.response.note + "This is an updated value"
            },{basic_auth:true});
            console.log("Results", data1.json, data2.json);
        })();

## Documentation 

http://gregory80.viewdocs.io/freshbooks-js    


## Testing

You will need to [signup for freshbooks](https://gregorytomlinson.freshbooks.com/refer/www), it's free,
in order to properly test the API. 



Uses Mocha for testing via npm. To run test:

    npm test


## Project Goals

1. Leverage ES Harmony specific updates 


## TODO

1. fix tests around subdomain => oauth_consumer_key
1. the 'optional' items like oauth and subdomain arent optional, fix code to reflect this
    maybe freshbooks should be a function() that returns an instance, killing off config.update
    it should move the managing of credentials into the parent application where they originate

1. passing basic auth, oauth token etc is too tedious per method. allow me to create an instance
1. deprecate Object.assign in favor of deepcopy node.extend port, or consider lodash
1. consider using lodash
1. normalize response from lists / model items 
1. OAUTH
1. freshbooks oauth signature is 'PLAINTEXT' but request.oauth uses HMAC. Must extend / code around.
1. support pagination
1. submit (?) to https://github.com/visionmedia/co/wiki
1. submit to freshbooks (support@freshbooks.com)
1. consolidate xml2json and js2xmlparser for xml i/o
1. refactor test/main.js
1. fix staff_memebers/members as non conforming to plural_noun.noun .list format



## Always arrays

Need these to always be arrays, something that isn't consistent w/ the current XML
parsing setup

+ project.list
    tasks.task
    staff.staff (use staff_members?)
    contractors.contractor

+ staff.list
    projects.project

### Getting Started, Development

1. Checkout this repository

1. Install packages:

        npm install

1. Create .config.json

    In the root directory of the project
    add the file ```.config.json``` and set your 
    Freshbooks subdomain and token. See sample.config.json

    https://YOUR_COMPANY_NAME.freshbooks.com/apiEnable

1. Syntax Highlighting for ECMAScript 6
    
    https://github.com/Benvie/JavaScriptNext.tmLanguage

## Support Indicators, ES Harmony

+ Browsers: http://kangax.github.io/es5-compat-table/es6/
+ Firefox: https://developer.mozilla.org/en-US/docs/Web/JavaScript/ECMAScript_6_support_in_Mozilla
+ http://pointedears.de/scripts/test/es-matrix/
+ Jan 7, 2014: http://bahmutov.calepin.co/partial-ecmascript6-harmony-support-on-node-today.html
+ Aug 17 2013: http://addyosmani.com/blog/tracking-es6-support/



## Resources about ES Harmony / ECMASCript 6

+ https://medium.com/code-adventures/174f1fe66127
+ http://www.2ality.com/2014/01/object-assign.html
+ http://www.sitepoint.com/javascript-generators-preventing-callback-hell/
+ http://blogs.atlassian.com/2013/11/harmony-generators-and-promises-for-node-js-async-fun-and-profit/
+ http://addyosmani.com/writing-modular-js/
+ http://h3manth.com/new/blog/2013/es6-on-nodejs/
+ https://labnotes.org/yield-to-the-test-using-mocha-with-es6-generators/
+ http://addyosmani.com/blog/a-few-new-things-coming-to-javascript/
+ http://www.nczonline.net/blog/2012/10/09/ecmascript-6-collections-part-2-maps/
+ http://wiki.ecmascript.org/doku.php?id=harmony:iterators






## License 

(The MIT License)

Copyright (c) 2014 Gregory Tomlinson &lt;gregory.tomlinson@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.