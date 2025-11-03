import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../../Pages/Cartpage/CartContext";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function Addeditem() {
  const { cartItems = [], clearCart } = useContext(CartContext);
  const navigation = useNavigation();

  const { totalQuantity, totalPrice } = useMemo(() => {
    if (!Array.isArray(cartItems)) return { totalQuantity: 0, totalPrice: 0 };
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    return { totalQuantity, totalPrice };
  }, [cartItems]);

  // ✅ Hide when cart is empty
  if (!cartItems.length) return null;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: responsiveSize(75, 95),
          left: responsiveSize(16, 30),
          right: responsiveSize(16, 30),
        },
      ]}
    >
      {/* Offer Banner */}
      <View style={[styles.offerBanner]}>
        <Text style={styles.offerText}>
          Add items worth ₹103 to save ₹125 | Code <Text style={{ fontWeight: "bold" }}>FLAVORFUL</Text>
        </Text>
      </View>

      {/* Cart Bar */}
      <View style={styles.cartBar}>
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>
            {totalQuantity} item{totalQuantity > 1 ? "s" : ""} | ₹{totalPrice}
          </Text>
          <TouchableOpacity onPress={clearCart} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#173b01" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.viewCartBtn}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
          <Ionicons name="chevron-forward" size={18} color="#173b01" />
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
  },
  offerBanner: {
    backgroundColor: "#173b01",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  offerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 13,
  },
  cartBar: {
    backgroundColor: "#d6eeb9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontWeight: "bold",
    color: "#173b01",
    marginRight: 8,
  },
  deleteBtn: { padding: 4 },
  viewCartBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewCartText: {
    fontWeight: "bold",
    color: "#173b01",
    marginRight: 5,
  },
});
