const Category = require('./Category');
const Media = require('./Media');
const Order = require('./Order');
const OrderProduct = require('./OrderProduct');
const Product = require('./Product');
const ProductCategory = require('./ProductCategory');
const ProductImage = require('./ProductImage');
const ProductVariant = require('./ProductVariant');
const ProductVariantOption = require('./ProductVariantOption');
const User = require('./User');

Category.belongsToMany(Product, { through: ProductCategory, as: 'products', foreignKey: 'category_id' });
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'order_id', otherKey: 'product_id' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'product_id', otherKey: 'order_id' });
Product.belongsToMany(Category, { through: ProductCategory, as: 'categories', foreignKey: 'product_id' });
Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
Product.hasMany(ProductVariant, { as: 'variants', foreignKey: 'product_id' });
ProductVariant.hasMany(ProductVariantOption, { as: 'options', foreignKey: 'product_variant_id' });

module.exports = {
    Category,
    Media,
    Order,
    OrderProduct,
    Product,
    ProductCategory,
    ProductImage,
    ProductVariant,
    ProductVariantOption,
    User
}