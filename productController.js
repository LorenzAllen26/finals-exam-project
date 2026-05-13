const Product = require("../models/productModel");

// CREATE — POST /api/v1/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// READ ALL — GET /api/v1/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// READ ONE — GET /api/v1/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// UPDATE — PATCH /api/v1/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// DELETE — DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
