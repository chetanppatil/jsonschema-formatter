# NPM Package For Formatting `jsonschema` Validation Error

<!-- [![Build Status](https://travis-ci.org/Chetan07j/jsonschema-formatter.svg?branch=master)](https://travis-ci.org/Chetan07j/jsonschema-formatter) -->
[![HitCount](http://hits.dwyl.io/chetan07j/jsonschema-formatter.svg)](http://hits.dwyl.io/chetan07j/jsonschema-formatter)
[![Generic badge](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub license](https://img.shields.io/github/license/chetan07j/jsonschema-formatter.svg)](https://github.com/Chetan07j/jsonschema-formatter/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/chetan07j/jsonschema-formatter.svg)](https://github.com/Chetan07j/jsonschema-formatter/graphs/contributors/)
[![GitHub issues](https://img.shields.io/github/issues/chetan07j/jsonschema-formatter.svg)](https://github.com/Chetan07j/jsonschema-formatter/issues/)
[![GitHub issues-closed](https://img.shields.io/github/issues-closed/chetan07j/jsonschema-formatter.svg)](https://github.com/Chetan07j/jsonschema-formatter/issues?q=is%3Aissue+is%3Aclosed)

[![NPM](https://nodei.co/npm/jsonschema-formatter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jsonschema-formatter/)

Get `jsonschema` npm package validation error in more readable and usable format.

You don't need to install `jsonschema` package seperately, just install this `jsonschema-formatter` package and start using.

This package internally call `jsonschema` function and then formats its validation response in more readable format.

This package returns a Promise. For promise we are using [q](https://www.npmjs.com/package/q) package.

## Installation

Install with the node package manager [npm](http://npmjs.org):

```shell
$ npm install jsonschema-formatter
```

## How To Use?

## Import/require package in your application

```javascript
const validateSchema = require('jsonschema-formatter').validateSchema;
```

## Example Schema And Input Data

```javascript
// Input Body Validation Schema
let schema = {
  'id': '/SimplePerson',
  'type': 'object',
  'properties': {
    'name': {'type': 'string'},
    'address': {
      'type': 'object',
      'properties': {
        'lines': {
          'type': 'array',
          'items': {'type': 'string'}
        },
        'zip': {'type': 'string'},
        'city': {'type': 'string'},
        'country': {'type': 'string'}
      },
      'required': ['country']
    },
    'votes': {'type': 'integer', 'minimum': 1}
  },
  'required': ['name']
}

// Input Body
let p = {
  'names': 'Barack Obama',
  'address': {
    'lines': [ '1600 Pennsylvania Avenue Northwest' ],
    'zip': 'DC 20500',
    'city': 'Washington',
    'country': 1
  },
  'votes': 0
}

// Custom Defined Error Codes
let resCode = {
  REQUIRED_NAME: 'CUST_ERR0001',
  TYPE_COUNTRY: 'CUST_ERR0002'
}

```

## Call `validateSchema` Function

```javascript
/*
  here p and schema refers to above step, resCode is optional if you define your custom error codes
  then pass it else pre-defined error codes will be assigned
*/

validateSchema(p, schema, resCode)
.then((validationResult) => {
  console.log('RESULT: ', validationResult)
})
.catch((err) => {
  console.log('VALIDATION ERR: ', err)
})
.done()
```

## Output Of Above Vaidation

```javascript
VALIDATION ERR: [ { code: 'CUST_ERR0002', // CODE FROM resCode YOUR DEFINED
    error: 'country is not of a type(s) string',
    parameter: 'country',
    line: null },
  { code: 'ERR0006',
    error: 'votes must have a minimum value of 1',
    parameter: 'votes',
    line: null },
  { code: 'ERR0001',
    error: 'property name is missing',
    parameter: 'name',
    line: null } ]
```

## Output Parameter Definition

`code`: User Defined Or Pre-defined Error Code To Uniquely Find Specific Error
`error`: Text Explaining What Error Occured
`parameter`: Request Body Parameter(Key) For Which Error Occured
`line`: In Case Of Array Which Index Element Has Error

## How To Define Custom Error Codes

| Error Codes   | Error Type | Example (from body used above) |
| ------------- | ------------- |
| `REQUIRED_<your-parameter-name-in-uppercase>`  | Required field error  | For missing name property ```javascript { REQUIRED_NAME: 'CUST_ERR001' } ``` |
| `TYPE_<your-parameter-name-in-uppercase>`  | Field type error  | For country peoperty type error ```javascript { TYPE_COUNTRY: 'CUST_ERR002' } ``` |

## Changelog

- _1.0.0 Initial version_
