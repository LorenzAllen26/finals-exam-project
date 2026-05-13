const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

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
    .btn-api { background: white; color: #764ba2; }
    .btn-api:hover { transform: scale(1.05); }
    .btn-products { background: transparent; border: 2px solid white; color: white; }
    .btn-products:hover { background: white; color: #764ba2; transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="card">
    <h1>🛒 Finals Exam Project</h1>
    <p>Your Trusted Local Marketplace - REST API</p>
    <div class="buttons">
      <a href="/api/v1/products" class="btn-api">📡 API</a>
      <a href="/products" class="btn-products">🛍️ View Products</a>
    </div>
  </div>
</body>
</html>
  `);
});

// Pretty Products Page
app.get("/products", async (req, res) => {
  try {
    const Product = require("./models/productModel");
    const products = await Product.find();
    const cards = products.map(p => `
      <div class="card">
        <h2>${p.name}</h2>
        <p class="category">${p.category || "Uncategorized"}</p>
        <p class="desc">${p.description || ""}</p>
        <div class="footer">
          <span class="price">₱${p.price}</span>
          <span class="stock">Stock: ${p.stock}</span>
        </div>
      </div>
    `).join("");

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Products</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', sans-serif;
      padding: 40px 20px;
    }
    h1 { text-align: center; color: white; font-size: 2rem; margin-bottom: 10px; }
    .back { display: block; text-align: center; color: white; margin-bottom: 30px; text-decoration: none; opacity: 0.8; }
    .back:hover { opacity: 1; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .card {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 24px;
      color: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .card h2 { font-size: 1.2rem; margin-bottom: 6px; }
    .category { font-size: 0.8rem; opacity: 0.7; margin-bottom: 10px; text-transform: uppercase; }
    .desc { font-size: 0.9rem; opacity: 0.85; margin-bottom: 16px; }
    .footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 1.3rem; font-weight: bold; }
    .stock { font-size: 0.85rem; opacity: 0.75; }
    .empty { text-align: center; color: white; font-size: 1.2rem; margin-top: 60px; }
  </style>
</head>
<body>
  <h1>🛍️ Products</h1>
  <a class="back" href="/">← Back to Home</a>
  <div class="grid">
    ${cards || '<p class="empty">No products found.</p>'}
  </div>
</body>
</html>
    `);
  } catch (err) {
    res.status(500).send("Error loading products");
  }
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
