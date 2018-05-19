const q = require('q')
const Validator = require('jsonschema').Validator
const v = new Validator()

function validateSchema (data, schema, errorCodeObj) {
  let deferred = q.defer()
  const ERR_CODE = Object.assign(errorCodeObj)
  // console.log('ERR_CODE==', ERR_CODE)

  if (!schema) {
    throw new Error('Add valid schema.')
  }
  if (schema && !schema.id) {
    throw new Error('Invalid schema (schema should contain property id).')
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
            code: (ERR_CODE && ERR_CODE['REQUIRED_' + obj.argument.toUpperCase()]) ? ERR_CODE['REQUIRED_' + obj.argument.toUpperCase()] : 'ERR0001',
            error: field ? field + ' requires property ' + obj.argument : 'property ' + obj.argument + ' is missing',
            parameter: obj.argument,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'type':
          // console.log('222==', splitObj, field, field1, obj)
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['TYPE_' + field.toUpperCase()]) ? ERR_CODE['TYPE_' + field.toUpperCase()] : 'ERR0002',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'format':
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['FORMAT_' + field.toUpperCase()]) ? ERR_CODE['FORMAT_' + field.toUpperCase()] : 'ERR0003',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'minLength':
          // console.log('444==', splitObj, field, field1, obj)
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['MINLENGTH_' + field.toUpperCase()]) ? ERR_CODE['MINLENGTH_' + field.toUpperCase()] : 'ERR0004',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'minItems':
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['MINITEMS_' + field.toUpperCase()]) ? ERR_CODE['MINITEMS_' + field.toUpperCase()] : 'ERR0005',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'uniqueItems':
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['UNIQUEITEMS_' + field.toUpperCase()]) ? ERR_CODE['UNIQUEITEMS_' + field.toUpperCase()] : 'ERR0006',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'minimum':
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['MINIMUM_' + field.toUpperCase()]) ? ERR_CODE['MINIMUM_' + field.toUpperCase()] : 'ERR0007',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'anyOf':
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['ANYOF_' + field.toUpperCase()]) ? ERR_CODE['ANYOF_' + field.toUpperCase()] : 'ERR0008',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        case 'enum':
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['ENUM_' + field.toUpperCase()]) ? ERR_CODE['ENUM_' + field.toUpperCase()] : 'ERR0009',
            error: field + ' ' + obj.message,
            parameter: field,
            // parent: field1 ? field1 : field,
            line: (!isNaN(indexId)) ? indexId : null
          })
          break
        default:
          validationErr.push({
            code: (ERR_CODE && ERR_CODE['GENERIC_' + field.toUpperCase()]) ? ERR_CODE['GENERIC_' + field.toUpperCase()] : 'ERR0010',
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
