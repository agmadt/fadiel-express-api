const { Category } = require('../models/Models');
const sequelize = require('../sequelize');

const ProductRepository = {
  store: async( data ) => {
      
    let transaction = await sequelize.transaction();

    console.log(data)

    return await Category.create({
      'name': data.name,
    });

    transaction.commit();
  },
  update: async( data ) => {

    console.log(data)
      
    let transaction = await sequelize.transaction();

    return await data.category.update({
      'name': data.name,
    });

    transaction.commit();
  }
}

module.exports = ProductRepository;