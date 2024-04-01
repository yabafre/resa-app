import { useState, useEffect } from 'react';

export function useCart() {
    // Initialiser l'état du panier avec les données du localStorage ou un tableau vide
    const [cart, setCart] = useState(() => {
        try {
            const item = localStorage.getItem('cart');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération du panier:', error);
            return [];
        }
    });

    // Écouter les changements sur l'état 'cart' et mettre à jour le localStorage
    useEffect(() => {
        try {
            const item = JSON.stringify(cart);
            localStorage.setItem('cart', item);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error);
        }
    }, [cart]); // L'effet se déclenche à chaque modification de 'cart'

    function addToCart(newItem) {
        setCart((prevCart) => {
            const exist = prevCart.find((i) => i.id === newItem.id);

            if (exist) {
                // Si l'article existe déjà, augmenter sa quantité
                return prevCart.map((i) =>
                    i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
                );
            }

            // Sinon, ajouter l'article au panier avec une quantité initiale si non spécifiée
            return [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
        });
    }

    function removeFromCart(itemId) {
        setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
    }

    function clearCart() {
        setCart([]);
        localStorage.removeItem('cart');
    }

    return { cart, addToCart, removeFromCart, clearCart};
}
