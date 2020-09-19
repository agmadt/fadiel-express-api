const { Product, ProductImage, ProductVariant, ProductVariantOption } = require('../models/Models');
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
        }
      ]
    })
  },
  store: async( data ) => {
      
    let transaction = await sequelize.transaction();

    return await Product.create({
      'name': data.name,
      'price': data.price,
    });

    transaction.commit();
  },
  update: async( data ) => {
      
    let transaction = await sequelize.transaction();

    return await data.product.update({
      'name': data.name,
      'price': data.price,
    });

    transaction.commit();
  }
}

module.exports = ProductRepository;