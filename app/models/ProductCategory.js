const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const ProductCategory = sequelize.define('product_categories', 
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
    product_id: {
      type: Sequelize.STRING,
      field: 'product_id'
    },
    category_id: {
      type: Sequelize.STRING,
      field: 'category_id'
    }
  }, 
  {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

ProductCategory.beforeCreate((productCategory, _ ) => {
  return productCategory.id = uuidv4();
});

module.exports = ProductCategory;