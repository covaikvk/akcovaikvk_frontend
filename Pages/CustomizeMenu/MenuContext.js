import React, { createContext, useState } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState({});

  /** ✅ Deep Clone Utility (for safe state updates) */
  const deepClone = (obj) => {
    try {
      if (typeof structuredClone === "function") {
        return structuredClone(obj);
      } else {
        return JSON.parse(JSON.stringify(obj));
      }
    } catch (err) {
      console.warn("Clone failed, returning shallow copy:", err);
      return { ...obj };
    }
  };

  /** ✅ Add or Replace items for a specific day & meal */
  const addItemsToMenu = (day, meal, items) => {
    setMenu((prevMenu) => {
      const updatedMenu = deepClone(prevMenu);
      if (!updatedMenu[day]) updatedMenu[day] = {};

      // Always overwrite with new items array
      updatedMenu[day][meal] = Array.isArray(items) ? [...items] : [];

      return updatedMenu;
    });
  };

  /** ✅ Safely fetch item names (used in CustomizeMenuScreen table) */
  const getItemNames = (day, meal) => {
    try {
      const items =
        menu?.[day]?.[meal] && Array.isArray(menu[day][meal])
          ? menu[day][meal]
          : [];

      // Support both plain strings and objects with { name, price }
      return items.map((item) =>
        typeof item === "string" ? item : item?.name || ""
      );
    } catch (err) {
      console.warn("getItemNames error:", err);
      return [];
    }
  };

  /** ✅ Remove items for a specific day-meal */
  const removeItemsForDayMeal = (day, meal) => {
    setMenu((prevMenu) => {
      const updatedMenu = deepClone(prevMenu);
      if (updatedMenu[day]?.[meal]) {
        updatedMenu[day][meal] = [];
      }
      return updatedMenu;
    });
  };

  /** ✅ Get all current items (useful for review or submit payload) */
  const getAllItems = () => deepClone(menu);

  /** ✅ Calculate total price safely */
  const calculateTotalPrice = () => {
    let total = 0;
    if (!menu || typeof menu !== "object") return total;

    Object.values(menu).forEach((dayMeals) => {
      if (!dayMeals || typeof dayMeals !== "object") return;
      Object.values(dayMeals).forEach((items) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            // Handle both numeric and string prices
            const price = parseFloat(item?.price || item?.item_price || 0);
            if (!isNaN(price)) total += price;
          });
        }
      });
    });

    return total;
  };

  /** ✅ Clear entire weekly menu (used after placing an order) */
  const clearMenu = () => setMenu({});

  /** ✅ Reorder menu data into context */
  const setMenuDataFromReorder = (orderData) => {
    if (!orderData) return;
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const newMenu = {};
    days.forEach((day) => {
      if (Array.isArray(orderData[day])) {
        newMenu[day] = {};
        orderData[day].forEach((mealObj) => {
          if (mealObj.meal && Array.isArray(mealObj.items)) {
            newMenu[day][mealObj.meal] = mealObj.items;
          }
        });
      }
    });

    setMenu(newMenu);
    console.log("✅ Menu data set from reorder:", newMenu);
  };

  return (
    <MenuContext.Provider
      value={{
        menu,
        addItemsToMenu,
        getItemNames,
        removeItemsForDayMeal,
        getAllItems,
        calculateTotalPrice,
        clearMenu,
        setMenuDataFromReorder, // ✅ added this function for reorders
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
