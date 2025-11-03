import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CartContext } from "../../Pages/Cartpage/CartContext";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (width / guidelineBaseWidth) * size;

export default function RegularMenuAddress({ route, navigation }) {
  const { menuDetails, cartItems } = route.params || {};
  const menu = menuDetails || (cartItems && cartItems[0]) || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { clearCart } = useContext(CartContext);

  // ✅ Load saved addresses when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadAddresses = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) return;

          const response = await fetch("https://kvk-backend.onrender.com/api/address", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await response.json();
          if (response.ok) setAddresses(data);
          else console.warn("Failed to load addresses:", data);
        } catch (error) {
          console.error("Failed to load addresses:", error);
        }
      };
      loadAddresses();
    }, [])
  );

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    if (!selectedId) {
      Alert.alert("Please select an address!");
      return;
    }

    const selectedAddress = addresses.find(
      (addr) => addr._id === selectedId || addr.id === selectedId
    );

    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("userDetails");
      const user = userData ? JSON.parse(userData) : null;
      const userId = user?._id || user?.id;

      if (!token || !userId) {
        Alert.alert("Error", "User authentication failed. Please log in again.");
        return;
      }

      // 🔍 Debug received menu
      console.log("🍱 MENU DETAILS BEFORE ORDER:", JSON.stringify(menu, null, 2));

      // 🧮 Determine plan price (prioritize manually selected amount)
      let plan_price = 0;

      if (menu?.amount && Number(menu.amount) > 0) {
        plan_price = Number(menu.amount);
      } else if (menu?.plan_price && Number(menu.plan_price) > 0) {
        plan_price = Number(menu.plan_price);
      } else if (menu?.price && Number(menu.price) > 0) {
        plan_price = Number(menu.price);
      } else {
        const name = (menu?.packagename || menu?.regularmenuname || "").toLowerCase();
        if (name.includes("veg")) plan_price = 1500;
        else if (name.includes("non veg") || name.includes("non-veg")) plan_price = 2000;
        else plan_price = 1000; // fallback
      }

      // 🧮 Compute total
      const persons = Number(menu?.numPersons || menu?.numberOfPerson || 1);
      const weeks = Number(menu?.numWeeks || menu?.numberOfWeeks || 1);
      const total_amount = plan_price * persons * weeks;

      console.log("🧾 Payload being sent to API:", JSON.stringify(payload, null, 2));

const payload = {
  user_id: userId,
  name: selectedAddress.name || "Unknown",
  phone_number: selectedAddress.phone_number || "",
  alternate_phone_number: selectedAddress.alternate_phone_number || "",
  pincode: selectedAddress.pincode || "",
  state: selectedAddress.state || "",
  city: selectedAddress.city || "",
  address_1: selectedAddress.address_1 || "",
  address_2: selectedAddress.address_2 || "",
  landmark: selectedAddress.landmark || "",
  type_of_address: selectedAddress.type_of_address || "",
  regularmenuname: menu?.packagename || "Regular Plan",

  // ✅ Use correct fields
  numberOfPerson: menu?.numPersons || 1,
  numberOfWeeks: menu?.numWeeks || 1,

  // ✅ Send calculated amounts
  plan_price: menu?.plan_price || menu?.amount || 0,
  total_amount: menu?.total_amount || 0,

  payment_status: "paid",
  order_status: "confirmed",
};

      const response = await fetch(
        "https://kvk-backend.onrender.com/api/regularmenuorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const resultText = await response.text();
      console.log("🧾 Raw Response:", resultText);

      let data;
      try {
        data = JSON.parse(resultText);
      } catch {
        data = { message: "Invalid server response." };
      }

      if (response.ok) {
        Alert.alert("Success", "Order placed successfully!", [
          {
            text: "OK",
            onPress: async () => {
              if (typeof clearCart === "function") clearCart();
              navigation.reset({ index: 0, routes: [{ name: "Home1" }] });
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      Alert.alert("Error", "Unable to place order. Please try again.");
    }
  };

  const renderItem = ({ item }) => {
    const id = item._id || item.id;
    const isSelected = id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.addressCard,
          { borderColor: isSelected ? "#2d5e2f" : "#ccc" },
        ]}
        onPress={() => setSelectedId(id)}
      >
        <Text style={styles.addressType}>{item.type_of_address}</Text>
        <Text style={styles.addressText}>{item.name}</Text>
        <Text style={styles.addressText}>{item.address_1}</Text>
        {item.address_2 && (
          <Text style={styles.addressText}>{item.address_2}</Text>
        )}
        <Text style={styles.addressText}>
          {item.city}, {item.state} - {item.pincode}
        </Text>
        <Text style={styles.addressText}>Phone: {item.phone_number}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.regularaddress}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.regularaddressTitle}>RegularMenuAddress</Text>
        <View style={{ width: scale(24) }} />
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => (item._id || item.id).toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No addresses added yet.</Text>
        }
        contentContainerStyle={styles.contentWrapper}
        ListFooterComponent={
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("NewAddress")}
            >
              <Text style={styles.buttonText}>ADD NEW ADDRESS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.buttonText}>PROCEED</Text>
            </TouchableOpacity>
          </>
        }
      />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf7e9" },
  regularaddress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
  },
  regularaddressTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#2d5e2f",
  },
  contentWrapper: { paddingHorizontal: scale(16), paddingBottom: scale(40) },
  addressCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: scale(12),
    marginBottom: scale(12),
    backgroundColor: "#D6EFB7",
  },
  addressType: { fontSize: scale(16), fontWeight: "bold", color: "#2d5e2f" },
  addressText: { fontSize: scale(14), color: "#2d5e2f", marginTop: scale(2) },
  addButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
    marginVertical: scale(12),
  },
  proceedButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold", fontSize: scale(16), color: "#fff" },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: scale(16),
    marginTop: scale(30),
  },
});
