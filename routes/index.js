const Router = require('./Router');
const router = new Router();

// controllers
const orderController = require('../app/controller/OrderController');
const testController = require('../app/controller/TestController');
const userController = require('../app/controller/UserController');

// Order route
router.get('/orders', orderController.index);
router.post('/orders', orderController.store);
router.get('/orders/:id', orderController.show);

// test route
router.get('/test', testController.index);
router.post('/test', testController.post);

module.exports = router.create();