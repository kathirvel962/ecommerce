require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRouter = require("./route/auth");
const authMiddleware = require("./middlewares/authMiddleware");
const Order = require("./model/Order");

app.use("/auth", authRouter);


app.get("/products", (req, res) => {
  try {
    const productsData = fs.readFileSync(path.join(__dirname, "data", "products.json"), "utf-8");
    const products = JSON.parse(productsData);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Add new product
app.post("/products", (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    const productsData = fs.readFileSync(path.join(__dirname, "data", "products.json"), "utf-8");
    const products = JSON.parse(productsData);
    
    const newProduct = {
      id: String(products.length + 1),
      name,
      price,
      category,
      image: image || "https://via.placeholder.com/400x300",
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    fs.writeFileSync(path.join(__dirname, "data", "products.json"), JSON.stringify(products, null, 2));
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// Delete product
app.delete("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const productsData = fs.readFileSync(path.join(__dirname, "data", "products.json"), "utf-8");
    let products = JSON.parse(productsData);
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    products.splice(productIndex, 1);
    fs.writeFileSync(path.join(__dirname, "data", "products.json"), JSON.stringify(products, null, 2));
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// Cart routes
app.get("/cart", (req, res) => {
  try {
    const cartData = fs.readFileSync(path.join(__dirname, "data", "cart.json"), "utf-8");
    const cart = JSON.parse(cartData);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error reading cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

app.post("/cart", (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartData = fs.readFileSync(path.join(__dirname, "data", "cart.json"), "utf-8");
    const cart = JSON.parse(cartData);
    
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    
    fs.writeFileSync(path.join(__dirname, "data", "cart.json"), JSON.stringify(cart, null, 2));
    res.status(200).json({ message: "Added to cart successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

app.put("/cart/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartData = fs.readFileSync(path.join(__dirname, "data", "cart.json"), "utf-8");
    let cart = JSON.parse(cartData);
    
    const itemIndex = cart.findIndex((item, index) => index === parseInt(id));
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    cart[itemIndex].quantity = quantity;
    fs.writeFileSync(path.join(__dirname, "data", "cart.json"), JSON.stringify(cart, null, 2));
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

app.delete("/cart/:id", (req, res) => {
  try {
    const { id } = req.params;
    const cartData = fs.readFileSync(path.join(__dirname, "data", "cart.json"), "utf-8");
    let cart = JSON.parse(cartData);
    
    cart.splice(parseInt(id), 1);
    fs.writeFileSync(path.join(__dirname, "data", "cart.json"), JSON.stringify(cart, null, 2));
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// Orders routes
app.get("/orders", authMiddleware, async (req, res) => {
  try {
    // Filter orders by user email
    const userOrders = await Order.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error reading orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.post("/orders", authMiddleware, async (req, res) => {
  console.log("=== ORDER REQUEST RECEIVED ===");
  console.log("User:", req.user);
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    
    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Validation failed: Invalid items");
      return res.status(400).json({ message: "Order must contain at least one item" });
    }
    
    if (!total || total <= 0) {
      console.error("Validation failed: Invalid total");
      return res.status(400).json({ message: "Invalid order total" });
    }
    
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      console.error("Validation failed: Invalid shipping address");
      return res.status(400).json({ message: "Complete shipping address is required" });
    }
    
    console.log("Validation passed, creating order in database...");
    
    const newOrder = new Order({
      user: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name || req.user.email,
      items,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      status: "pending",
      paymentStatus: "pending"
    });
    
    await newOrder.save();
    console.log("Order saved to database:", newOrder._id);
    
    // Clear cart after order
    console.log("Clearing cart...");
    fs.writeFileSync(path.join(__dirname, "data", "cart.json"), JSON.stringify([], null, 2));
    
    console.log("Order placed successfully:", newOrder._id);
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("=== ORDER ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
});

app.get("/orders/all", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error reading orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Protected route example
app.get("/api/profile", authMiddleware, (req, res) => {
  res.status(200).json({ 
    message: "User Profile", 
    user: req.user 
  });
});

// Database connection
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;

// Start server regardless of DB connection
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB (non-blocking)
connectDB().catch(error => {
  console.error("MongoDB connection failed, but server is still running for JSON-based routes");
});