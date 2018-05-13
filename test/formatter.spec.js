let chai = require('chai')
let expect = chai.expect
const validateSchema = require('../index.js').validateSchema

describe('FORMATTER TEST:', () => {
  it('Should throw error ("Add valid schema.") if no schema is passed to function', (done) => {
    expect(validateSchema).to.throw('Add valid schema.')
    done()
  })
  // it('Should throw error ("Invalid schema (schema should contain peroprty id).") if schema passed to function does not contain peroprty "id"', (done) => {
  //   let schema = { test: 'test' }
  //   expect(validateSchema(null, schema)).to.throw('Invalid schema (schema should contain peroprty id).')
  //   done()
  // })
  it('Should contain code, error, parameter, line properties in response if validation error', (done) => {
    let schema = {
      'id': '/SimplePerson',
      'type': 'object',
      'properties': {
        'name': {'type': 'string'}
      },
      'required': ['name']
    }

    validateSchema(null, schema)
      .then((res) => {
        console.log('ress==', res)
      })
      .catch((err) => {
        expect(err).to.not.equal(null)
        expect(err).to.be.an('array')
        expect(err[0]).to.have.property('code')
        expect(err[0]).to.have.property('error')
        expect(err[0]).to.have.property('parameter')
        expect(err[0]).to.have.property('line')
        done()
      })
    // done()
  })
})
