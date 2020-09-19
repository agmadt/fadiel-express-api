const { User } = require('../models/Models');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const JoiErrorFormatter = require('../helpers/JoiErrorFormatter');
const day = require('dayjs');
const bcrypt = require('bcrypt')

const AuthController = {

  login: async (req, res) => {
    const schema = Joi.object({
      email: Joi.required(),
      password: Joi.required()
    });

    try {
      const validate = await schema.validateAsync(req.body);
    } catch (error) {
      return res.status(422).json({
        message: 'The given data was invalid',
        errors: JoiErrorFormatter.formats(error.details)
      })
    }

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

    const data = {
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
      data
    })
  }
}

module.exports = AuthController;