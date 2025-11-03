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
import { Ionicons } from "@expo/vector-icons";
import Addeditem from "../../Components/Addeditem/Addeditem";
import Footer from "../../Components/Footer/Footer";
import { CartContext } from "../Cartpage/CartContext";
import Menuheader from "../../Components/Header/Menuheader";
import Favourites from "../../Components/FavouriteIcon/FavouriteIcon";

const API_URL = "https://kvk-backend.onrender.com/api/foods/combined";
const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobile, tablet) => (isTablet ? tablet : mobile);

const mapApiDataToMenuItems = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  const dinnerCategories = apiData.filter(
    (category) =>
      category.category &&
      category.category.toLowerCase() === "dinner"
  );

  return dinnerCategories.map((category) => ({
    name: category.title,
    desc: category.description || "Enjoy our delicious dinner selection.",
    image: { uri: category.image_url },
    items: (category.items || []).map((item, index) => ({
      name: item.name?.trim() || `Dinner Item ${index + 1}`,
      price: item.price?.startsWith("₹") ? item.price : `₹${item.price || "0"}`,
      desc: item.description || "Tasty and freshly prepared.",
      image: { uri: item.image_url },
      id: item.id?.toString() || `${item.name}-${index}`,
      category: item.category || "Dinner",
    })),
  }));
};

export default function Dinner({ navigation }) {
  const { cartItems, addToCart, removeFromCart, getQty } = useContext(CartContext);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  const formatItemForCart = (item) => ({
    ...item,
    price: parseFloat(item.price.replace("₹", "").trim()) || 0,
    id: item.id || item.name + item.price,
  });

  const fetchMenuData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const apiData = await response.json();
      const mappedData = mapApiDataToMenuItems(apiData);
      setMenuItems(mappedData);
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
      Alert.alert("Error", "Failed to load dinner menu. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    setShowBanner(cartItems.length > 0);
  }, [cartItems.length]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: "#eaf7e9" }]}>
        <ActivityIndicator size="large" color="#2d5e2f" />
        <Text style={{ marginTop: 10 }}>Loading Dinner Menu...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      <StatusBar barStyle="light-content" />
      <Menuheader />

      {/* Header */}
      <View style={styles.dinnerheader}>
        <Image source={require("../../assets/dinner.png")} style={styles.dinnerheaderImage} />
        <View style={styles.dinnerheaderOverlay}>
          <Text style={styles.dinnerheaderTitle}>Dinner Menu</Text>
          <Text style={styles.dinnerheaderSubtitle}>Delicious evening meals!</Text>
        </View>
      </View>

      {/* Menu Section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...styles.scrollContainer, paddingBottom: 180 }}
      >
        {menuItems.map((item, index) => {
          const isExpanded = expandedCategory === item.name;
          return (
            <View key={index}>
              <View style={styles.card}>
                <View style={styles.imageBackground}>
                  <Image source={item.image} style={styles.foodImage} />
                  <Favourites />
                </View>

                <View style={styles.info}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodDesc}>{item.desc}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => setExpandedCategory(isExpanded ? null : item.name)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.viewText}>View All</Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={responsiveSize(20, 24)}
                      color="#fff"
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Sub Items */}
              {isExpanded && (
                <View style={styles.subContainer}>
                  {item.items.map((food, idx) => (
                    <View key={food.id || idx} style={styles.subCard}>
                      <View style={styles.subImageBackground}>
                        <Image source={food.image} style={styles.subImage} />
                        <Favourites />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.subName}>{food.name}</Text>
                        <Text style={styles.subPrice}>{food.price}</Text>
                        <Text style={styles.subDesc}>{food.desc}</Text>
                      </View>

                      {/* ✅ Same + / - quantity buttons as Breakfast */}
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity
                          style={[styles.addBtn, { paddingHorizontal: 8 }]}
                          onPress={() => removeFromCart(food.id)}
                        >
                          <Ionicons name="remove" size={16} color="#fff" />
                        </TouchableOpacity>

                        <Text
                          style={{
                            marginHorizontal: 8,
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "#2d5e2f",
                          }}
                        >
                          {getQty(food.id)}
                        </Text>

                        <TouchableOpacity
                          style={[styles.addBtn, { paddingHorizontal: 8 }]}
                          onPress={() => addToCart(formatItemForCart(food))}
                        >
                          <Ionicons name="add" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* ✅ Addeditem appears directly above Footer */}
      {cartItems.length > 0 && showBanner && <Addeditem />}

      {/* ✅ Footer fixed at bottom */}
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: responsiveSize(16, 30),
    paddingTop: 10,
  },
  dinnerheader: { height: responsiveSize(200, 280), width: "100%" },
  dinnerheaderImage: { width: "100%", height: "100%" },
  dinnerheaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dinnerheaderTitle: {
    fontSize: responsiveSize(40, 60),
    fontWeight: "bold",
    color: "#fff",
  },
  dinnerheaderSubtitle: {
    fontSize: responsiveSize(20, 28),
    color: "#fff",
    marginTop: 6,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: responsiveSize(12, 20),
    marginBottom: responsiveSize(10, 15),
    elevation: 3,
  },
  imageBackground: {
    width: responsiveSize(70, 90),
    height: responsiveSize(70, 90),
    borderRadius: 15,
    backgroundColor: "#48742C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveSize(12, 20),
  },
  foodImage: { width: responsiveSize(60, 80), height: responsiveSize(60, 80), borderRadius: 12 },
  info: { flex: 1 },
  foodName: { fontSize: responsiveSize(18, 24), fontWeight: "bold", color: "#2d5e2f" },
  foodDesc: { fontSize: responsiveSize(13, 16), color: "#555", marginTop: 2 },
  viewBtn: {
    backgroundColor: "#2d5e2f",
    padding: responsiveSize(8, 12),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  viewText: { color: "#fff", fontSize: responsiveSize(14, 18) },
  subContainer: {
    backgroundColor: "#D6EFB7",
    borderRadius: 12,
    padding: responsiveSize(10, 15),
    marginBottom: responsiveSize(12, 20),
  },
  subCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: responsiveSize(10, 15),
    marginBottom: responsiveSize(8, 10),
  },
  subImageBackground: {
    width: responsiveSize(50, 70),
    height: responsiveSize(50, 70),
    borderRadius: 10,
    backgroundColor: "#48742C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveSize(12, 18),
  },
  subImage: { width: responsiveSize(40, 60), height: responsiveSize(40, 60), borderRadius: 8 },
  subName: { fontSize: responsiveSize(16, 20), fontWeight: "bold", color: "#2d5e2f" },
  subPrice: {
    fontSize: responsiveSize(14, 18),
    fontWeight: "bold",
    color: "#2d5e2f",
    marginTop: 2,
  },
  subDesc: { fontSize: responsiveSize(12, 15), color: "#555", marginTop: 2 },
  addBtn: {
    backgroundColor: "#2d5e2f",
    paddingHorizontal: responsiveSize(12, 18),
    paddingVertical: responsiveSize(6, 10),
    borderRadius: 10,
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
