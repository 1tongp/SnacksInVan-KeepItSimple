const express = require('express');
const orderRouter = express.Router();

var orderController = require('../controllers/orderController');

// POST request for customer to create a new order
orderRouter.post('/create', orderController.customerOrderCreatePost);

// GET request for vendor to get the orders list under a specific status
orderRouter.get('/:vendorId', orderController.vendorOrderListGet);

// POST request for vendor to change the orders' status 
orderRouter.post('/change/:id', orderController.orderChangePost)

// GET request for customer to get their all order details
orderRouter.get('/', orderController.customerOrderListGet);

orderRouter.get('/search/:id', orderController.orderListGet);

module.exports = orderRouter;