import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions, // Import Dimensions for responsiveness
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

  // Helper to safely format item for the cart
  const formatItemForCart = (item) => ({
      ...item,
      id: item.name + item.price, 
      qty: 1, 
      price: item.price.toString(), 
  });

  const biriyaniItems = [
    { name: "Veg Biriyani", price: 150, image: require("../../assets/biriyani.png") },
    { name: "Chicken Biriyani", price: 200, image: require("../../assets/biriyani.png") },
    { name: "Mutton Biriyani", price: 250, image: require("../../assets/biriyani.png") },
    { name: "Prawn Biriyani", price: 300, image: require("../../assets/biriyani.png") },
    { name: "Egg Biriyani", price: 170, image: require("../../assets/biriyani.png") },
    { name: "Fish Biriyani", price: 280, image: require("../../assets/biriyani.png") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      <StatusBar barStyle="light-content" />
      <Menuheader />

      {/* STATIC HEADER */}
      <View style={styles.headerCard}>
        <Image
          source={require("../../assets/biriyanibanner.jpg")}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Biriyani Menu</Text>
          <Text style={styles.headerSubtitle}>Authentic Taste of Biriyani</Text>
        </View>
      </View>

      {/* SCROLL MENU */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {biriyaniItems.map((item, index) => (
            <View key={index} style={styles.card}>
              {/* VARIETY NAME ON TOP */}
              <Text style={styles.foodName}>{item.name}</Text>

              <Image source={item.image} style={styles.foodImage} />

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

      {/* CART BANNER (Positioning Fix Integrated) */}
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

// --- STYLES (Responsive) ---
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
    // Use space-between for consistent spacing
    justifyContent: isTablet ? "space-between" : "space-between", 
    // Add internal margin to the grid for proper card spacing calculation
    marginHorizontal: isTablet ? -10 : 0,
  },
  card: {
    // Mobile: 48% width (2 columns) 
    // Tablet: Calculate width for 3 columns with internal spacing adjustment
    width: isTablet ? `${100 / 3 - 2}%` : "48%", 
    // Adjust internal margin for tablet layout to counter negative margin on grid
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
    bottom: responsiveSize(70, 90), // Sits above the footer
    width: '100%', 
    alignItems: 'center', // Centers the item horizontally
    paddingHorizontal: responsiveSize(16, 30), // Provides margin/alignment
    zIndex: 10, 
  },
});