// SelectAddress.js
import React, { useState, useCallback, useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CartContext } from "../../Pages/Cartpage/CartContext";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (width / guidelineBaseWidth) * size;

export default function SelectAddress({ route, navigation }) {
  const { cartItems: initialCartItems } = route.params || {};
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [loading, setLoading] = useState(false);

  const { clearCart } = useContext(CartContext);

  // ✅ Load saved addresses
  useFocusEffect(
    useCallback(() => {
      const loadAddresses = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) return;

          const response = await fetch(
            "https://kvk-backend.onrender.com/api/address",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await response.json();
          if (response.ok) setAddresses(data);
          else console.error("Failed to fetch addresses:", data);
        } catch (error) {
          console.error("Failed to load addresses:", error);
        }
      };
      loadAddresses();
    }, [])
  );

  // ✅ Handle reorder items
  useEffect(() => {
    if (route?.params?.reorder && route?.params?.orderData) {
      const order = route.params.orderData;
      console.log("🧾 Reorder received:", order);

      if (Array.isArray(order.items)) {
        const mappedItems = order.items.map((item) => ({
          name: item.name || "Unknown",
          price: item.price || 0,
          quantity: item.quantity || 1,
        }));
        setCartItems(mappedItems);
      }
    }
  }, [route]);

  const getIconName = (type) => {
    switch (type?.toLowerCase()) {
      case "home":
        return "home-outline";
      case "work":
      case "office":
        return "briefcase-outline";
      case "hostel":
        return "location-outline";
      default:
        return "location-outline";
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.addressCard,
          { borderColor: isSelected ? "#2d5e2f" : "#ccc" },
        ]}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={styles.addressHeader}>
          <View style={styles.iconAndLabel}>
            <Ionicons
              name={getIconName(item.type_of_address)}
              size={scale(20)}
              color="#2d5e2f"
              style={{ marginRight: scale(6) }}
            />
            <Text style={styles.addressType}>{item.type_of_address}</Text>
          </View>
        </View>

        <Text style={styles.addressText}>{item.name}</Text>
        <Text style={styles.addressText}>{item.address_1}</Text>
        {item.address_2 && (
          <Text style={styles.addressText}>{item.address_2}</Text>
        )}
        <Text style={styles.addressText}>
          {item.city}, {item.state} - {item.pincode}
        </Text>
        {item.landmark && (
          <Text style={styles.addressText}>Landmark: {item.landmark}</Text>
        )}
        <Text style={styles.addressText}>Phone: {item.phone_number}</Text>
        {item.alternate_phone_number && (
          <Text style={styles.addressText}>
            Alt Phone: {item.alternate_phone_number}
          </Text>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditAddress", { address: item })}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem("token");
                if (!token) return;

                const response = await fetch(
                  `https://kvk-backend.onrender.com/api/address/${item.id}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (response.ok) {
                  setAddresses(addresses.filter((addr) => addr.id !== item.id));
                  if (selectedId === item.id) setSelectedId(null);
                } else {
                  Alert.alert("Error", "Failed to delete address.");
                }
              } catch (err) {
                console.error("Delete error:", err);
              }
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handlePlaceOrder = async () => {
    if (!selectedId) {
      Alert.alert("Please select an address!");
      return;
    }

    const selectedAddress = addresses.find((addr) => addr.id === selectedId);
    if (!selectedAddress) return;

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const orderItems = Array.isArray(cartItems)
        ? cartItems.map((item) => ({
            name: item.name || "Unknown Product",
            quantity: item.quantity || 1,
            price: Number(item.price) || 0,
          }))
        : [];

      const totalAmount = orderItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      const { data: expoToken } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const payload = {
        address_id: selectedAddress.id,
        items: orderItems,
        payment_method: "Cash On Delivery",
        instructions: "Leave at door",
        total_amount: totalAmount,
        name: selectedAddress.name || "Customer",
        phone_number: selectedAddress.phone_number || "0000000000",
        expoToken: expoToken,
      };

      const response = await fetch(
        "https://kvk-backend.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setShowSuccess(true);
      } else {
        console.error("Order API Error:", data);
        Alert.alert("Error", data.message || "Failed to place order.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Place order error:", error);
      Alert.alert("Error", "Something went wrong while placing order.");
    }
  };

  const handleOk = async () => {
    setShowSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      if (typeof clearCart === "function") clearCart();
    } catch (e) {
      console.log("Clear cart failed:", e);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Home1" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectaddressheader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.selectaddressheaderTitle}>Select Address</Text>
        <View style={{ width: scale(24) }} />
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedId}
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
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>PROCEED</Text>
              )}
            </TouchableOpacity>
          </>
        }
      />

      {/* ✅ Success Popup */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popupBox}>
            <Ionicons
              name="checkmark-circle"
              size={60}
              color="#2d5e2f"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.successTitle}>Success</Text>
            <Text style={styles.successMessage}>
              Order placed successfully!
            </Text>

            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf7e9" },
  selectaddressheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
  },
  selectaddressheaderTitle: {
    fontSize: scale(26),
    fontWeight: "bold",
    color: "#2d5e2f",
  },
  contentWrapper: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: scale(16),
    paddingBottom: scale(40),
  },
  addressCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: scale(12),
    marginBottom: scale(12),
    backgroundColor: "#D6EFB7",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(4),
  },
  iconAndLabel: { flexDirection: "row", alignItems: "center" },
  addressType: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#2d5e2f",
    textTransform: "capitalize",
  },
  addressText: {
    fontSize: scale(14),
    color: "#2d5e2f",
    marginTop: scale(2),
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(10),
  },
  actionButton: {
    flex: 1,
    marginHorizontal: scale(4),
    paddingVertical: scale(6),
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  actionText: { color: "#2d5e2f", fontWeight: "bold", fontSize: scale(14) },
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
    marginBottom: scale(16),
  },
  buttonText: { fontWeight: "bold", fontSize: scale(16), color: "#fff" },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: scale(16),
    marginTop: scale(30),
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 25,
    width: "80%",
    alignItems: "center",
  },
  successTitle: {
    color: "#2d5e2f",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  successMessage: {
    color: "#333",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#2d5e2f",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  okText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
