const express = require('express');
const router = express.Router();
const multer = require('multer');
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
router.post('/categories', passport.authenticate('jwt', {session: false}), categoryController.store);
router.get('/categories/:id', passport.authenticate('jwt', {session: false}), categoryController.show);
router.patch('/categories/:id', passport.authenticate('jwt', {session: false}), categoryController.update);
router.delete('/categories/:id', passport.authenticate('jwt', {session: false}), categoryController.destroy);

// Order route
router.get('/orders', passport.authenticate('jwt', {session: false}), orderController.index);
router.post('/orders', orderController.store);
router.get('/orders/:id', orderController.show);

// Product route
router.get('/products', productController.index);
router.post('/products', passport.authenticate('jwt', {session: false}), productController.store);
router.get('/products/:id', productController.show);
router.patch('/products/:id', passport.authenticate('jwt', {session: false}), productController.update);
router.delete('/products/:id', passport.authenticate('jwt', {session: false}), productController.delete);

// test route
router.get('/test', testController.index);
router.post('/test', testController.post);

const multerUpload = multer().single('media');
router.post('/media', passport.authenticate('jwt', {session: false}), multerUpload, mediaController.store);

module.exports = router;