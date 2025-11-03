import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FavouriteIcon({ size = 18, initial = false, onToggle }) {
  const [isFavourite, setIsFavourite] = useState(initial);

  const toggle = () => {
    const newState = !isFavourite;
    setIsFavourite(newState);
    if (onToggle) onToggle(newState); // callback to parent if needed
  };

  return (
    <TouchableOpacity onPress={toggle} style={styles.iconContainer}>
      <Ionicons
        name={isFavourite ? "heart" : "heart-outline"}
        size={size}
        color={isFavourite ? "red" : "#666"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 2,
    zIndex: 1,
  },
});
