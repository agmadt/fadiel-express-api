const sequelize = require('../sequelize');
const { ProductVariant, ProductVariantOption } = require('../models/Models')

const ProductVariantRepository = {
  store: async({ variants, product }) => {
    
    let productVariants = [];
    let transaction = await sequelize.transaction();
    
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const productVariant = await ProductVariant.create({
        'product_id': product.id,
        'name': variant.name
      });

      productVariants.push(productVariant);

      for (let i = 0; i < variant.options.length; i++) {
        const variantOption = variant.options[i];
        await ProductVariantOption.create({
          'product_variant_id': productVariant.id,
          'name': variantOption.name
        });
      }
    }

    transaction.commit();

    return productVariants;
  },
  deleteAllVariantsFromProduct: async(product) => {
    
    let transaction = await sequelize.transaction();
    
    const variants = await ProductVariant.findAll({
      where: { product_id: product.id },
      include: [
        {
          model: ProductVariantOption,
          as: 'options'
        }
      ]
    });

    variants.forEach(element => {
      if (element.options) {
        element.options.forEach(option => {
          option.destroy();
        });
      }

      element.destroy();
    });

    transaction.commit();
  }
}
  
module.exports = ProductVariantRepository;