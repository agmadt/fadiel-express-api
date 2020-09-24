const { Category } = require('../models/Models');
const sequelize = require('../sequelize');

const CategoryRepository = {
  store: async( data ) => {
      
    let transaction = await sequelize.transaction();

    console.log(data)

    const category = await Category.create({
      'name': data.name,
    });

    transaction.commit();

    return category;
  },
  update: async( data ) => {

    let transaction = await sequelize.transaction();

    const category = await data.category.update({
      'name': data.name,
    });

    transaction.commit();

    return category;
  }
}

module.exports = CategoryRepository;