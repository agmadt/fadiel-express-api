const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const ProductVariant = sequelize.define( 'product_variants', {
      id: {
        type: Sequelize.STRING,
        field: 'id',
        primaryKey: true
      },
      product_id: {
        type: Sequelize.STRING,
        field: 'product_id'
      },
      name: {
        type: Sequelize.STRING,
        field: 'name'
      }
  }, {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

ProductVariant.beforeCreate((productVariant, _ ) => {
  return productVariant.id = uuidv4();
});

module.exports = ProductVariant;