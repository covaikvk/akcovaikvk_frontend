import React, { useState, useContext, useEffect } from "react"; // ADDED useState, useEffect
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions, 
  ActivityIndicator, // ADDED ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Menuheader from "../../Components/Header/Menuheader";
import Footer from "../../Components/Footer/Footer";
import { CartContext } from "../Cartpage/CartContext";
import Addeditem from "../../Components/Addeditem/Addeditem";

const { width } = Dimensions.get("window");
// Define the breakpoint for a tablet (768px is the common standard)
const isTablet = width >= 768; 

// Helper function to easily apply different sizes based on device
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function Service1({ navigation }) {
  const { cartItems, addToCart, clearCart } = useContext(CartContext);
  
  // ADDED State for fetched menu items and loading status
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // **********************************
  // API Integration using useEffect
  // **********************************
  useEffect(() => {
    // New API Endpoint with ID 1
    const API_URL = "https://kvk-backend.onrender.com/api/menu/menulist_by_menuid/1";
    
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Set the fetched array data
        setMenuItems(data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching menu items:", err);
        setLoading(false);
      });
  }, []); // Runs once on component mount

  // Helper to safely format item for the cart. 
  // IMPORTANT: Using 'title' and 'image_url' based on your API response
  const formatItemForCart = (item) => ({
      id: item.id ? item.id.toString() : item.title + item.price, 
      qty: 1, 
      price: item.price ? item.price.toString() : '0.00',
      name: item.title, // API uses 'title' for the name
      image: item.image_url, // API uses 'image_url'
  });
  
  // The static biriyaniItems list is replaced by API data

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      <StatusBar barStyle="light-content" />
      <Menuheader />

      {/* STATIC HEADER - Title Updated to be Generic */}
      <View style={styles.headerCard}>
        <Image
          source={require("../../assets/biriyanibanner.jpg")}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Menu Service</Text>
          <Text style={styles.headerSubtitle}>View all available dishes</Text>
        </View>
      </View>

      {/* SCROLL MENU */}
      {loading ? (
        <ActivityIndicator 
          size="large" 
          color="#173b01" 
          style={{ marginTop: responsiveSize(50, 80) }} 
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.grid}>
            {/* Map over the fetched menuItems */}
            {menuItems.map((item) => (
              // Using item.id as the key, falling back to index for safety
              <View key={item.id ? item.id.toString() : item.title} style={styles.card}>
                {/* VARIETY NAME ON TOP - Using item.title */}
                <Text style={styles.foodName}>{item.title}</Text>

                {/* Image source MUST be URI for network images */}
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.foodImage} 
                />

                <View style={styles.bottomRow}>
                  <Text style={styles.foodPrice}>₹{item.price}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      addToCart(formatItemForCart(item)); // Add to global cart
                    }}
                  >
                    <MaterialIcons name="add" size={responsiveSize(20, 24)} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* CART BANNER */}
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
  // --- General Layout ---
  scrollContainer: { 
    padding: responsiveSize(10, 25), // Increased padding for tablet
    paddingBottom: 100 // Space for Footer/Cart
  },

  // --- Header ---
  headerCard: { 
    height: responsiveSize(160, 240), // Taller header for tablet
    marginBottom: responsiveSize(10, 20) 
  },
  headerImage: { width: "100%", height: "100%" },
  headerOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { 
    fontSize: responsiveSize(28, 40), 
    fontWeight: "bold", 
    color: "#fff" 
  },
  headerSubtitle: { 
    fontSize: responsiveSize(16, 22), 
    color: "#fff", 
    marginTop: 4 
  },

  // --- Grid Layout ---
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: isTablet ? "space-between" : "space-between", 
    marginHorizontal: isTablet ? -10 : 0,
  },
  card: {
    width: isTablet ? `${100 / 3 - 2}%` : "48%", 
    marginLeft: isTablet ? 10 : 0,
    marginRight: isTablet ? 0 : 0,

    backgroundColor: "#D5F0C1",
    borderRadius: 10,
    padding: responsiveSize(10, 15),
    marginBottom: responsiveSize(10, 20),
    alignItems: "center",
    position: "relative",
  },
  foodName: { 
    fontSize: responsiveSize(16, 20), 
    fontWeight: "bold", 
    color: "#173b01", 
    marginBottom: responsiveSize(6, 10), 
    textAlign: "center" 
  },
  foodImage: { 
    width: responsiveSize(90, 120), 
    height: responsiveSize(80, 110), 
    borderRadius: 8, 
    marginBottom: 4 
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: responsiveSize(4, 8),
  },
  foodPrice: { 
    fontSize: responsiveSize(14, 18), 
    fontWeight: "700", 
    color: "#173b01" 
  },
  addBtn: {
    backgroundColor: "#2d5e2f",
    width: responsiveSize(28, 36),
    height: responsiveSize(28, 36),
    borderRadius: responsiveSize(14, 18),
    justifyContent: "center",
    alignItems: "center",
  },
  
  // --- Addeditem (Cart Banner) Positioning FIX ---
  addedItemWrapper: {
    position: 'absolute', 
    bottom: responsiveSize(70, 90), 
    width: '100%', 
    alignItems: 'center', 
    paddingHorizontal: responsiveSize(16, 30), 
    zIndex: 10, 
  },
});