import express from "express";
import Order from "../models/Orders.js";
import { authMiddleware, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /orders: Ritorna tutti gli ordini (solo per admin)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.json(orders);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /orders/user: Ritorna gli ordini dell'utente loggato
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /orders/:id: Ritorna un singolo ordine
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Ordine non trovato" });
        }
        // Verifica che l'utente sia autorizzato a vedere questo ordine
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorizzato" });
        }
        res.json(order);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /orders: Crea un nuovo ordine
router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log('Dati ricevuti:', req.body);
        console.log('User ID:', req.user?._id);
        const { items, total } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Dati dell'ordine non validi" });
        }
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Utente non autenticato" });
        }

        const orderData = { 
            user: req.user._id,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            })),
            total
        };
        
        console.log('Order data:', orderData);
        
        const order = new Order(orderData);
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch(err) {
        console.error('Errore dettagliato:', err);
        res.status(400).json({ message: err.message });
    }
});

// PUT /orders/:id: Aggiorna lo stato di un ordine (solo per admin)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Ordine non trovato" });
        }
        res.json(updatedOrder);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;