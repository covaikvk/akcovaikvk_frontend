// ✅ FoodTypeContext.js
import React, { createContext, useState } from "react";

export const FoodTypeContext = createContext();

export const FoodTypeProvider = ({ children }) => {
  const [isVeg, setIsVeg] = useState(true); // default Veg
  return (
    <FoodTypeContext.Provider value={{ isVeg, setIsVeg }}>
      {children}
    </FoodTypeContext.Provider>
  );
};
