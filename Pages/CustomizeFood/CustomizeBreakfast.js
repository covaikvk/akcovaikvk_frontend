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
import CustomizeAdd1 from "../../Components/CustomizeAdd/CustomizeAdd1";
import Footer from "../../Components/Footer/Footer";
import { CartContext } from "../Cartpage/CartContext";
import { MenuContext } from "../../Pages/CustomizeMenu/MenuContext"; 
import Menuheader from "../../Components/Header/Menuheader";

const API_URL = "https://kvk-backend.onrender.com/api/foods/combined";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsive = (mobileSize, tabletSize = mobileSize) => (isTablet ? tabletSize : mobileSize);

const mapApiDataToMenuItems = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  const breakfastCategories = apiData.filter(
    (category) => category.category && category.category.toLowerCase() === "breakfast"
  );

  return breakfastCategories.map((category) => ({
    name: category.title,
    desc: category.description,
    image: { uri: category.image_url },
    items: category.items.map((item) => ({
      name: item.name.trim(),
      price: item.price.startsWith("₹") ? item.price : `₹${item.price}`,
      desc: item.description,
      image: { uri: item.image_url },
      id: item.id.toString(),
      category: item.category,
    })),
  }));
};

export default function CustomizeBreakfast({ navigation, route }) {
  const { cartItems, addToCart, clearCart } = useContext(CartContext);
  const { addItemsToMenu } = useContext(MenuContext);

  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  const formatItemForCart = (item) => ({
    ...item,
    price: item.price.startsWith("₹") ? item.price.substring(1) : item.price,
    id: item.id || item.name + item.price,
    qty: 1,
  });

  useEffect(() => {
    if (cartItems.length > 0) setShowBanner(true);
    else setShowBanner(false);
  }, [cartItems]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiData = await response.json();
        const mappedData = mapApiDataToMenuItems(apiData);
        setMenuItems(mappedData);
      } catch (error) {
        console.error("Failed to fetch breakfast menu:", error);
        Alert.alert("Error", "Failed to load breakfast menu. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: "#eaf7e9" }]}>
        <ActivityIndicator size="large" color="#2d5e2f" />
        <Text style={{ marginTop: responsive(10, 14) }}>Loading Breakfast Menu...</Text>
      </View>
    );
  }

  if (menuItems.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
        <Menuheader />
        <View style={styles.customizebreakheader}>
          <Image source={require("../../assets/breakfast.png")} style={styles.customizebreakheaderImage} />
          <View style={styles.customizebreakheaderOverlay}>
            <Text style={styles.customizebreakheaderTitle}>Breakfast Menu</Text>
            <Text style={styles.customizebreakheaderSubtitle}>Start your day deliciously!</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: responsive(18, 22), color: "#555" }}>No Breakfast items found.</Text>
        </View>
        <Footer />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      <StatusBar barStyle="light-content" />
      <Menuheader />
      <View style={styles.customizebreakheader}>
        <Image source={require("../../assets/breakfast.png")} style={styles.customizebreakheaderImage} />
        <View style={styles.customizebreakheaderOverlay}>
          <Text style={styles.customizebreakheaderTitle}>Breakfast Menu</Text>
          <Text style={styles.customizebreakheaderSubtitle}>Start your day deliciously!</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {menuItems.map((item, index) => {
          const isExpanded = expandedCategory === item.name;
          return (
            <View key={index}>
              <View style={styles.card}>
                <View style={styles.imageBackground}>
                  <Image source={item.image} style={styles.foodImage} />
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
                      size={responsive(20, 24)}
                      color="#fff"
                      style={{ marginLeft: responsive(4, 6) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {isExpanded && (
                <View style={styles.subContainer}>
                  {item.items.map((food, idx) => (
                    <View key={food.id || idx} style={styles.subCard}>
                      <View style={styles.subImageBackground}>
                        <Image source={food.image} style={styles.subImage} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subName}>{food.name}</Text>
                        <Text style={styles.subPrice}>{food.price}</Text>
                        <Text style={styles.subDesc}>{food.desc}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          addToCart(formatItemForCart(food));
                          setShowBanner(true); // important: show CustomizeAdd
                        }}
                      >
                        <Text style={styles.addText}>+ Add</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {cartItems.length > 0 && showBanner && (
        <View style={styles.addedItemWrapper}>
          <CustomizeAdd1
            day={route.params?.day}
            meal={route.params?.meal}
            addItemsToMenu={addItemsToMenu}
            items={cartItems} // <-- pass cartItems as items
            onPress={() => {
              addItemsToMenu(route.params.day, route.params.meal, cartItems);
              setShowBanner(false);
              clearCart();
              navigation.navigate("CustomizeMenuScreen");
            }}
          />
        </View>
      )}

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: responsive(16, 30), paddingTop: 10, paddingBottom: responsive(120, 140) },
  customizebreakheader: { height: responsive(200, 280), width: "100%" },
  customizebreakheaderImage: { width: "100%", height: "100%" },
  customizebreakheaderOverlay: { position: "absolute", top: 0, left: 0, right: 0, height: "100%", backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  customizebreakheaderTitle: { fontSize: responsive(40, 60), fontWeight: "bold", color: "#fff" },
  customizebreakheaderSubtitle: { fontSize: responsive(20, 28), color: "#fff", marginTop: responsive(6, 10) },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", borderRadius: responsive(12, 16), flexDirection: "row", alignItems: "center", padding: responsive(12, 20), marginBottom: responsive(10, 15), elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
  imageBackground: { width: responsive(70, 90), height: responsive(70, 90), borderRadius: responsive(15, 18), backgroundColor: "#48742C", justifyContent: "center", alignItems: "center", marginRight: responsive(12, 20) },
  foodImage: { width: responsive(60, 80), height: responsive(60, 80), borderRadius: responsive(12, 15) },
  info: { flex: 1 },
  foodName: { fontSize: responsive(18, 24), fontWeight: "bold", color: "#2d5e2f" },
  foodDesc: { fontSize: responsive(13, 16), color: "#555", marginTop: responsive(2, 4) },
  viewBtn: { backgroundColor: "#2d5e2f", padding: responsive(8, 12), borderRadius: 10, justifyContent: "center", alignItems: "center" },
  viewText: { color: "#fff", fontSize: responsive(14, 18) },
  subContainer: { backgroundColor: "#D6EFB7", borderRadius: 12, padding: responsive(10, 15), marginBottom: responsive(12, 20) },
  subCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: responsive(10, 15), marginBottom: responsive(8, 10) },
  subImageBackground: { width: responsive(50, 70), height: responsive(50, 70), borderRadius: 10, backgroundColor: "#48742C", justifyContent: "center", alignItems: "center", marginRight: responsive(12, 18) },
  subImage: { width: responsive(40, 60), height: responsive(40, 60), borderRadius: 8 },
  subName: { fontSize: responsive(16, 20), fontWeight: "bold", color: "#2d5e2f" },
  subPrice: { fontSize: responsive(14, 18), fontWeight: "bold", color: "#2d5e2f", marginTop: responsive(2, 4) },
  subDesc: { fontSize: responsive(12, 15), color: "#555", marginTop: responsive(2, 4) },
  addBtn: { backgroundColor: "#2d5e2f", paddingHorizontal: responsive(12, 18), paddingVertical: responsive(6, 10), borderRadius: 20 },
  addText: { color: "#fff", fontWeight: "600", fontSize: responsive(14, 17) },
  addedItemWrapper: { position: "absolute", bottom: responsive(70, 90), width: "100%", alignItems: "center", paddingHorizontal: responsive(16, 30), zIndex: 10 },
});
