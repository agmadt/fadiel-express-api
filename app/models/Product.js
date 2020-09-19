const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.define('products', 
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
    price: {
      type: Sequelize.INTEGER,
      field: 'price'
    }
  }, 
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

Product.beforeCreate((product, _ ) => {
  return product.id = uuidv4();
});

module.exports = Product;