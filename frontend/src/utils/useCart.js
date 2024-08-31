import { useState, useEffect } from 'react';
import { syncCart, checkout } from '../../api/cartApi';

export const useCart = () => {
    // Stato per gestire localmente il carrello, in caso non esista con un array vuoto
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    });

    // Effetto per sincronizzare il carrello con localStorage e il server ogni volta che cambia
    useEffect(() => {
        // Salva il carrello nel localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Sincronizza il carrello con il server
        syncCart(cart).catch(error => console.error("Errore nella sincronizzazione del carrello", error));
    }, [cart]);

    // Funzione per aggiornare il carrello
    const updateCart = (newCart) => {
        setCart(newCart);
    };

    // Funzione per aggiungere un prodotto o per incrementare la quantità
    const addToCart = (product) => {
        const existingProduct = cart.findIndex( item => item.product === product._id );
        if( existingProduct > -1 ) {
            // Se il prodotto esiste incrementa la quantità
            const newCart = [...cart];
            newCart[existingProduct].quantity += 1;
            updateCart(newCart);
        } else {
            // Se il prodotto non esiste lo aggiungo al carrello
            updateCart([...cart, { product: product._id, quantity: 1, name: product.name }]);
        }
    };

    // Funzione per rimuovere elementi dal carrello
    const removeFromCart = (productId) => {
        updateCart(cart.filter( item => item.product !== productId ));
    };

    // Funzione per aggiornare la quantità dei prodotti nel carrello
    const updateQuantity = (productId, quantity) => {
        updateCart(cart.map(item => item.product === productId ? { ...item, quantity } : item));
    };

    // Funzione per svuotare il carrello
    const clearCart = () => updateCart([]);

    // Funzione per processare l'ordine e svuotare il carrello
    const processCheckout = async() => {
        try{
            // Invia l'ordine al server
            const order = await checkout(cart);
            // Svuoto il carrello dopo l'invio
            clearCart();
            return order;
        } catch(error) {
            console.error("Errore durante il checkout", error);
            throw error;
        }
    };

    // Restituisce le funzioni e lo stato del carrello
    return { cart, addToCart, removeFromCart, updateQuantity, clearCart, processCheckout };
    
};