const validate = require('../index.js')
const assert = require('assert')

const data = {
  name: 'Tom Brady',
  number: 11,
  position: 'RB',
  ranking: 'last'
}

const validator = {
  name: [name => name.length > 4, 'wrong name'],
  number: [number => number === 12, 'wrong number'],
  position: [position => position === 'QB', 'wrong position'],
  ranking: [ranking => ranking === 'GOAT', 'GOAT']
}

describe('Validating objects', () => {

  it('Passes validation', () => {
    const data = {
      name: 'Tom Brady',
      number: 12,
      position: 'QB',
      ranking: 'GOAT'
    }
    const errors = validate(data)(validator)
    assert(errors.length === 0)
  })


  it('Fails with user provided errors', () => {
    const errors = validate(data)(validator)
    assert(
      (
        errors[0] === 'wrong number' &&
        errors[1] === 'wrong position' &&
        errors[2] === 'GOAT'
      )
    )
  })


  it('Fails with default error', () => {
    const additionalData = { yards: 250 }
    const additionalValidation = { yards: [yards => yards > 1000] }
    const errors = validate(additionalData)(additionalValidation)

    assert(errors[0] === 'Invalid value for yards')
  })


  it('Fails with user provided error for missing key on source object', () => {
    const additional = { yards: [yards => yards > 1000, 'incorrect yardage'] }
    const errors = validate(data)(Object.assign({}, validator, additional))

    assert(errors[3] === 'incorrect yardage')
  })


  it('Fails with default error for missing key on source object', () => {
    const additional = { yards: [yards => yards > 1000] }
    const errors = validate(data)(Object.assign({}, validator, additional))

    assert(errors[3] === 'No value for \'yards\'')
  })

})
