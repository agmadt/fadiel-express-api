const { validateAll } = require('indicative/validator')
const { sanitize } = require('indicative/sanitizer')
const IndicativeErrorFormatter = require('../helpers/IndicativeErrorFormatter');
const StoreProductRequest = require('../requests/StoreProductRequest')
const UpdateProductRequest = require('../requests/UpdateProductRequest')
const ProductRepository = require('../repositories/ProductRepository')
const ProductImageRepository = require('../repositories/ProductImageRepository')
const ProductVariantRepository = require('../repositories/ProductVariantRepository')

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

    return res.json({
      products: products.rows,
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

    return res.json(product)
  },

  store: async(req, res) => {
    
    sanitize(req.body, StoreProductRequest.sanitizer);

    validateAll(req.body, StoreProductRequest.rules, IndicativeErrorFormatter.messages())
      .then( async(data) => {

        const product = await ProductRepository.store(data);

        if (data.images) {
          await ProductImageRepository.store({ images: data.images, product });
        }

        if (data.variants) {
          await ProductVariantRepository.store({  variants: data.variants, product });
        }

        return res.json(product)
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

        let product = await ProductRepository.findByColumn({
          column: 'id',
          value: req.params.id
        })

        product = await ProductRepository.update({
          'product': product,
          'name': data.name,
          'price': data.price
        });

        // if (data.images) {
        //   let productImages = await ProductImage.findAll({
        //     where: { 'product_id': product.id }
        //   });

        //   // Loop to create a new image if image object doesnt have id
        //   for (let i = 0; i < data.images.length; i++) {
        //     const image = data.images[i];
        //     if (!image.id) {
        //       await ProductImage.create({
        //         'product_id': product.id,
        //         'image': image.image
        //       });
        //     }
        //   }

        //   // Loop to delete image if existing image is not exist in the images request
        //   for (let i = 0; i < productImages.length; i++) {
        //     const productImage = productImages[i];

        //     const foundProductImage = await data.images.find(function(item) {
        //       return item.id == productImage.id;
        //     });

        //     if (!foundProductImage) {
        //       await ProductImage.destroy({ where: { id: productImage.id }});
        //     }
        //   }
        // }

        // if (data.variants) {
        //   let productVariants = await ProductVariant.findAll({
        //     where: { 'product_id': product.id }
        //   });

        //   for (let i = 0; i < data.variants.length; i++) {
        //     const variant = data.variants[i];
            
        //     if (!variant.id) {
        //       let productVariant = await ProductVariant.create({
        //         'product_id': product.id,
        //         'name': variant.name
        //       });

        //       for (let i = 0; i < variant.options.length; i++) {
        //         const variantOption = variant.options[i];
        //         await ProductVariantOption.create({
        //           'product_variant_id': productVariant.id,
        //           'name': variantOption.name
        //         });
        //       }
        //     } else {
        //       let productVariant = await ProductVariant.findByPk(variant.id);

        //       if (!productVariant) {
        //         continue;
        //       }

        //       productVariant = await productVariant.update({
        //         'name': variant.name
        //       })
        //     }
        //   }

        //   for (let i = 0; i < productVariants.length; i++) {
        //     const productVariant = productVariants[i];

        //     const foundproductVariant = await data.variants.find(function(item) {
        //       return item.id == productVariant.id;
        //     });

        //     if (!foundproductVariant) {
        //       await ProductVariant.destroy({ where: { id: productVariant.id }});
        //       await ProductVariantOption.destroy({ where: { 'product_variant_id': productVariant.id } });
        //     }

        //     for (let j = 0; j < data.variants.length; j++) {
        //       for (let k = 0; k < variant.options.length; k++) {
        //         const variantOption = variant.options[k];
        //         await ProductVariantOption.create({
        //           'product_variant_id': productVariant.id,
        //           'name': variantOption.name
        //         });
        //       }
        //     }
        //   }
        // }

        return res.json(product)
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
