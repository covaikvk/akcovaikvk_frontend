import React, { createContext, useState, useContext } from "react";

const QuotationContext = createContext();

export const useQuotation = () => useContext(QuotationContext);

export const QuotationProvider = ({ children }) => {
  const [quotationItems, setQuotationItems] = useState([]);

  const addToQuotation = (item) => {
    setQuotationItems((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // ✅ Fixed version
  const removeFromQuotation = (itemId) => {
    setQuotationItems((prev) => {
      const existing = prev.find((x) => x.id === itemId);
      if (!existing) return prev;

      if (existing.quantity > 1) {
        // Decrease only
        return prev.map((x) =>
          x.id === itemId ? { ...x, quantity: x.quantity - 1 } : x
        );
      } else {
        // Remove completely
        return prev.filter((x) => x.id !== itemId);
      }
    });
  };

  const clearQuotation = () => {
    setQuotationItems([]);
  };

  return (
    <QuotationContext.Provider
      value={{
        quotationItems,
        addToQuotation,
        removeFromQuotation,
        clearQuotation,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};