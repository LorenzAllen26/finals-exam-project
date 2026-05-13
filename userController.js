const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// REGISTER — POST /api/v1/users/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({
      status: "success",
      token,
      data: { user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// LOGIN — POST /api/v1/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(401).json({ status: "fail", message: "Incorrect email or password" });

    const token = signToken(user._id);
    res.status(200).json({ status: "success", token });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// GET ALL USERS — GET /api/v1/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
