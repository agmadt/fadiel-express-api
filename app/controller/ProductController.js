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

    return res.json({
      products: products.rows,
      limit,
      page,
      total: products.count
    })
  },

  show: async(req, res) => {
    const product = await Product.findByPk(req.params.id, {
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

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    return res.json(product)
  }
}

module.exports = ProductController;
