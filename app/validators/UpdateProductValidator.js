const { validations } = require('indicative/validator')
const { sanitizations } = require('indicative/sanitizer')

const rules = {
  'images': [ validations.array() ],
  'images.*': [ validations.object() ],
  'images.*.image': [ validations.required() ],
  'variants': [ validations.array() ],
  'variants.*': [ validations.object() ],
  'variants.*.name': [ validations.required() ],
  'variants.*.options': [ validations.array(), validations.required(), validations.min([1]) ],
  'variants.*.options.*': [ validations.object() ],
  'variants.*.options.*.name': [ validations.required() ],
}

const sanitizer = {
  'name': [sanitizations.stripTags()],
  'price': [sanitizations.stripTags()],
  'images.*.image': [sanitizations.stripTags()],
  'variants.*.name': [sanitizations.stripTags()],
  'variants.*.options.*.name': [sanitizations.stripTags()],
}

module.exports = { rules, sanitizer }