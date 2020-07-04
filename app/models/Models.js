const Product = require('./Product');
const Order = require('./Order');
const OrderProduct = require('./OrderProduct');
const ProductImage = require('./ProductImage');

Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'product_id', otherKey: 'order_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'order_id', otherKey: 'product_id' });

module.exports = {
    Product,
    Order,
    OrderProduct,
    ProductImage
}