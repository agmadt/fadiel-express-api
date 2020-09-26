const { validateAll } = require('indicative/validator')
const { sanitize } = require('indicative/sanitizer')
const CategoryRepository = require('../repositories/CategoryRepository')
const IndicativeErrorFormatter = require('../helpers/IndicativeErrorFormatter');
const StoreCategoryRequest = require('../requests/StoreCategoryRequest')
const { Category, ProductCategory, Product } = require('../models/Models')

const CategoryController = {

  index: async (req, res) => {
    let limit = req.query.limit != undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page != undefined && req.query.page != 0 ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;

    const categories = await Category.findAndCountAll({
      order: [
        ['created_at', 'DESC']
      ],
      attributes: ['id', 'name'],
      offset: offset,
      limit: limit,
      distinct: true
    });

    return res.json({
      categories: categories.rows,
      limit,
      page,
      total: categories.count
    })
  },

  show: async(req, res) => {
    const category = await Category.findOne({
      where: { id: req.params.id }
    });

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    return res.json({
      id: category.id,
      name: category.name
    })
  },

  store: async(req, res) => {

    sanitize(req.body, StoreCategoryRequest.sanitizer);

    validateAll(req.body, StoreCategoryRequest.rules, IndicativeErrorFormatter.messages())
    .then( async(data) => {

      const category = await CategoryRepository.store(data);

      return res.json({
        id: category.id,
        name: category.name
      });
    })
    .catch((err) => {
      return res.status(422).json({
        message: 'The given data was invalid',
        errors: IndicativeErrorFormatter.format(err)
      })
    });
  },

  update: async(req, res) => {

    let category = await Category.findOne({
      where: { id: req.params.id }
    });

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    sanitize(req.body, StoreCategoryRequest.sanitizer);

    validateAll(req.body, StoreCategoryRequest.rules, IndicativeErrorFormatter.messages())
    .then( async(data) => {

      category = await CategoryRepository.update({
        name: data.name,
        category: category
      });

      return res.json({
        id: category.id,
        name: category.name
      });
    })
    .catch((err) => {
      return res.status(422).json({
        message: 'The given data was invalid',
        errors: IndicativeErrorFormatter.format(err)
      })
    });
  },

  destroy: async(req, res) => {

    let category = await Category.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Product,
          as: 'products'
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    if (category.products.length > 0) {
      return res.status(403).json({
        message: 'Category is still being used by products'
      });
    }
    
    category.destroy();

    return res.json({
      message: 'Category successfully deleted.'
    });
  },
}

module.exports = CategoryController;
