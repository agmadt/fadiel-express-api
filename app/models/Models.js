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

Order.hasMany(OrderProduct, { as: 'order_products', foreignKey: 'order_id' });
Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
Product.hasMany(ProductVariant, { as: 'variants', foreignKey: 'product_id' });
Product.hasMany(ProductCategory, { as: 'product_categories', foreignKey: 'product_id' });
ProductCategory.belongsTo(Category, { as: 'product_categories_category', foreignKey: 'category_id' });
ProductVariant.hasMany(ProductVariantOption, { as: 'options', foreignKey: 'product_variant_id' });
ProductVariantOption.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'product_variant_id' });

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