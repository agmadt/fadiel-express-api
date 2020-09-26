const { validations } = require('indicative/validator')
const { sanitizations } = require('indicative/sanitizer')

const rules = {
  'buyer_name': [validations.required()],
  'buyer_email': [validations.required(), validations.email()],
  'products': [validations.required(), validations.array(), validations.min([1])],
  'products.*': [validations.object()],
  'products.*.id': [validations.required()],
  'products.*.quantity': [validations.required(), validations.number()],
  'products.*.variants': [validations.array(), validations.min([1])],
  'products.*.variants.*': [validations.required(), validations.object()],
  'products.*.variants.*.variant_id': [validations.required()],
  'products.*.variants.*.option_id': [validations.required()],
}

const sanitizer = {
  'buyer_name': [sanitizations.trim(), sanitizations.escape()],
  'buyer_email': [sanitizations.normalizeEmail()],
  'message': [sanitizations.trim(), sanitizations.escape()],
}

module.exports = { rules, sanitizer }