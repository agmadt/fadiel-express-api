const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const Category = sequelize.define('categories',
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      field: 'name'
    }
  }, 
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Category.beforeCreate((category, _ ) => {
  return category.id = uuidv4();
});

module.exports = Category;