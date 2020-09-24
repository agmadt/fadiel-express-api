const { ProductCategory } = require('../models/Models');
const sequelize = require('../sequelize');

const ProductCategoryRepository = {
  store: async({ categories, product }) => {
      
    let productCategories = [];
    let transaction = await sequelize.transaction();
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const productCategory = await ProductCategory.create({
        'product_id': product.id,
        'category_id': category.id
      });

      productCategories.push(productCategory);
    }

    transaction.commit();

    return productCategories;
  },
  deleteAllProductFromCategory: async( category ) => {

    let transaction = await sequelize.transaction();

    const productCategories = await ProductCategory.findAll({
      where: { category_id: category.id }
    });

    productCategories.forEach(async (element) => {
      await element.destroy();
    });

    transaction.commit();
  },
  deleteAllCategoryFromProduct: async( product ) => {

    let transaction = await sequelize.transaction();

    const productCategories = await ProductCategory.findAll({
      where: { product_id: product.id }
    });

    productCategories.forEach(async (element) => {
      await element.destroy();
    });

    transaction.commit();
  }
}

module.exports = ProductCategoryRepository;