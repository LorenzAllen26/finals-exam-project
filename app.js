const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

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

// Homepage
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Finals Exam Project</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', sans-serif; color: white;
    }
    .card {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 50px 40px;
      text-align: center;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    h1 { font-size: 2rem; margin-bottom: 10px; }
    p { font-size: 1rem; opacity: 0.85; margin-bottom: 30px; }
    .buttons { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
    a {
      padding: 12px 28px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      font-size: 0.95rem;
      transition: all 0.3s;
    }
    .btn-api {
      background: white; color: #764ba2;
    }
    .btn-api:hover { transform: scale(1.05); }
    .btn-products {
      background: transparent;
      border: 2px solid white;
      color: white;
    }
    .btn-products:hover { background: white; color: #764ba2; transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="card">
    <h1>🛒 Finals Exam Project</h1>
    <p>Your Trusted Local Marketplace - REST API</p>
    <div class="buttons">
      <a href="/api/v1/products" class="btn-api">📡 API</a>
      <a href="/api/v1/products" class="btn-products">🛍️ View Products</a>
    </div>
  </div>
</body>
</html>
  `);
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
