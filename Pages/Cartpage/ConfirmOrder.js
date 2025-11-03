import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");

// ✅ Responsive scale (works smoothly across screen sizes)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) => (width / guidelineBaseWidth) * size;

export default function ConfirmOrder({ navigation }) {
  const { cartItems, incrementQuantity, decrementQuantity } = useContext(CartContext);

  const deliveryFee = 50;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!cartItems.length) {
    Alert.alert("Cart Empty", "Your cart is empty!");
    navigation.goBack();
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rs.{item.price}</Text>
      </View>
      <View style={styles.qtyContainer}>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => decrementQuantity(item.name)}
        >
          <Text style={styles.qtyText}> - </Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => incrementQuantity(item.name)}
        >
          <Text style={styles.qtyText}> + </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.confirmorderheader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.confirmorderheaderTitle}>Confirm Order</Text>
        <View style={{ width: scale(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          {/* Cart Items */}
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Total Items</Text>
              <Text style={styles.value}>{totalItems}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>Rs.{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Delivery Fee</Text>
              <Text style={styles.value}>Rs.{deliveryFee}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rs.{total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>EDIT ORDER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectAddressButton}
              onPress={() => navigation.navigate("SelectAddress",{
                cartItems: cartItems, // <-- pass cart items from context
              })}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>
                SELECT ADDRESS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf7e9" },

  confirmorderheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
  },
  confirmorderheaderTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#2d5e2f",
  },

  scrollContent: { paddingBottom: scale(40) },
  contentWrapper: {
    width: "100%",
    paddingHorizontal: scale(16),
    alignSelf: "center",
    maxWidth: 600,
  },

  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#D6EFB7",
    borderRadius: 12,
    padding: scale(12),
    marginBottom: scale(12),
    alignItems: "center",
  },
  itemImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: 10,
  },
  itemInfo: { flex: 1, marginLeft: scale(10) },
  itemName: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: "#2d5e2f",
  },
  itemPrice: {
    color: "red",
    fontSize: scale(14),
    marginTop: 4,
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
  },
  qtyButton: {
    backgroundColor: "#2d5e2f",
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: 5,
  },
  qtyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scale(18),
  },
  qtyNumber: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#2d5e2f",
    marginHorizontal: scale(8),
  },

  summaryContainer: {
    backgroundColor: "#D6EFB7",
    padding: scale(16),
    borderRadius: 12,
    elevation: 3,
    marginTop: scale(20),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: scale(4),
  },
  label: {
    fontSize: scale(16),
    color: "#2d5e2f",
    fontWeight: "500",
  },
  value: {
    fontSize: scale(16),
    color: "#2d5e2f",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#2d5e2f",
  },
  totalValue: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "red",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: scale(8),
  },

  buttonContainer: {
    marginTop: scale(16),
    marginBottom: scale(24),
  },
  editButton: {
    backgroundColor: "#fff",
    borderColor: "#2d5e2f",
    borderWidth: 1.5,
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
    marginBottom: scale(12),
  },
  selectAddressButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
    marginBottom: scale(12),
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: scale(16),
    color: "#2d5e2f",
  },
});

