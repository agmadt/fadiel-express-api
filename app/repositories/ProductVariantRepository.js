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
}
  
module.exports = ProductVariantRepository;