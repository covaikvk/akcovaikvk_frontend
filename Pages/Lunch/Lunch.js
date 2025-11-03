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
import { useFavourites } from "../Favourites/FavouritesContext";
import Menuheader from "../../Components/Header/Menuheader";

const API_URL = "kvk-backend.onrender.com/api/foods/combined";
const { width } = Dimensions.get("window");
const scale = width / 375;
const responsive = (size) => Math.round(size * scale);

const getImage = (uri) => {
  if (uri) return { uri };
  return require("../../assets/lunch.png");
};

const mapApiDataToMenuItems = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  const lunchCategories = apiData.filter(
    (category) => category.category?.toLowerCase() === "lunch"
  );
  return lunchCategories.map((category) => ({
    name: category.title || "Category",
    desc: category.description || "",
    image: getImage(category.image_url),
    items: (category.items || []).map((item) => ({
      name: item.name?.trim() || "Item",
      price: `₹ ${item.price || 0}`,
      desc: item.description || "",
      image: getImage(item.image_url),
      id: item.id?.toString() || item.name,
      category: item.category,
    })),
  }));
};

export default function Lunch({ navigation }) {
  const { cartItems, addToCart, removeFromCart, getQty } = useContext(CartContext);
  const { toggleFavourite, isFavourite } = useFavourites();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const formatItemForCart = (item) => ({
    ...item,
    price: parseFloat(item.price.replace("₹", "").trim()) || 0,
    id: item.id || item.name + item.price,
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`https://${API_URL}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const apiData = await response.json();
        const mappedData = mapApiDataToMenuItems(apiData);
        setMenuItems(mappedData);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
        Alert.alert("Error", "Failed to load menu. Please try again later.");
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
        <Text style={{ marginTop: responsive(10), fontSize: responsive(14) }}>
          Loading Menu...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      <StatusBar barStyle="light-content" />
      <Menuheader />

      {/* Header */}
      <View style={styles.lunchheader}>
        <Image
          source={require("../../assets/lunch.png")}
          style={styles.lunchheaderImage}
        />
        <View style={styles.lunchheaderOverlay}>
          <Text style={styles.lunchheaderTitle}>Lunch Menu</Text>
          <Text style={styles.lunchheaderSubtitle}>Delicious meals for your day!</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {menuItems.length === 0 && (
          <Text style={{ fontSize: responsive(18), color: "#555" }}>
            No Lunch items found.
          </Text>
        )}

        {menuItems.map((item, index) => {
          const isExpanded = expandedCategory === item.name;
          return (
            <View key={index}>
              <View style={styles.card}>
                <View style={styles.imageBackground}>
                  <Image source={item.image} style={styles.foodImage} />
                  <TouchableOpacity
                    style={styles.favCircle}
                    onPress={() =>
                      toggleFavourite({
                        id: `category-${item.name}`,
                        title: item.name,
                        image_url: item.image.uri || item.image,
                      })
                    }
                  >
                    <Ionicons
                      name={
                        isFavourite(`category-${item.name}`)
                          ? "heart"
                          : "heart-outline"
                      }
                      size={18}
                      color={
                        isFavourite(`category-${item.name}`) ? "red" : "#666"
                      }
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.info}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodDesc}>{item.desc}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    setExpandedCategory(isExpanded ? null : item.name)
                  }
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.viewText}>View All</Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={responsive(20)}
                      color="#fff"
                      style={{ marginLeft: 4 }}
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
                        <TouchableOpacity
                          style={styles.favCircleSmall}
                          onPress={() =>
                            toggleFavourite({
                              id: food.id || `${item.name}-${food.name}`,
                              title: food.name,
                              image_url: food.image.uri || food.image,
                            })
                          }
                        >
                          <Ionicons
                            name={
                              isFavourite(
                                food.id || `${item.name}-${food.name}`
                              )
                                ? "heart"
                                : "heart-outline"
                            }
                            size={16}
                            color={
                              isFavourite(
                                food.id || `${item.name}-${food.name}`
                              )
                                ? "#173b01"
                                : "#666"
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.subName}>{food.name}</Text>
                        <Text style={styles.subPrice}>{food.price}</Text>
                        <Text style={styles.subDesc}>{food.desc}</Text>
                      </View>

                      {/* ✅ Working + / - Section */}
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity
                          style={[styles.addBtn, { paddingHorizontal: responsive(8) }]}
                          onPress={() => removeFromCart(food.id)}
                        >
                          <Ionicons name="remove" size={responsive(16)} color="#fff" />
                        </TouchableOpacity>

                        <Text
                          style={{
                            marginHorizontal: responsive(8),
                            fontSize: responsive(14),
                            fontWeight: "bold",
                            color: "#2d5e2f",
                          }}
                        >
                          {getQty(food.id)}
                        </Text>

                        <TouchableOpacity
                          style={[styles.addBtn, { paddingHorizontal: responsive(8) }]}
                          onPress={() => addToCart(formatItemForCart(food))}
                        >
                          <Ionicons name="add" size={responsive(16)} color="#fff" />
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

      {cartItems.length > 0 && <Addeditem />}

      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: responsive(16), paddingBottom: responsive(140) },
  lunchheader: { height: responsive(220), width: "100%" },
  lunchheaderImage: { width: "100%", height: "100%" },
  lunchheaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  lunchheaderTitle: { fontSize: responsive(40), fontWeight: "bold", color: "#fff" },
  lunchheaderSubtitle: {
    fontSize: responsive(20),
    color: "#fff",
    marginTop: responsive(6),
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: responsive(14),
    marginBottom: responsive(10),
    elevation: 3,
  },
  imageBackground: {
    width: responsive(70),
    height: responsive(70),
    borderRadius: 15,
    backgroundColor: "#48742C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsive(12),
    position: "relative",
  },
  favCircle: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  favCircleSmall: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  foodImage: { width: responsive(60), height: responsive(60), borderRadius: 12 },
  info: { flex: 1 },
  foodName: { fontSize: responsive(18), fontWeight: "bold", color: "#2d5e2f" },
  foodDesc: { fontSize: responsive(13), color: "#555", marginTop: responsive(2) },
  viewBtn: {
    backgroundColor: "#2d5e2f",
    padding: responsive(8),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  viewText: { color: "#fff", fontSize: responsive(14) },
  subContainer: {
    backgroundColor: "#D6EFB7",
    borderRadius: 12,
    padding: responsive(10),
    marginBottom: responsive(12),
  },
  subCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: responsive(10),
    marginBottom: responsive(8),
  },
  subImageBackground: {
    width: responsive(50),
    height: responsive(50),
    borderRadius: 10,
    backgroundColor: "#48742C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsive(12),
    position: "relative",
  },
  subImage: { width: responsive(40), height: responsive(40), borderRadius: 8 },
  subName: { fontSize: responsive(16), fontWeight: "bold", color: "#2d5e2f" },
  subPrice: {
    fontSize: responsive(14),
    fontWeight: "bold",
    color: "#2d5e2f",
    marginTop: responsive(2),
  },
  subDesc: { fontSize: responsive(12), color: "#555", marginTop: responsive(2) },
  addBtn: {
    backgroundColor: "#2d5e2f",
    paddingHorizontal: responsive(12),
    paddingVertical: responsive(6),
    borderRadius: 10,
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 10,
  },
});
