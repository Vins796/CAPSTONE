import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Products.js";
import { authMiddleware, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Configuro Multer per il salvataggio locale
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Assicurati che questa cartella esista nel tuo progetto
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
  
const upload = multer({ storage: storage });

// GET /products: Ritorna la lista di tutti i prodotti
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

// GET /products/123: ritorna il singolo prodotto
router.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Prodotto non trovato" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// POST /products: crea un nuovo prodotto (solo per admin)
router.post("/", authMiddleware, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const productData = req.body;
        
        // Se è stata caricata un'immagine, aggiungi il percorso ai dati del prodotto
        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        }

        const product = new Product(productData);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /products/123: modifica il prodotto con l'id associato (solo per admin)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Prodotto non trovato" });
      }
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

// PATCH /products/:id/image: aggiorna l'immagine di un prodotto esistente (solo per admin)
router.patch("/:id/image", authMiddleware, isAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }
  
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Prodotto non trovato" });
      }
  
      // Aggiorna il percorso dell'immagine nel prodotto
      product.image = `/uploads/${req.file.filename}`;
      await product.save();
  
      res.json(product);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'immagine del prodotto:", error);
      res.status(500).json({ message: "Errore interno del server" });
    }
});

// DELETE /products/123: cancella il prodotto con l'id associato (solo per admin)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Prodotto non trovato" });
      }
      res.json({ message: "Prodotto eliminato" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

export default router;