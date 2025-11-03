import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../../Pages/Cartpage/CartContext";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function CustomizeAdd3({ day, meal, addItemsToMenu, itemCount, onPress, onDelete }) {
  const { cartItems, clearCart } = useContext(CartContext);

  if (!cartItems || cartItems.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: responsiveSize(10, 95),
          left: responsiveSize(16, 30),
          right: responsiveSize(16, 30),
        },
      ]}
    >
      <View
        style={[
          styles.offerBanner,
          { paddingVertical: responsiveSize(8, 12), paddingHorizontal: responsiveSize(10, 16) },
        ]}
      >
        <Text style={[styles.offerText, { fontSize: responsiveSize(13, 16) }]}>
          Where taste meets tradition. <Text style={{ fontWeight: "bold" }}></Text>
        </Text>
      </View>

      <View
        style={[
          styles.cartBar,
          { paddingVertical: responsiveSize(12, 16), paddingHorizontal: responsiveSize(16, 20) },
        ]}
      >
        <View style={styles.itemRow}>
          <Text style={[styles.itemText, { fontSize: responsiveSize(16, 20), marginRight: responsiveSize(8, 12) }]}>
            {cartItems.length} item{cartItems.length > 1 ? "s" : ""} Added
          </Text>
          <TouchableOpacity onPress={clearCart} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={responsiveSize(20, 24)} color="#173b01" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.okBtn}
          onPress={() => {
            if (addItemsToMenu && day && meal) {
              addItemsToMenu(day, meal, cartItems);
            }
            onPress?.();
          }}
        >
          <Text style={[styles.okText, { fontSize: responsiveSize(16, 20) }]}>OK</Text>
          <Ionicons name="chevron-forward" size={responsiveSize(18, 22)} color="#173b01" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    backgroundColor: "transparent",
  },
  offerBanner: { backgroundColor: "#173b01" },
  offerText: { color: "#fff", textAlign: "center" },
  cartBar: { backgroundColor: "#d6eeb9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemText: { fontWeight: "bold", color: "#173b01" },
  deleteBtn: { padding: 4 },
  okBtn: { flexDirection: "row", alignItems: "center" },
  okText: { fontWeight: "bold", color: "#173b01", marginRight: 5 },
});
