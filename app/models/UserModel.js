var Sequelize = require('sequelize');
var sequelize = require('./../sequelize');

var userModel = sequelize.define( 'users', {
      name: {
        type: Sequelize.STRING,
        field: 'name'
      },
      email: {
        type: Sequelize.STRING,
        field: 'email'
      },
      password: {
        type: Sequelize.STRING,
        field: 'password'
      }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = userModel;