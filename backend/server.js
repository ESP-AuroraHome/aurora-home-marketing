require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");

// Helper to read/write products
const getProducts = () => {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
};

const saveProducts = (products) => {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

const ORDERS_FILE = path.join(__dirname, "data", "orders.json");

// Helper to read/write orders
const getOrders = () => {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
};

const saveOrders = (orders) => {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

// GET /products - Retrieve stock
app.get("/products", (req, res) => {
  res.json(getProducts());
});

// GET /orders - Retrieve order history (Admin)
app.get("/orders", (req, res) => {
    res.json(getOrders());
});

// PUT /products/:id - Update Stock (Admin)
app.put("/products/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const products = getProducts();
        const product = products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        product.stock = parseInt(stock);
        saveProducts(products);
        res.json({ success: true, product });
    } catch (e) {
         res.status(500).json({ error: e.message });
    }
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { items, currency = "eur", deliveryType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).send({ error: "No items in cart" });
    }

    const products = getProducts();
    let totalAmount = 0;

    // Validate stock and calculate total
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return res.status(400).send({ error: `Product ${item.id} not found` });
      }
      // Check stock based on quantity
      const quantity = item.quantity || 1;
      if (product.stock < quantity) {
        return res.status(400).send({ error: `Product ${product.name} has only ${product.stock} left` });
      }
      totalAmount += product.price * quantity;
    }

    // Add Delivery Cost
    if (deliveryType === 'express') {
        totalAmount += 10.00;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
});

// Endpoint to confirm order and decrement stock
app.post("/order/confirm", (req, res) => {
    try {
        const { items, total, deliveryType } = req.body; // Expect extra data for history
        const products = getProducts();
        
        items.forEach(item => {
             const product = products.find(p => p.id === item.id);
             const quantity = item.quantity || 1;
             if (product && product.stock >= quantity) {
                 product.stock -= quantity;
             }
        });

        saveProducts(products);

        // Save Order History
        const orders = getOrders();
        orders.push({
            id: Date.now(),
            date: new Date().toISOString(),
            items,
            total,
            deliveryType
        });
        saveOrders(orders);

        res.send({ success: true, message: "Stock updated and order saved" });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: e.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});
