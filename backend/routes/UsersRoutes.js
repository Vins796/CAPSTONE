import express from "express";
import User from "../models/Users.js";
import { authMiddleware, isAdmin } from '../middlewares/auth.js';
import multer from "multer";
import path from "path";

// Configura Multer per il salvataggio locale
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profiles/') // Assicurati che questa cartella esista
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

// POST /users: Crea un nuovo utente (solo per test)
// router.post('/', async (req, res) => {
//     try {
//         const newUser = new User(req.body);
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// PUT /users/profile: Aggiorna il profilo dell'utente loggato
router.put('/profile', authMiddleware, async (req, res) => {
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
        if (!req.file) {
            return res.status(400).json({ message: "Nessuna immagine caricata" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { image: `/uploads/profiles/${req.file.filename}` },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        res.json(updatedUser);
    } catch (err) {
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