const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const OrderProduct = sequelize.define( 'order_products', 
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
    order_id: {
      type: Sequelize.STRING,
      field: 'order_id'
    },
    product_id: {
      type: Sequelize.STRING,
      field: 'product_id'
    }
  }, 
  {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

OrderProduct.beforeCreate((order, _ ) => {
  return order.id = uuidv4();
});

module.exports = OrderProduct;