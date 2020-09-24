const { validations } = require('indicative/validator')
const { sanitizations } = require('indicative/sanitizer')

const rules = {
  'name': [ validations.required() ],
}

const sanitizer = {
  'name': [sanitizations.stripTags()],
}

module.exports = { rules, sanitizer }