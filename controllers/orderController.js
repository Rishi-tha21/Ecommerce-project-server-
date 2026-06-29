const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Place a new order
// @route   POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Step 1: Resolve product IDs and validate stock availability
    const resolvedItems = [];
    const outOfStockItems = [];

    for (const item of orderItems) {
      let productId = item.product;
      let dbProduct;

      // If the ID is a number (from all_product.js), find the real ID by numericId field
      if (typeof productId === "number") {
        dbProduct = await Product.findOne({ numericId: productId });
        if (!dbProduct) {
          return res
            .status(400)
            .json({ message: `Product not found with ID: ${productId}` });
        }
        productId = dbProduct._id;
      } else {
        dbProduct = await Product.findById(productId);
        if (!dbProduct) {
          return res
            .status(400)
            .json({ message: `Product not found with ID: ${productId}` });
        }
      }

      // Check stock availability
      if (dbProduct.stock < item.quantity) {
        outOfStockItems.push({
          name: item.name,
          available: dbProduct.stock,
          requested: item.quantity,
        });
      }

      resolvedItems.push({
        product: productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        dbProduct, // Keep reference for stock decrement
      });
    }

    // If any items are out of stock, reject the order
    if (outOfStockItems.length > 0) {
      return res.status(400).json({
        message: "Some items are out of stock",
        outOfStockItems,
      });
    }

    // Step 2: Process order items (remove dbProduct reference for saving)
    const processedOrderItems = resolvedItems.map(({ dbProduct, ...item }) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const subtotal = processedOrderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const shippingFee = subtotal > 500 ? 0 : 50;
    const totalAmount = subtotal + shippingFee;

    // Step 3: Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      subtotal,
      shippingFee,
      totalAmount,
    });

    // Step 4: Decrement product stock
    for (const item of resolvedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
    }

    // Step 5: Clear user's cart
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name images")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name images")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentStatus = "Paid";
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order stats (Admin)
// @route   GET /api/orders/stats
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    res.json({ totalOrders, totalRevenue, statusCounts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
