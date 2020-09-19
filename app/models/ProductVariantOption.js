const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const ProductVariantOption = sequelize.define('product_variant_options', 
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
    product_variant_id: {
      type: Sequelize.STRING,
      field: 'product_variant_id'
    },
    name: {
      type: Sequelize.STRING,
      field: 'name'
    }
  }, 
  {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

ProductVariantOption.beforeCreate((productVariantOption, _ ) => {
  return productVariantOption.id = uuidv4();
});

module.exports = ProductVariantOption;