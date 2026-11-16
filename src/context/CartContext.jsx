import React, { useState, useContext, createContext } from 'react';

// CONTEXTO: canal compartido por el que viajan el carrito y sus funciones
// a cualquier componente de la app, sin pasar props nivel por nivel.
export const CartContext = createContext();

// CONSUMER: hook que lee el contexto. Lo usan los componentes (Header, Cart,
// tarjetas de producto) para acceder al carrito.
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};

// PROVIDER: componente que guarda el estado del carrito y lo publica en el
// contexto. Debe envolver a los componentes que lo consumen (ver main.jsx).
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    // Señal que cambia en cada vaciado del carrito.
    const [resetVersion, setResetVersion] = useState(0);

    const updateQuantity = (product, quantity) => {
        const newQuantity = Number(quantity) || 0;
        if (newQuantity <= 0) {
            removeItem(product.id);
            return;
        }
        setCart((prevCart) => {
            const itemInCart = prevCart.find((item) => item.id === product.id);
            if (itemInCart) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            }
            return [...prevCart, { ...product, quantity: newQuantity }];
        });
    };

    const removeItem = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const isInCart = (productId) => {
        return cart.some((item) => item.id === productId);
    };

    const clearCart = () => {
        setCart([]);
        setResetVersion((version) => version + 1);
    };

    const getCartQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + Number(item.precio) * item.quantity, 0);
    };

    const getCantidadActual = (productId) => {
        const item = cart.find((item) => item.id === productId);
        return item ? item.quantity : 0;
    };

    const incrementQuantity = (productId) => {
        setCart((prevCart) => {
            const itemInCart = prevCart.find((item) => item.id === productId);
            if (itemInCart) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return prevCart;
        });
    };

    const decrementQuantity = (productId) => {
        setCart((prevCart) => {
            const itemInCart = prevCart.find((item) => item.id === productId);
            if (itemInCart && itemInCart.quantity > 1) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else if (itemInCart && itemInCart.quantity === 1) {
                return prevCart.filter((item) => item.id !== productId);
            }
            return prevCart;
        });
    };

    // Todo lo que esté en "value" queda disponible para los consumers.
    return (
        <CartContext.Provider value={{ cart, updateQuantity, removeItem, isInCart, clearCart, getCartQuantity, getCartTotal, getCantidadActual, resetVersion, incrementQuantity, decrementQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
