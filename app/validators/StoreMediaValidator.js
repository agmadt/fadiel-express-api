const { validations } = require('indicative/validator')

const rules = {
  'file': [ validations.required() ]
}

module.exports = { rules }