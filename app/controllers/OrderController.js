const { validateAll } = require('indicative/validator')
const { sanitize } = require('indicative/sanitizer')
const { Order, OrderProduct, Product, ProductImage, ProductVariantOption, ProductVariant } = require('../models/Models')
const IndicativeErrorFormatter = require('../helpers/IndicativeErrorFormatter');
const sequelize = require('../sequelize');
const day = require('dayjs');
const StoreOrderValidator = require('../validators/StoreOrderValidator');

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

    let orderProducts = [];
    const order = await Order.findByPk(req.params.id, {
      include: [
        { 
          model: OrderProduct,
          as: 'order_products'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        'message': 'Order not found'
      })
    }

    for (let i = 0; i < order.order_products.length; i++) {
      const item = order.order_products[i];
      orderProducts.push(JSON.parse(item.product));
    }

    return res.json({
      id: order.id,
      buyer_name: order.buyer_name,
      buyer_email: order.buyer_email,
      total: order.total,
      message: order.message,
      created_at: day(order.created_at).unix(),
      products: orderProducts
    })
  },

  store: async (req, res) => {

    sanitize(req.body, StoreOrderValidator.sanitizer);

    validateAll(req.body, StoreOrderValidator.rules, IndicativeErrorFormatter.messages())
      .then( async (data) => {
    
        let order;
        let total = 0;
        
        transaction = await sequelize.transaction();

        order = await Order.create({
          buyer_name: req.body.buyer_name,
          buyer_email: req.body.buyer_email,
          total: 0,
          message: req.body.message
        });
    
        for (let i = 0; i < req.body.products.length; i++) {
          let subtotal = 0;
          const item = req.body.products[i];
          const product = await Product.findOne({
            where: { id: item.id },
            include: [
              {
                model: ProductImage,
                as: 'images',
                attributes: ['image']
              }
            ]
          });

          if (!product) {
            return res.status(404).json({
              message: 'Product not found'
            });
          }

          total += product.price * item.quantity;
          subtotal += product.price * item.quantity;

          let productVariants = [];
          if (item.variants.length > 0) {
            for (let j = 0; j < item.variants.length; j++) {
              const variant = item.variants[j];
              const productOption = await ProductVariantOption.findOne({
                where: {
                  id: variant.option_id,
                  product_variant_id: variant.variant_id
                },
                include: [
                  {
                    model: ProductVariant,
                    as: 'variant'
                  }
                ]
              });
    
              if (!productOption) {
                return res.status(404).json({
                  message: 'Product variant not found'
                });
              }

              productVariants.push({
                variant_id: productOption.variant.id,
                variant_name: productOption.variant.name,
                variant_option_id: productOption.id,
                variant_option_name: productOption.name
              });
            }
          }
          
          await OrderProduct.create({
            order_id: order.id,
            product: JSON.stringify({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity,
              subtotal: subtotal,
              images: product.images,
              variants: productVariants
            })
          });
        }

        order.update({
          total: total
        });
    
        await transaction.commit();
    
        return res.json({
          id: order.id,
          buyer_name: order.buyer_name,
          buyer_email: order.buyer_email,
          total: total,
          message: order.message,
          created_at: day(order.created_at).unix()
        });
      })
      .catch( (err) => {
        console.log(err)
        return res.status(422).json({
          message: 'The given data was invalid',
          errors: IndicativeErrorFormatter.format(err)
        })
      });
  }
}

module.exports = OrderController;