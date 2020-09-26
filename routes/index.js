const Router = require('./Router');
const router = new Router();
const multer = require('multer');
const upload = multer();
const passport = require('passport');

require('../app/helpers/Passport');

// controllers
const authController = require('../app/controllers/AuthController');
const categoryController = require('../app/controllers/CategoryController');
const orderController = require('../app/controllers/OrderController');
const testController = require('../app/controllers/TestController');
const productController = require('../app/controllers/ProductController');
const mediaController = require('../app/controllers/MediaController');

// Auth route
router.post('/auth/login', authController.login);

// Category route
router.get('/categories', categoryController.index);
router.post('/categories', categoryController.store, passport.authenticate('jwt', {session: false}));
router.get('/categories/:id', categoryController.show, passport.authenticate('jwt', {session: false}));
router.patch('/categories/:id', categoryController.update, passport.authenticate('jwt', {session: false}));
router.delete('/categories/:id', categoryController.destroy, passport.authenticate('jwt', {session: false}));

// Order route
router.get('/orders', orderController.index, passport.authenticate('jwt', {session: false}));
router.post('/orders', orderController.store);
router.get('/orders/:id', orderController.show, passport.authenticate('jwt', {session: false}));

// Product route
router.get('/products', productController.index);
router.post('/products', productController.store, passport.authenticate('jwt', {session: false}));
router.get('/products/:id', productController.show);
router.patch('/products/:id', productController.update, passport.authenticate('jwt', {session: false}));

// test route
router.get('/test', testController.index);
router.post('/test', testController.post);

const multerUpload = upload.single('media');
router.post('/media', function (req, res, next) {
    multerUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
              message: err
            })
        } else if (err) {
            return res.status(400).json({
              message: err
            })
        }
        mediaController.store(req, res)
    });
}, passport.authenticate('jwt', {session: false}));

module.exports = router.create();