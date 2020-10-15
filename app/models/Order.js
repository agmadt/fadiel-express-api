const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs')

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
    total: {
      type: Sequelize.DECIMAL(16, 2),
      field: 'total',
      get() {
        const value = this.getDataValue('total');
        return value === null ? null : parseFloat(value);
      }
    },
    message: {
      type: Sequelize.STRING,
      field: 'message'
    },
    created_at: {
      type: Sequelize.DATE,
      field: 'created_at',
      get() {
        return dayjs(this.getDataValue('created_at')).add(7, 'h').valueOf() / 1000;
      }
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