const { validations, validateAll } = require('indicative/validator')
const { sanitizations, sanitize } = require('indicative/sanitizer')
const { Product, ProductImage, ProductVariant, ProductVariantOption } = require('../models/Models')
const IndicativeErrorFormatter = require('../helper/IndicativeErrorFormatter');
const sequelize = require('../sequelize');

const ProductController = {

  index: async (req, res) => {
    let limit = req.query.limit != undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page != undefined && req.query.page != 0 ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      order: [
        ['created_at', 'DESC']
      ],
      offset: offset,
      limit: limit,
      distinct:true,
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

    console.log(products.count)

    return res.json({
      products: products.rows,
      limit,
      page,
      total: products.count
    })
  }
}

module.exports = ProductController;
