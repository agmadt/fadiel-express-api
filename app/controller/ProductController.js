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
  },

  store: async(req, res) => {

    const rules = {
      'name': [ validations.required() ],
      'price': [ validations.required() ],
      'images': [ validations.array() ],
      'images.*': [ validations.object() ],
      'images.*.image': [ validations.required() ],
      'variants': [ validations.array() ],
      'variants.*': [ validations.object() ],
      'variants.*.name': [ validations.required() ],
      'variants.*.options': [ validations.array(), validations.required() ],
      'variants.*.options.*': [ validations.object() ],
      'variants.*.options.*.name': [ validations.required() ],
    }

    const sanitizer = {
      'name': [sanitizations.stripTags()],
      'price': [sanitizations.stripTags()],
      'images.*.image': [sanitizations.stripTags()],
      'variants.*.name': [sanitizations.stripTags()],
      'variants.*.options.*.name': [sanitizations.stripTags()],
    }
    
    sanitize(req.body, sanitizer);

    validateAll(req.body, rules, IndicativeErrorFormatter.messages())
      .then( async(data) => {

        let transaction = await sequelize.transaction();

        const product = await Product.create({
          'name': data.name,
          'price': data.price,
        });

        if (data.images) {
          for (let i = 0; i < data.images.length; i++) {
            const image = data.images[i];
            await ProductImage.create({
              'product_id': product.id,
              'image': image.image
            });
          }
        }

        if (data.variants) {
          for (let i = 0; i < data.variants.length; i++) {
            const variant = data.variants[i];
            const productVariant = await ProductVariant.create({
              'product_id': product.id,
              'name': variant.name
            });

            if (variant.options) {
              for (let i = 0; i < variant.options.length; i++) {
                const variantOption = variant.options[i];
                await ProductVariantOption.create({
                  'product_variant_id': productVariant.id,
                  'name': variantOption.name
                });
              }
            }
          }
        }

        transaction.commit();

        return res.json(product)
      })
      .catch((err) => {
        return res.status(422).json({
          message: 'The given data was invalid',
          errors: IndicativeErrorFormatter.format(err)
        })
      })
  }
}

module.exports = ProductController;
