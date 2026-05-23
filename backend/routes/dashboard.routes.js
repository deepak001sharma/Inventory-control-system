import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const lowStockItems = await Product.countDocuments({
      quantity: { $lt: 5 },
    });

    res.json({
      totalProducts,
      totalCategories,
      lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;