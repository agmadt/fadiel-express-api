const Product = require('./Product');
const Order = require('./Order');
const OrderProduct = require('./OrderProduct');
const ProductImage = require('./ProductImage');
const ProductVariant = require('./ProductVariant');
const ProductVariantOption = require('./ProductVariantOption');

Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'product_id', otherKey: 'order_id' });
Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
Product.hasMany(ProductVariant, { as: 'variants', foreignKey: 'product_id' });
ProductVariant.hasMany(ProductVariantOption, { as: 'options', foreignKey: 'product_variant_id' });
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'order_id', otherKey: 'product_id' });

module.exports = {
    Product,
    Order,
    OrderProduct,
    ProductImage,
    ProductVariant,
    ProductVariantOption
}