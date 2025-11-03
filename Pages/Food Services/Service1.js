import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Menuheader from "../../Components/Header/Menuheader";
import Footer from "../../Components/Footer/Footer";
import { CartContext } from "../Cartpage/CartContext";
import Addeditem from "../../Components/Addeditem/Addeditem";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobile, tablet) => (isTablet ? tablet : mobile);

export default function Service1({ navigation }) {
  const route = useRoute();
  const { service } = route.params || {};
  const serviceId = service?.id;
  const serviceName = service?.name || "Menu";
  const serviceImageUrl = service?.image_url;

  const { cartItems, addToCart, clearCart } = useContext(CartContext);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch menu items from API
  useEffect(() => {
    if (!serviceId) {
      setError("Error: Missing service ID");
      setLoading(false);
      return;
    }

    const API_URL = `https://kvk-backend.onrender.com/api/menu/menulist_by_menuid/${serviceId}`;
    console.log("Fetching:", API_URL);

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMenuItems(data);
        else setMenuItems([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err.message);
        setError(`Failed to load menu: ${err.message}`);
        Alert.alert("Error", "Could not load menu items.");
        setLoading(false);
      });
  }, [serviceId]);

  // ✅ Format item for cart
  const formatItemForCart = (item) => ({
    id: item.id?.toString() || item.title,
    qty: 1,
    price: parseFloat(item.price) || 0,
    name: item.title,
    image: item.image_url,
  });

  // ✅ Main content logic
  let content;

  if (loading) {
    content = (
      <ActivityIndicator
        size="large"
        color="#173b01"
        style={{ marginTop: r(50, 80) }}
      />
    );
  } else if (error) {
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  } else if (menuItems.length === 0) {
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.noItemsText}>
          No menu items are available for {serviceName}.
        </Text>
      </View>
    );
  } else {
    content = (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {menuItems.map((item) => {
            const displayPrice = item.price
              ? `₹${parseFloat(item.price).toFixed(2)}`
              : "₹0.00";
            return (
              <View key={item.id?.toString() || item.title} style={styles.card}>
                <Text style={styles.foodName}>{item.title}</Text>

                <Image
                  source={{
                    uri: item.image_url
                      ? item.image_url
                      : "https://via.placeholder.com/150",
                  }}
                  style={styles.foodImage}
                />

                <View style={styles.bottomRow}>
                  <Text style={styles.foodPrice}>{displayPrice}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addToCart(formatItemForCart(item))}
                  >
                    <MaterialIcons name="add" size={r(20, 24)} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      <StatusBar barStyle="light-content" />
      <Menuheader />

      {/* Header Section */}
      <View style={styles.serviceheaderCard}>
        <Image
          source={
            serviceImageUrl
              ? { uri: serviceImageUrl }
              : require("../../assets/biriyanibanner.jpg")
          }
          style={styles.serviceheaderImage}
        />
        <View style={styles.serviceheaderOverlay}>
          <Text style={styles.serviceheaderTitle}>{serviceName}</Text>
          <Text style={styles.serviceheaderSubtitle}>
            Explore Our Delicious Menu
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>{content}</View>

      {/* Cart Floating Bar */}
      {cartItems.length > 0 && (
        <Addeditem
          itemCount={cartItems.length}
          onPress={() => navigation.navigate("CartScreen")}
          onDelete={() => clearCart()}
        />
      )}

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: r(10, 25),
    paddingBottom: r(100, 140),
  },
  serviceheaderCard: {
    height: r(160, 240),
    marginBottom: r(10, 20),
    overflow: "hidden",
  },
  serviceheaderImage: {
    width: "100%",
    height: "100%",
  },
  serviceheaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceheaderTitle: {
    fontSize: r(28, 40),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  serviceheaderSubtitle: {
    fontSize: r(16, 22),
    color: "#fff",
    marginTop: r(4, 8),
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: isTablet ? -5 : 0,
  },
  card: {
    width: isTablet ? `${100 / 3 - 3}%` : "48%",
    backgroundColor: "#D5F0C1",
    borderRadius: r(10, 14),
    padding: r(10, 15),
    marginBottom: r(10, 20),
    alignItems: "center",
  },
  foodImage: {
    width: r(90, 120),
    height: r(80, 110),
    borderRadius: r(8, 12),
    marginBottom: r(6, 10),
    resizeMode: "cover",
  },
  foodName: {
    fontSize: r(16, 20),
    fontWeight: "bold",
    color: "#173b01",
    marginBottom: r(6, 10),
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: r(4, 8),
  },
  foodPrice: {
    fontSize: r(14, 18),
    fontWeight: "700",
    color: "#173b01",
  },
  addBtn: {
    backgroundColor: "#2d5e2f",
    width: r(28, 36),
    height: r(28, 36),
    borderRadius: r(14, 18),
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: r(20, 30),
  },
  errorText: {
    fontSize: r(18, 24),
    color: "red",
    textAlign: "center",
  },
  noItemsText: {
    fontSize: r(18, 24),
    textAlign: "center",
    marginTop: r(20, 40),
    color: "#888",
  },
});
