import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../../Pages/Cartpage/CartContext";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");
const scale = width / 375;
const normalize = (size) => Math.round(size * scale);

export default function CartScreen({ navigation }) {
  // ✅ Match function names from context
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const renderItem = ({ item }) => {
    const imageSource =
      typeof item.image === "string" ? { uri: item.image } : item.image;

    return (
      <View style={styles.card}>
        <View style={styles.imageBackground}>
          <Image source={imageSource} style={styles.foodImage} resizeMode="cover" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodDesc}>{item.desc}</Text>
          <Text style={styles.foodPrice}>₹{item.price}</Text>
        </View>
        <View style={styles.qtyContainer}>
          {/* ✅ now uses removeFromCart */}
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          {/* ✅ now uses addToCart */}
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      {/* HEADER */}
      <View style={styles.cartscreenheader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.headingText}>Cart</Text>
      </View>

      {/* CART ITEMS */}
      <ScrollView contentContainerStyle={{ padding: normalize(16), paddingBottom: normalize(140) }}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty!</Text>
        ) : (
          cartItems.map((item, index) => <View key={index}>{renderItem({ item })}</View>)
        )}
      </ScrollView>

      {/* FOOTER */}
      <Footer />

      {/* CONFIRM ORDER BUTTON */}
      {cartItems.length > 0 && (
        <View style={styles.confirmBar}>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => navigation.navigate("ConfirmOrder", { cartItems })}
          >
            <Text style={styles.confirmText}>Confirm Order</Text>
            <Ionicons name="chevron-forward" size={normalize(16)} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const PRIMARY_GREEN = "#2d5e2f";

const styles = StyleSheet.create({
  cartscreenheader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(12),
    backgroundColor: "#eaf7e9",
    borderBottomColor: "#ddd",
    justifyContent: "center",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: normalize(12),
  },
  headingText: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: PRIMARY_GREEN,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: normalize(20),
    fontSize: normalize(16),
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: normalize(12),
    flexDirection: "row",
    alignItems: "center",
    padding: normalize(12),
    marginBottom: normalize(12),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imageBackground: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(15),
    backgroundColor: "#f0f6f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: normalize(12),
  },
  foodImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(12),
  },
  foodName: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: PRIMARY_GREEN,
  },
  foodDesc: {
    fontSize: normalize(13),
    color: "#555",
    marginTop: normalize(2),
  },
  foodPrice: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: PRIMARY_GREEN,
    marginTop: normalize(4),
  },
  qtyContainer: { flexDirection: "row", alignItems: "center", marginLeft: normalize(8) },
  qtyBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(3),
    borderRadius: normalize(5),
  },
  qtyText: { color: "#fff", fontWeight: "bold", fontSize: normalize(20) },
  qtyNumber: { marginHorizontal: normalize(8), fontWeight: "bold", fontSize: normalize(20) },
  confirmBar: {
    position: "absolute",
    bottom: normalize(90),
    left: normalize(16),
    right: normalize(16),
    alignItems: "center",
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(14),
    borderRadius: normalize(30),
    elevation: 3,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: normalize(6),
    fontSize: normalize(16),
  },
});
