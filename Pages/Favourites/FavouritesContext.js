import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load favourites from AsyncStorage
  const loadLocalFavourites = async () => {
    try {
      const stored = await AsyncStorage.getItem("favourites");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavourites(parsed);
        }
      }
    } catch (err) {
      console.error("Error loading local favourites:", err);
    }
  };

  // ✅ Save favourites to AsyncStorage
  const saveLocalFavourites = async (data) => {
    try {
      await AsyncStorage.setItem("favourites", JSON.stringify(data));
    } catch (err) {
      console.error("Error saving local favourites:", err);
    }
  };

  // ✅ Fetch from backend API
  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://kvk-backend.onrender.com/api/favourites");
      const text = await response.text();
      console.log("API raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn("Response not valid JSON, using local storage instead");
        data = [];
      }

      if (Array.isArray(data) && data.length > 0) {
        setFavourites(data);
        await saveLocalFavourites(data);
      } else {
        await loadLocalFavourites();
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
      await loadLocalFavourites();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load local first, then backend
  useEffect(() => {
    (async () => {
      await loadLocalFavourites();
      fetchFavourites();
    })();
  }, []);

  // ✅ Check if item is favourite
  const isFavourite = (itemOrId) => {
    if (!Array.isArray(favourites)) return false;
    const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    return favourites.some((fav) => fav.id === id);
  };

  // ✅ Add or remove favourite (sync instantly)
  const toggleFavourite = async (item) => {
    try {
      let updatedFavourites;

      if (isFavourite(item)) {
        // Remove immediately for instant UI feedback
        updatedFavourites = favourites.filter((fav) => fav.id !== item.id);
        setFavourites(updatedFavourites);
        await saveLocalFavourites(updatedFavourites);

        // Then sync with backend (async)
        fetch(`https://kvk-backend.onrender.com/api/favourites/${item.id}`, {
          method: "DELETE",
        }).catch((err) => console.error("Backend remove failed:", err));
      } else {
        // Add instantly
        updatedFavourites = [...favourites, item];
        setFavourites(updatedFavourites);
        await saveLocalFavourites(updatedFavourites);

        // Then sync with backend
        fetch("https://kvk-backend.onrender.com/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch((err) => console.error("Backend add failed:", err));
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        toggleFavourite,
        isFavourite,
        fetchFavourites,
        loading,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouritesContext);
