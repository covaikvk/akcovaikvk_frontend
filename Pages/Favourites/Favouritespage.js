// Favorites.js
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavourites } from "../Favourites/FavouritesContext";
import { CartContext } from "../Cartpage/CartContext";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");
const scale = width / 375;
const normalize = (size) => Math.round(size * scale);

export default function Favorites({ navigation }) {
  const { favourites, toggleFavourite, fetchFavourites, loading } = useFavourites();
  const { addToCart } = useContext(CartContext);

  // ✅ Fetch favourites from API when page loads
  useEffect(() => {
    fetchFavourites();
  }, []);

  const renderItem = (item) => (
    <View style={styles.card}>
      <View style={styles.imageBackground}>
        <Image source={{ uri: item.image_url }} style={styles.foodImage} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.foodName}>{item.name || item.title}</Text>
        {item.description ? (
          <Text style={styles.foodDesc}>{item.description}</Text>
        ) : null}
        <Text style={styles.foodPrice}>₹ {item.price}</Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() =>
              addToCart({
                name: item.name || item.title,
                price: item.price,
                desc: item.description,
                image: { uri: item.image_url },
                quantity: 1,
              })
            }
          >
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => toggleFavourite(item)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2d5e2f" />
      </View>
    );
  }

  if (!favourites || favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favourites yet ❤️</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eaf7e9" }}>
      {/* HEADER */}
      <View style={styles.favouritesheader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={normalize(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.headingText}>Favourites</Text>
      </View>

      {/* FAVOURITE ITEMS */}
      <ScrollView contentContainerStyle={{ padding: normalize(16), paddingBottom: normalize(140) }}>
        {favourites.map((item, index) => (
          <View key={index}>{renderItem(item)}</View>
        ))}
      </ScrollView>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}

const PRIMARY_GREEN = "#2d5e2f";

const styles = StyleSheet.create({
  favouritesheader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(12),
    backgroundColor: "#eaf7e9",
    borderBottomColor: "#ddd",
    justifyContent: "center",
    position: "relative",
  },
  backBtn: { position: "absolute", left: normalize(12) },
  headingText: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: PRIMARY_GREEN,
    textAlign: "center",
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: normalize(18), color: "gray" },

  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: normalize(12),
    flexDirection: "row",
    alignItems: "center",
    padding: normalize(12),
    marginBottom: normalize(12),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imageBackground: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(15),
    backgroundColor: "#f0f6f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: normalize(12),
  },
  foodImage: { width: normalize(60), height: normalize(60), borderRadius: normalize(12) },
  foodName: { fontSize: normalize(18), fontWeight: "bold", color: PRIMARY_GREEN },
  foodDesc: { fontSize: normalize(13), color: "#555", marginTop: normalize(2) },
  foodPrice: { fontSize: normalize(14), fontWeight: "bold", color: PRIMARY_GREEN, marginTop: normalize(4) },

  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: normalize(10) },
  cartButton: {
    flex: 1,
    backgroundColor: "#2d5e2f",
    paddingVertical: normalize(10),
    borderRadius: 10,
    alignItems: "center",
    marginRight: normalize(8),
  },
  cartButtonText: { color: "#fff", fontWeight: "bold" },
  removeButton: {
    flex: 1,
    backgroundColor: "#7d7b7bff",
    paddingVertical: normalize(10),
    borderRadius: 10,
    alignItems: "center",
  },
  removeButtonText: { color: "#fff", fontWeight: "bold" },
});
