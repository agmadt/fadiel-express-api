const Router = require('./Router');
const router = new Router();
const multer = require('multer');
const upload = multer();

// controllers
const authController = require('../app/controllers/AuthController');
const orderController = require('../app/controllers/OrderController');
const testController = require('../app/controllers/TestController');
const userController = require('../app/controllers/UserController');
const productController = require('../app/controllers/ProductController');
const mediaController = require('../app/controllers/MediaController');

// Auth route
router.post('/auth/login', authController.login);

// Order route
router.get('/orders', orderController.index);
router.post('/orders', orderController.store);
router.get('/orders/:id', orderController.show);

// Product route
router.get('/products', productController.index);
router.post('/products', productController.store);
router.get('/products/:id', productController.show);
router.patch('/products/:id', productController.update);

// test route
router.get('/test', testController.index);
router.post('/test', testController.post);

router.post('/media', mediaController.store, upload.single('media'));

module.exports = router.create();