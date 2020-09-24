const { validateAll } = require('indicative/validator')
const { sanitize } = require('indicative/sanitizer')
const IndicativeErrorFormatter = require('../helpers/IndicativeErrorFormatter');
const StoreProductRequest = require('../requests/StoreProductRequest')
const UpdateProductRequest = require('../requests/UpdateProductRequest')
const ProductRepository = require('../repositories/ProductRepository')
const ProductImageRepository = require('../repositories/ProductImageRepository')
const ProductVariantRepository = require('../repositories/ProductVariantRepository')
const { Product } = require('../models/Models')

const ProductController = {

  index: async (req, res) => {
    let limit = req.query.limit != undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page != undefined && req.query.page != 0 ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;

    const products = await ProductRepository.get({
      order: [
        ['created_at', 'DESC']
      ],
      offset: offset,
      limit: limit,
      distinct: true
    });

    const productsData = [];
    products.rows.forEach((element, index) => {
      productsData[index] = {
        id: element.id,
        name: element.name,
        price: element.price,
        images: element.images,
        variants: element.variants
      }
    });

    return res.json({
      products: productsData,
      limit,
      page,
      total: products.count
    })
  },

  show: async(req, res) => {
    const product = await ProductRepository.findByColumn({
      column: 'id',
      value: req.params.id
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    return res.json({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      variants: product.variants
    })
  },

  store: async(req, res) => {
    
    sanitize(req.body, StoreProductRequest.sanitizer);

    validateAll(req.body, StoreProductRequest.rules, IndicativeErrorFormatter.messages())
      .then( async(data) => {

        const product = await ProductRepository.store(data);

        if (data.images) {
          ProductImageRepository.store({ images: data.images, product });
        }

        if (data.variants) {
          ProductVariantRepository.store({  variants: data.variants, product });
        }

        return res.json({
          id: product.id,
          name: product.name,
          price: product.price
        })
      })
      .catch((err) => {
        return res.status(422).json({
          message: 'The given data was invalid',
          errors: IndicativeErrorFormatter.format(err)
        })
      });
  },

  update: async(req, res) => {

    let product = await ProductRepository.findByColumn({
      column: 'id', 
      value: req.params.id
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    
    sanitize(req.body, UpdateProductRequest.sanitizer);

    validateAll(req.body, UpdateProductRequest.rules, IndicativeErrorFormatter.messages())
      .then( async(data) => {

        let product = await Product.findOne({
          where: { id: req.params.id }
        });

        product = await product.update({
          name: data.name,
          price: data.price
        });

        if (data.images) {
          await ProductImageRepository.deleteAllImagesFromProduct(product);
          ProductImageRepository.store({ images: data.images, product });
        }

        if (data.variants) {
          await ProductVariantRepository.deleteAllVariantsFromProduct(product);
          ProductVariantRepository.store({  variants: data.variants, product });
        }

        return res.json(product);
      })
      .catch((err) => {
        console.log(err)
        return res.status(422).json({
          message: 'The given data was invalid',
          errors: IndicativeErrorFormatter.format(err)
        })
      })
  }
}

module.exports = ProductController;
