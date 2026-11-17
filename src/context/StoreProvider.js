'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedCart = window.localStorage.getItem('veeluxe-cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Unable to load cart from local storage', error);
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedWishlist = window.localStorage.getItem('veeluxe-wishlist');
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error('Unable to load wishlist from local storage', error);
      return [];
    }
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('veeluxe-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('veeluxe-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product, quantity = 1) => {
    const quantityToAdd = Math.max(1, Math.floor(Number(quantity) || 1));
    setCartItems((current) => {
      const cartKey = `${product.id}-${product.selectedSize || 'default'}`;
      const existing = current.find((item) => item.cartKey === cartKey || (!item.cartKey && item.id === product.id));
      if (existing) {
        return current.map((item) =>
          (item.cartKey === cartKey || (!item.cartKey && item.id === product.id)) ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      return [...current, { ...product, cartKey, quantity: quantityToAdd }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.cartKey !== id && item.id !== id) return [item];
        if (quantity <= 0) return [];
        return [{ ...item, quantity }];
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((current) => current.filter((item) => item.cartKey !== id && item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (product) => {
    setWishlistItems((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      hydrated,
      cartItems,
      wishlistItems,
      cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      wishlistCount: wishlistItems.length,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
    }),
    [cartItems, hydrated, wishlistItems]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return context;
}
