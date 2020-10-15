const { Product, ProductImage, ProductVariant, ProductVariantOption, ProductCategory, Category } = require('../models/Models');
const sequelize = require('../sequelize');

const ProductRepository = {
  
  get: async({ limit, offset, order}) => {
    return await Product.findAndCountAll({
      order: order,
      offset: offset,
      limit: limit,
      distinct: true,
      include: [
        {
          model: ProductImage,
          attributes: ['id', 'image'],
          as: 'images',
        },
        {
          model: ProductVariant,
          attributes: ['id', 'name'],
          as: 'variants',
          include: [
            {
              model: ProductVariantOption,
              attributes: ['id', 'name'],
              as: 'options'
            }
          ]
        },
        {
          model: ProductCategory,
          as: 'product_categories',
          include: [
            {
              model: Category,
              as: 'product_categories_category'
            }
          ]
        }
      ]
    });
  },
  findByColumn: async({ column, value }) => {
    return await Product.findOne({
      where: {
        [column]: value
      },
      include: [
        {
          model: ProductImage,
          attributes: ['id', 'image'],
          as: 'images',
        },
        {
          model: ProductVariant,
          attributes: ['id', 'name'],
          as: 'variants',
          include: [
            {
              model: ProductVariantOption,
              attributes: ['id', 'name'],
              as: 'options'
            }
          ]
        },
        {
          model: ProductCategory,
          as: 'product_categories',
          include: [
            {
              model: Category,
              as: 'product_categories_category'
            }
          ]
        }
      ]
    })
  },
  store: async( data ) => {
      
    let transaction = await sequelize.transaction();

    const product = await Product.create({
      'name': data.name,
      'price': data.price,
    });

    transaction.commit();

    return product;
  },
  update: async( data ) => {
      
    let transaction = await sequelize.transaction();

    const product = await data.product.update({
      'name': data.name,
      'price': data.price,
    });

    transaction.commit();

    return product;
  }
}

module.exports = ProductRepository;