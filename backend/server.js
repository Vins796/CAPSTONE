// Importo le dipendenze necessarie
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as Auth0Strategy } from 'passport-auth0';

// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler,
} from "./middlewares/errorHandler.js";

// Importo le route
import authRoutes from './routes/AuthRoutes.js';
import productRoutes from './routes/ProductsRoutes.js';
import orderRoutes from './routes/OrdersRoutes.js';
import cartRoutes from './routes/CartRoutes.js';
import userRoutes from './routes/UsersRoutes.js';

// Configuro le variabili d'ambiente (.env)
dotenv.config();

// Inizializzo l'applicazione Express
const app = express();

// Connessione al database MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => console.error("Errore di connessione MongoDB:", err));


// Ottiene il percorso del file corrente
const __filename = fileURLToPath(import.meta.url);
// Ottiene la directory del file corrente
const __dirname = path.dirname(__filename);

// Servo staticamente la cartella degli upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Configurazione Auth0
const auth0Strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);

// passport.use(auth0Strategy);
app.use(passport.initialize());

// Definizione delle routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Applicazione dei middleware per la gestione degli errori
app.use(badRequestHandler); // Gestisce errori 400 Bad Request
app.use(unauthorizedHandler); // Gestisce errori 401 Unauthorized
app.use(notFoundHandler); // Gestisce errori 404 Not Found
app.use(genericErrorHandler); // Gestisce tutti gli altri errori

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 5001;

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
  
    // Stampa tutte le rotte disponibili in formato tabellare
    console.log("Rotte disponibili:");
    console.table(
      listEndpoints(app).map((route) => ({
        path: route.path,
        methods: route.methods.join(", "),
      })),
    );
});