const { validations, validateAll } = require('indicative/validator')
const { sanitizations, sanitize } = require('indicative/sanitizer')
const { Order, Product, OrderProduct, ProductImage } = require('../models/Models')
const IndicativeErrorFormatter = require('../helper/IndicativeErrorFormatter');
const sequelize = require('../sequelize');

const OrderController = {

  index: async (req, res) => {
    let limit = req.query.limit != undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page != undefined && req.query.page != 0 ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;

    const orders = await Order.findAndCountAll({
      order: [
        ['created_at', 'DESC']
      ],
      offset: offset,
      limit: limit
    });

    return res.json({
      orders: orders.rows,
      limit,
      page,
      total: orders.count
    });
  },

  show: async(req, res) => {

    const order = await Order.findByPk(req.params.id, {
      include: [
        { 
          model: Product,
          attributes: ['id', 'name', 'price'],
          through: { attributes: [] },
          include: [
            { 
              model: ProductImage,
              as: 'images',
              attributes: ['id', 'image']
            }
          ]
        }
      ],
      attributes: [
        'id', 'buyer_name', 'buyer_email', 'message', 'created_at'
      ] 
    });

    if (!order) {
      return res.status(404).json({
        'message': 'Order not found'
      })
    }

    return res.json(order)
  },

  store: async (req, res) => {
    
    let order;
    let products = [];
    const rules = {
      'buyer_name': [validations.required()],
      'buyer_email': [validations.required(), validations.email()],
      'products': [validations.required(), validations.array(), validations.min([1])],
      'products.*': [validations.object()],
      'products.*.id': [validations.required()],
    };

    const sanitizer = {
      'buyer_name': [sanitizations.trim(), sanitizations.escape()],
      'buyer_email': [sanitizations.normalizeEmail()],
      'message': [sanitizations.trim(), sanitizations.escape()],
    }

    sanitize(req.body, sanitizer);

    validateAll(req.body, rules, IndicativeErrorFormatter.messages())
      .then( async (data) => {
        transaction = await sequelize.transaction();

        order = await Order.create({
          'buyer_name': req.body.buyer_name,
          'buyer_email': req.body.buyer_email
        });
    
        for (let i = 0; i < req.body.products.length; i++) {
          const item = req.body.products[i];
          const product = await Product.findByPk(item.id);
          if (!product) {
            return res.status(404).json({
              message: 'Product not found'
            })
          }
          
          await OrderProduct.create({
            'product_id': product.id,
            'order_id': order.id
          });
        }
    
        await transaction.commit();
    
        return res.json(order)
      })
      .catch( (err) => {
        return res.status(422).json({
          message: 'The given data was invalid',
          errors: IndicativeErrorFormatter.format(err)
        })
      });
  }
}

module.exports = OrderController;