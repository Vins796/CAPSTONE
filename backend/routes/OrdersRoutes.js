import express from "express";
import Order from "../models/Orders.js";
import Product from "../models/Products.js";
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
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name')
            .exec();
        
        // Formatta gli ordini per includere i nomi dei prodotti
        const ordersWithProductNames = orders.map(order => ({
            ...order.toObject(),
            items: order.items.map(item => ({
                ...item,
                id: item._id || item.product?._id || `temp-${Date.now()}-${Math.random()}`,
                productName: item.productName || item.product?.name || "Nome non disponibile",
                quantity: item.quantity
            }))
        }));

        res.json(ordersWithProductNames);
    } catch(err) {
        console.error("Errore nel recupero degli ordini:", err);
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
                productName: item.name,
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

// PUT /orders/:id/status: Aggiorna lo stato di un ordine (solo per admin)
router.put('/:id/status', authMiddleware, isAdmin, async (req, res) => {
    console.log("Ricevuta richiesta di aggiornamento stato dell'ordine", req.params.id);
    console.log("Headers della richiesta", req.headers);
    console.log("Corpo della richiesta", req.body);
    console.log("Tipo di req.body:", typeof req.body);

    const { status } = req.body;
    const orderId = req.params.id;

    console.log("Status ricevuto", status);

    if(!status) {
        return res.status(400).json({ message: "Stato dell'ordine non specificato" })
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Ordine non trovato" });
        }
        console.log("Ordine aggiornato:", updatedOrder);
        res.json(updatedOrder);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /orders/:orderId/items/:itemId: Rimuove un articolo da un ordine
router.delete('/:orderId/items/:itemId', authMiddleware, async (req, res) => {
    try {
      const { orderId, itemId } = req.params;
      const userId = req.user._id;
  
      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) {
        return res.status(404).json({ message: 'Ordine non trovato o non autorizzato' });
      }
  
      const itemIndex = order.items.findIndex(item => 
        item._id.toString() === itemId || item.product.toString() === itemId
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item non trovato nell\'ordine' });
      }
  
      order.items.splice(itemIndex, 1);
      order.total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (order.items.length === 0) {
        await Order.findByIdAndDelete(orderId);
        return res.json({ message: 'Ordine eliminato completamente' });
      } else {
        await order.save();
        res.json(order);
      }
    } catch (err) {
      console.error("Errore nella rimozione dell'item:", err);
      res.status(500).json({ message: "Errore interno del server" });
    }
});

// DELETE /orders/:orderId: Elimina un intero ordine (solo per user)
router.delete('/:orderId', authMiddleware, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user._id;

        // Trova l'ordine e verifica che appartenga all'utente corrente
        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ message: 'Ordine non trovato o non autorizzato' });
        }

        // Elimina l'ordine
        await Order.findByIdAndDelete(orderId);

        res.json({ message: "Ordine eliminato con successo!" });
    } catch (err) {
        console.error("Errore nella cancellazione dell'ordine:", err);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

export default router;