const ProductImage = require('../models/ProductImage');
const sequelize = require('../sequelize');

const ProductImageRepository = {
  store: async({ images, product }) => {
      
    let transaction = await sequelize.transaction();
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      await ProductImage.create({
        'product_id': product.id,
        'image': image.image
      });
    }

    transaction.commit();
  },
  deleteAllImagesFromProduct: async(product) => {
      
    let transaction = await sequelize.transaction();

    const images = await ProductImage.findAll({
      where: { product_id: product.id }
    });

    images.forEach(element => {
      element.destroy();
    });

    transaction.commit();
  },
}
  
module.exports = ProductImageRepository;