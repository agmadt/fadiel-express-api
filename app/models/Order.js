const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const Order = sequelize.define( 'orders', 
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
    buyer_name: {
      type: Sequelize.STRING,
      field: 'buyer_name'
    },
    buyer_email: {
      type: Sequelize.STRING,
      field: 'buyer_email'
    },
    message: {
      type: Sequelize.STRING,
      field: 'message'
    }
  }, 
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

Order.beforeCreate((order, _ ) => {
  return order.id = uuidv4();
});

module.exports = Order;