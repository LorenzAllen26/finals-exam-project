const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
