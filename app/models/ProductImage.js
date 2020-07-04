const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const ProductImage = sequelize.define( 'product_images', {
      id: {
        type: Sequelize.STRING,
        field: 'id',
        primaryKey: true
      },
      product_id: {
        type: Sequelize.STRING,
        field: 'product_id'
      },
      image: {
        type: Sequelize.STRING,
        field: 'image'
      }
  }, {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

ProductImage.beforeCreate((productImage, _ ) => {
  return productImage.id = uuid();
});

module.exports = ProductImage;