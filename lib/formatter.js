const q = require('q')
const Validator = require('jsonschema').Validator
const v = new Validator()

function validateSchema (data, schema) {
  let deferred = q.defer()

  if (!schema) {
    throw new Error('Add valid schema.')
  }
  if (schema && !schema.id) {
    throw new Error('Invalid schema (schema should contain peroprty id).')
  }

  let errors = v.validate(data, schema).errors // GET ALL JSON SCHEMA ERRORS
  let validationErr = []
  // console.log('errors==', errors)

  if (errors.length > 0) {
    /* LOOP THROUGH errors */
    errors.forEach(function (obj) {
      /*
        obj.property contains parameter with instance keyword, so to extract exact parameter name
        we will split it on "."
        In array peoperty case to get exact index of error element we will split it on "[" and "]"
        e.g., instance.contacts[0] will ouput "0"
      */
      let splitObj = obj.property.split('.')
      let indexId = parseInt(splitObj[splitObj.length - 1].split('[').pop().split(']')[0])
      let field = (splitObj.length > 1) ? splitObj.pop().split('[')[0] : null // get main parameter
      // console.log('splitObj==', splitObj)
      // let field1 = (splitObj.length > 1) ? splitObj.pop() : null // get parent if any
      // console.log('field1==', field1)

      /* EACH ERROR OBJ CONTAINS name PROPERTY */
      switch (obj.name) {
        case 'required':
          /* IN THIS CASE obj.argument contains parameter name */
          validationErr.push({
            code: 'ERR0001',
            error: field ? field + ' requires property ' + obj.argument : 'property ' + obj.argument + ' is missing',
            parameter: obj.argument,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'type':
          // console.log('222==', splitObj, field, field1, obj)
          validationErr.push({
            code: 'ERR0002',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'format':
          validationErr.push({
            code: 'ERR0003',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'minLength':
          // console.log('444==', splitObj, field, field1, obj)
          validationErr.push({
            code: 'ERR0004',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'minItems':
          validationErr.push({
            code: 'ERR0005',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'uniqueItems':
          validationErr.push({
            code: 'ERR0006',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'minimum':
          validationErr.push({
            code: 'ERR0006',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        default:
          validationErr.push({
            code: 'ERR0008',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
      }
    })
  } else {
    validationErr = []
  }
  validationErr.length > 0 ? deferred.reject(validationErr) : deferred.resolve('No error')
  return deferred.promise
}

module.exports.validateSchema = validateSchema
