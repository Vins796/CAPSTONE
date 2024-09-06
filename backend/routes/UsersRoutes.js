import express from "express";
import User from "../models/Users.js";
import { authMiddleware, isAdmin } from '../middlewares/auth.js';
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');

// Crea la sottocartella 'profiles' se non esiste
if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
}

// Configura Multer per il salvataggio locale
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilesDir)
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// GET /users: Ottiene tutti gli utenti (solo per admin)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /dashboard: Ottiene tutti i dati utenti da leggere per la dashboard
router.get('/dashboard', authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('_id name email');
        res.json(users);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /users/profile: Ottiene il profilo dell'utente loggato
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        res.json(user);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /users/profile/:id: Ottiene il profilo di un utente specifico
router.get('/profile/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        // Verifica che l'utente autenticato possa accedere a questo profilo
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Non autorizzato" });
        }
        res.json(user);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /users/profile: Aggiorna il profilo dell'utente loggato
router.patch('/profile', authMiddleware, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        res.json(updatedUser);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /users/profile/image: Aggiorna l'immagine del profilo dell'utente
router.patch('/profile/image', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        console.log("Richiesta di upload ricevuta");
        console.log("File ricevuto:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Nessuna immagine caricata" });
        }

        const imagePath = `/uploads/profiles/${req.file.filename}`;
        console.log("Percorso immagine salvato:", imagePath);

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { image: imagePath },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        console.log("Immagine del profilo aggiornata per l'utente:", updatedUser._id);

        res.json(updatedUser);
    } catch (err) {
        console.error("Errore nel salvataggio dell'immagine:", err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE /users/:id: Elimina un utente (solo per admin)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        res.json({ message: "Utente eliminato" });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;