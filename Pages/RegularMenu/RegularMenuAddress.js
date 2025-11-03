import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CartContext } from "../../Pages/Cartpage/CartContext";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;

export default function RegularMenuAddress({ route, navigation }) {
  const { menuDetails, cartItems } = route.params || {};
  const menu = menuDetails || (cartItems && cartItems[0]) || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);

  const { clearCart } = useContext(CartContext);

  // Load saved addresses when focused
  useFocusEffect(
    useCallback(() => {
      const loadAddresses = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) return;

          const response = await fetch(
            "https://kvk-backend.onrender.com/api/address",
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

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

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedId) {
      setShowAddressError(true);
      return;
    }

    const selectedAddress = addresses.find(
      addr => addr._id === selectedId || addr.id === selectedId
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
        numberOfPerson: menu?.numPersons || 1,
        numberOfWeeks: menu?.numWeeks || 1,
        plan_price: menu?.plan_price || menu?.amount || 0,
        total_amount: menu?.total_amount || 0,
        payment_status: "paid",
        order_status: "confirmed"
      };

      const response = await fetch(
        "https://kvk-backend.onrender.com/api/regularmenuorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        setShowSuccess(true);
      } else {
        Alert.alert("Error", "Failed to place order.");
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
          { borderColor: isSelected ? "#2d5e2f" : "#ccc" }
        ]}
        onPress={() => setSelectedId(id)}
      >
        <Text style={styles.addressType}>{item.type_of_address}</Text>
        <Text style={styles.addressText}>{item.name}</Text>
        <Text style={styles.addressText}>{item.address_1}</Text>
        {item.address_2 && <Text style={styles.addressText}>{item.address_2}</Text>}
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
        keyExtractor={item => (item._id || item.id).toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No addresses added yet.</Text>}
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

      {/* Address error popup */}
      {showAddressError && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Alert</Text>
            <Text style={styles.popupMessage}>Please select an address!</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => setShowAddressError(false)}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Success popup */}
      {showSuccess && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Success</Text>
            <Text style={styles.popupMessage}>Order placed successfully!</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={async () => {
                setShowSuccess(false);
                if (typeof clearCart === "function") clearCart();
                navigation.reset({ index: 0, routes: [{ name: "RegularMenu" }] });
              }}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
    padding: scale(16)
  },
  regularaddressTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#2d5e2f"
  },
  contentWrapper: { paddingHorizontal: scale(16), paddingBottom: scale(40) },
  addressCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: scale(12),
    marginBottom: scale(12),
    backgroundColor: "#D6EFB7"
  },
  addressType: { fontSize: scale(16), fontWeight: "bold", color: "#2d5e2f" },
  addressText: { fontSize: scale(14), color: "#2d5e2f", marginTop: scale(2) },
  addButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
    marginVertical: scale(12)
  },
  proceedButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: { fontWeight: "bold", fontSize: scale(16), color: "#fff" },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: scale(16),
    marginTop: scale(30)
  },

  popupOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  popupContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: scale(20),
    alignItems: "center"
  },
  popupTitle: {
    fontSize: scale(22),
    fontWeight: "bold",
    color: "darkgreen",
    marginBottom: scale(10)
  },
  popupMessage: {
    fontSize: scale(16),
    color: "#2d5e2f",
    textAlign: "center",
    marginBottom: scale(20)
  },
  popupButton: {
    backgroundColor: "#2d5e2f",
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
    borderRadius: 8
  },
  popupButtonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "bold"
  }
});
