# tymly
[![Tymly Package](https://img.shields.io/badge/tymly-package-blue.svg)](https://tymly.io/)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/tymly.svg)](https://www.npmjs.com/package/@wmfs/tymly)
[![Build Status](https://travis-ci.org/wmfs/tymly-core.svg?branch=master)](https://travis-ci.org/wmfs/tymly-core)
[![codecov](https://codecov.io/gh/wmfs/tymly-core/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/tymly-core)
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/tymly-core/badge)](https://www.codefactor.io/repository/github/wmfs/tymly-core)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly/blob/master/packages/pg-concat/LICENSE)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwmfs%2Ftymly-core.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwmfs%2Ftymly-core?ref=badge_shield)


> A framework for building and sharing workflows in Node.js.

## <a name="install"></a>Install
```bash
$ npm install tymly --save
```

## <a name="usage"></a>Usage
```javascript
const tymly = require('tymly')

tymly.boot(
  {
    // Blueprints are structured directories that describe a business function.
    // They contain 'state-machines' (e.g. Finite State Machines expressed in JSON as per Amazon State Machine specification: http://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-state-machine-structure.html)
    // along with the resources required for those state-machines to run (e.g. data 
    // model definitions, images, form-layouts, templates etc.)
    // This is just a simple list of directories where blueprints can be found...   
    blueprintPaths: [
      '/tymly/blueprints/hr',      // Some flows for HR-related things
      '/tymly/blueprints/payroll'  // Some flows for payroll-related activities 
    ],

    // Tymly is extended via plugins, each in-turn offer 'services' and other components...
    pluginPaths: [
      '/tymly/plugins/tymly-express-plugin',  // For accessing Tymly over HTTP/REST etc.
      '/tymly/plugins/tymly-etl-plugin',   // Adds import-from-CSV capabilities
      '/tymly/plugins/tymly-pg-plugin'   // Persist to PostgreSQL instead of the default in-memory solution 
    ],
    
  },
  
  // Callback once everything has booted (or not)
  function (err, services) {   
    if (err) {
      // Handle something going wrong
      console.error(err)
    } else {
      // Do something with those services...
      // (e.g. the 'tymly-express-plugin' provides an Express-powered 'server' service)
      const port = 3000
      services.server.listen(port, function () {        
        console.log('Example app listening on port ' + port);       
      })  
    }   
  }
)
```

## <a name="why"></a>Why?

Tymly has been developed as an alternative for organisations (especially non-profits and Government departments) who need continually-evolving business software - but can do without the complexity, expense and vendor lock-in that usually accompanies it. 

## <a name="documentation"></a>Documentation

For documentation, please visit http://www.tymlyjs.io/

## <a name="tests"></a>Tests
```bash
$ npm test
```

## <a name="license"></a>License
[MIT](https://github.com/wmfs/tymly/blob/master/LICENSE)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwmfs%2Ftymly-core.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwmfs%2Ftymly-core?ref=badge_large)