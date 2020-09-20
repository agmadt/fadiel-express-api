const { User } = require('../models/Models');
const jwt = require('jsonwebtoken');
const { validations, validateAll } = require('indicative/validator')
const { sanitizations, sanitize } = require('indicative/sanitizer')
const IndicativeErrorFormatter = require('../helpers/IndicativeErrorFormatter');
const day = require('dayjs');
const bcrypt = require('bcrypt')

const AuthController = {

  login: async (req, res) => {
    
    const rules = {
      'email': [validations.required(), validations.email()],
      'password': [validations.required()]
    };

    const sanitizer = {
      'email': [sanitizations.normalizeEmail()],
      'password': [sanitizations.trim(), sanitizations.escape()],
    }

    sanitize(req.body, sanitizer);
    
    validateAll(req.body, rules, IndicativeErrorFormatter.messages())
      .then( async (data) => {
        const isUserExist = await User.findOne({ 
          where: {
            email: req.body.email,
          }
        });
    
        if (!isUserExist) {
          return res.status(401).json({
            'message': 'Username or password is incorrect'
          })
        }
    
        if (!bcrypt.compareSync(req.body.password, isUserExist.password)) {
          return res.status(401).json({
            'message': 'Username or password is incorrect'
          })
        }
    
        const userData = {
          id: isUserExist.id,
          email: isUserExist.email,
          name: isUserExist.name
        };
    
        const token = jwt.sign({
          'iat': day().unix(),
          'exp': day().add(10, 'day').unix(),
        }, process.env.JWT_SECRET);
    
        return res.json({
          'access_token': token,
          data: userData
        })
      })
      .catch( (err) => {
        return res.status(422).json({
          message: 'The given data was invalid',
          errors: IndicativeErrorFormatter.format(err)
        })
      });
  }
}

module.exports = AuthController;