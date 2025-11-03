import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ViewCart({ itemCount, onPress, onDelete }) {
  return (
    <View style={styles.container}>
      {/* TOP GREEN OFFER BAR */}
      <View style={styles.offerBanner}>
        <Text style={styles.offerText}>
          Add items worth ₹103 to save ₹125 | Code{" "}
          <Text style={{ fontWeight: "bold" }}>FLAVORFUL</Text>
        </Text>
      </View>

      {/* BOTTOM LIGHT GREEN CART ROW */}
      <View style={styles.cartBar}>
        <View style={styles.leftRow}>
          <Text style={styles.itemText}>
            {itemCount} item{itemCount > 1 ? "s" : ""} Added
          </Text>

          {itemCount > 0 && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
              <Ionicons name="trash" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={onPress} style={styles.viewCartBtn}>
          <Text style={styles.viewCartText}>View Cart</Text>
          <Ionicons name="chevron-forward" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    borderRadius: 12,
    overflow: "hidden", // round both top and bottom sections
    zIndex: 999,
    elevation: 3,
  },
  offerBanner: {
    backgroundColor: "#2d5e2f",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  offerText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  cartBar: {
    backgroundColor: "#d6eeb9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  deleteBtn: {
    marginLeft: 10,
    padding: 4,
  },
  viewCartBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewCartText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    marginRight: 4,
  },
});
