var Sequelize = require('sequelize');
var sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

var User = sequelize.define('users', 
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
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
  }, 
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.beforeCreate((user, _ ) => {
  return user.id = uuidv4();
});

module.exports = User;