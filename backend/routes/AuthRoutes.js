import express from 'express';
import jwt from 'jsonwebtoken';
import { generateJWT } from '../token/jwt.js';
import User from '../models/Users.js';

const router = express.Router();

// Funzione per verificare se un'email è admin
// In AuthRoutes.js
const isAdminEmail = (email) => {
  if (!email) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  console.log('Admin email from env:', adminEmail);
  console.log('User email:', email);
  const isAdmin = email.toLowerCase() === adminEmail.toLowerCase();
  console.log('Is admin?', isAdmin);
  return isAdmin;
};

router.get('/test-admin/:email', (req, res) => {
  const { email } = req.params;
  const isAdmin = isAdminEmail(email);
  res.json({ email, isAdmin, adminEmail: process.env.ADMIN_EMAIL });
});

// Rotta per gestire il callback di Auth0 e creare/aggiornare l'utente nel tuo database
router.post('/auth0-callback', async (req, res) => {
try {
  const { id_token } = req.body;
  // Verifica il token di Auth0
  const decodedToken = jwt.decode(id_token);

  if (!decodedToken) {
    return res.status(401).json({ message: 'Token non valido' });
  }

  const userEmail = decodedToken.email || null;
  const isAdmin = isAdminEmail(userEmail);
  const userId = decodedToken.sub; // Usa sempre 'sub' come identificatore univoco

  // Cerca l'utente nel database o creane uno nuovo
  let user = await User.findOne({ authId: userId });
  if (!user) {
    user = new User({
      authId: userId,
      email: userEmail,
      name: decodedToken.name || decodedToken.nickname,
      role: isAdminEmail(userEmail) ? 'admin' : 'user'
    });
  } else {
    // Aggiorna il ruolo se l'email è nella lista admin e l'utente non è già admin
    if (userEmail && isAdminEmail(userEmail) && user.role !== 'admin') {
      user.role = 'admin';
    }
  }
  await user.save();

  // Genera il tuo JWT interno
  const token = await generateJWT(user);

  console.log('Token salvato:', token);
  console.log('Decoded token:', decodedToken);
  console.log('User email:', userEmail);
  console.log('Is admin?', isAdmin);
  console.log('User found in DB:', user);

  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
} catch (error) {
  console.error("Errore dettagliato durante l'autenticazione:", error);
  res.status(500).json({ 
    message: "Errore durante l'autenticazione", 
    error: error.message,
    stack: error.stack 
  });
}
});

export default router;