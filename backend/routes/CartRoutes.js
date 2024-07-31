import express from "express";
import Cart from "../models/Cart.js";
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// GET /cart: Ottiene il carrello dell'utente
router.get('/', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /cart/add: Aggiunge un prodotto al carrello
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        
        await cart.save();
        res.json(cart);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /cart/update: Aggiorna la quantità di un prodotto nel carrello
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Carrello non trovato" });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            return res.status(404).json({ message: "Prodotto non trovato nel carrello" });
        }
        
        await cart.save();
        res.json(cart);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /cart/remove/:productId: Rimuove un prodotto dal carrello
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Carrello non trovato" });
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        
        await cart.save();
        res.json(cart);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;