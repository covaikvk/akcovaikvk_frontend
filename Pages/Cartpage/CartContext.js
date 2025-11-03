// CartContext.js
import React, { createContext, useState } from "react";
import { Dimensions } from "react-native";

export const CartContext = createContext();

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobileSize, tabletSize) =>
  isTablet ? tabletSize : mobileSize;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // ✅ Add item to cart or increase quantity
  const addToCart = (item) => {
    setOrderSubmitted(false);

    setCartItems((prev) => {
      const name =
        item.name ||
        item.dishTitle ||
        item.dishName ||
        item.title ||
        item.food_name ||
        item.foodName ||
        item.product_name ||
        item.item_name ||
        item.itemName ||
        item.label ||
        item.desc?.split(" ")[0] ||
        "Test Product";

      // ❌ FIXED BUG: wrong string interpolation inside template literal
      const id =
        item.id ||
        item._id ||
        `${name}-${item.price}` ||
        Math.random().toString();

      const price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("₹", "").trim()) || 0
          : item.price || 0;

      const desc = item.desc || item.description || "";

      let image = null;
      if (item.image) {
        if (typeof item.image === "number") {
          image = item.image; // local require()
        } else if (typeof item.image === "object" && item.image.uri) {
          image = item.image;
        }
      } else if (item.image_url) {
        image = { uri: item.image_url };
      }

      const existing = prev.find((i) => i.id === id);

      const cartItem = {
        id,
        name,
        price,
        desc,
        image,
      };

      if (existing) {
        // Increment quantity if already in cart
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Add new item
        return [...prev, { ...cartItem, quantity: 1 }];
      }
    });
  };

  // ✅ Decrease quantity or remove item if qty = 0
  const removeFromCart = (idOrName) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === idOrName || i.name === idOrName
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // ✅ For CartScreen compatibility
  const incrementQuantity = (name) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.name === name ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrementQuantity = (name) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.name === name ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // ✅ Helper: get quantity for a given id or name
  const getQty = (idOrName) => {
    const item = cartItems.find(
      (i) => i.id === idOrName || i.name === idOrName
    );
    return item ? item.quantity : 0;
  };

  const clearCart = () => setCartItems([]);

  const submitOrder = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      setOrderSubmitted(true);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getQty,
        submitOrder,
        orderSubmitted,
        setOrderSubmitted,
        responsiveSize,
        isTablet,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
