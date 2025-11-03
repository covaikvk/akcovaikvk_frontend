import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import Header from "../../Components/Header/Header.js";
import Footer from "../../Components/Footer/Footer.js";
import Addeditem from "../../Components/Addeditem/Addeditem.js"; 
import { CartContext } from "../Cartpage/CartContext"; 

const { width } = Dimensions.get("window");
// Define the breakpoint for a tablet (768px is the common standard)
const isTablet = width >= 768; 

// Helper function to easily apply different sizes based on device
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

const MENU_ITEMS = [
  { id: "1", name: "Paneer", price: 190, src: require("../../assets/panner (2).png") },
  { id: "2", name: "Cauliflower Curry", price: 250, src: require("../../assets/cf.png") },
  { id: "3", name: "Paneer 65", price: 300, src: require("../../assets/panner65.png") },
  { id: "4", name: "Samosa", price: 40, src: require("../../assets/samosa.png") },
  { id: "5", name: "Gulab Jamun", price: 190, src: require("../../assets/gj.png") },
  { id: "6", name: "Laddu", price: 200, src: require("../../assets/laddu.png") },
];

const CATEGORIES = [
  // Icon sizes are now responsive
  { name: "Breakfast", icon: <Feather name="coffee" size={responsiveSize(24, 35)} color="black" /> },
  { name: "Lunch", icon: <MaterialCommunityIcons name="rice" size={responsiveSize(24, 35)} color="black" /> },
  { name: "Snacks", icon: <Ionicons name="pizza-outline" size={responsiveSize(24, 35)} color="black" /> },
  { name: "Dinner", icon: <Ionicons name="moon-outline" size={responsiveSize(24, 35)} color="black" /> },
];

const VIDEO_ITEMS = [
  { id: "v1", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "v2", uri: "https://www.w3schools.com/html/movie.mp4" },
];

const FOOD_SERVICES = [
  { id: "1", title: "Gravy / Curries", page: "Service1", image: require("../../assets/gravy.png") },
  { id: "2", title: "Briyani", page: "Service2", image: require("../../assets/briyani.png") },
  { id: "3", title: "Fast Food", page: "Service3", image: require("../../assets/fast_food.png") },
  { id: "4", title: "Starters", page: "Service4", image: require("../../assets/starters.png") },
  { id: "5", title: "Hot Drinks", page: "Service5", image: require("../../assets/hot_drinks.png") },
  { id: "6", title: "Mojitos", page: "Service6", image: require("../../assets/mojito.png") },
  { id: "7", title: "Desserts", page: "Service7", image: require("../../assets/cake.png") },
  { id: "8", title: "Fruit salad", page: "Service8", image: require("../../assets/fruits.png") },
];

export default function Home1({ navigation }) {   
  const { cartItems, addToCart } = useContext(CartContext); 
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showMoreServices, setShowMoreServices] = useState(false);

  // Show 6 services on tablet, 4 on mobile initially
  const initialServiceCount = isTablet ? 6 : 4;

  const visibleServices = showMoreServices
    ? FOOD_SERVICES.slice(0, 8)
    : FOOD_SERVICES.slice(0, initialServiceCount);

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.uri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={playingVideo === item.id}
        isLooping
      />
      {playingVideo !== item.id && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setPlayingVideo(item.id)}
        >
          <Ionicons name="play-circle" size={responsiveSize(60, 90)} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Today's Specials</Text>
          <TouchableOpacity
            style={styles.nonVegButton}
            onPress={() => navigation.navigate("Home1")}
          >
            <Text style={styles.nonVegText}>Veg</Text>
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
          {MENU_ITEMS.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={item.src} style={styles.cardImage} />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.cardBottomRow}>
                <Text style={styles.itemPrice}>₹ {item.price}</Text>
                <TouchableOpacity style={styles.plusButton} onPress={() => addToCart(item)}>
                  <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <View style={styles.categoryRow}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.name}
              onPress={() => {
                setSelectedCategory(category.name);
                navigation.navigate(category.name);
              }}
              style={styles.categoryContainer}
            >
              {React.cloneElement(category.icon, {
                color: selectedCategory === category.name ? "#165016" : "#888",
              })}
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
              {selectedCategory === category.name && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Videos */}
        <FlatList
          data={VIDEO_ITEMS}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.videoListContainer}
        />

        {/* Food services */}
        <View style={styles.servicesSectionContainer}>
          <Text style={styles.servicesHeading}>Our Food Services</Text>
          <View style={styles.serviceGrid}>
            {visibleServices.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={styles.serviceImageContainer}>
                  <Image source={service.image} style={styles.serviceImage} />
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate(service.page)}>
                  <Text style={styles.menuButtonText}>View Menu</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Show View More only if there are more services available */}
          {FOOD_SERVICES.length > initialServiceCount && (
            <TouchableOpacity style={styles.viewMoreToggle} onPress={() => setShowMoreServices(!showMoreServices)}>
              <Text style={styles.viewMoreText}>{showMoreServices ? "View Less" : "View More"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Footer />

      {/* Floating cart */}
      {cartItems.length > 0 && <Addeditem />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7ffed" },
  container: { flex: 1 },
  
  // --- Header & General Spacing ---
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: responsiveSize(15, 30), // Increased horizontal padding for tablet
    marginVertical: responsiveSize(15, 25),
  },
  heading: { 
    fontSize: responsiveSize(25, 40), // Large font size on tablet
    fontFamily: "intern", 
    fontWeight: "bold", 
    color: "#173b01" 
  },
  nonVegButton: {
    backgroundColor: "#173b01",
    paddingHorizontal: responsiveSize(20, 30),
    paddingVertical: responsiveSize(9, 14),
    borderRadius: 20,
  },
  nonVegText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: responsiveSize(16, 20),
    fontFamily: "intern" 
  },

  // --- Menu Items (Horizontal Scroll) ---
  horizontalScrollContainer: { 
    paddingLeft: responsiveSize(15, 30), 
    paddingVertical: 10 
  },
  card: {
    // Mobile: ~38% width (shows ~2.5 items) | Tablet: ~28% width (shows ~3.5 items)
    width: isTablet ? width * 0.28 : width * 0.38,
    borderRadius: 15,
    marginRight: responsiveSize(15, 20),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: responsiveSize(10, 15),
  },
  imageContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    // Dynamic height based on tablet/mobile width ratio
    height: isTablet ? width * 0.18 : width * 0.25, 
    marginBottom: 10,
  },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  itemName: { 
    fontSize: responsiveSize(14, 20), 
    fontFamily: "intern", 
    fontWeight: "bold", 
    color: "#173b01", 
    marginBottom: 5 
  },
  cardBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemPrice: { 
    fontSize: responsiveSize(14, 18), 
    color: "#173b01" 
  },
  plusButton: { 
    backgroundColor: "#173b01", 
    width: responsiveSize(28, 38), 
    height: responsiveSize(28, 38),
    borderRadius: 20, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  plusText: { 
    color: "#fff", 
    fontSize: responsiveSize(18, 24), 
    fontWeight: "bold", 
    fontFamily: "intern",
    lineHeight: responsiveSize(20, 26) // ensures the '+' symbol is vertically centered
  },

  // --- Categories ---
  categoryRow: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginHorizontal: responsiveSize(15, 30), 
    marginVertical: responsiveSize(20, 30) 
  },
  categoryContainer: { alignItems: "center", flex: 1 },
  categoryText: { 
    fontSize: responsiveSize(14, 18), 
    color: "#888", 
    marginTop: 5, 
    fontFamily: "intern" 
  },
  selectedCategoryText: { color: "#165016", fontWeight: "bold" },
  underline: { marginTop: 6, height: 3, width: "40%", backgroundColor: "#165016", borderRadius: 2 },

  // --- Videos ---
  videoListContainer: { 
    paddingLeft: responsiveSize(15, 30), 
    marginBottom: responsiveSize(20, 30) 
  },
  videoContainer: { 
    // Mobile: 55% width | Tablet: 40% width (to clearly show two videos)
    width: isTablet ? width * 0.4 : width * 0.55, 
    height: responsiveSize(120, 200), // Increased height for tablet
    marginRight: responsiveSize(15, 20), 
    borderRadius: 10, 
    overflow: "hidden", 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#000" 
  },
  video: { width: "100%", height: "100%" },
  playButton: { position: "absolute" },

  // --- Food Services (Grid) ---
  servicesSectionContainer: { paddingHorizontal: responsiveSize(15, 30) },
  servicesHeading: { 
    fontSize: responsiveSize(25, 40), 
    fontFamily: "intern", 
    fontWeight: "bold", 
    color: "#173b01", 
    marginBottom: responsiveSize(15, 25) 
  },
  serviceGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: isTablet ? "space-between" : "space-between", // Ensures items are spaced evenly
    rowGap: responsiveSize(15, 25) 
  },
  serviceCard: { 
    // Mobile: 48% width (2 columns) | Tablet: approx 32% width (3 columns, using flex calculation)
    width: isTablet ? `${100 / 3 - 2}%` : "48%",
    backgroundColor: "#173b01", 
    borderRadius: 15, 
    padding: responsiveSize(15, 25), 
    alignItems: "center",
  },
  serviceImageContainer: { 
    width: responsiveSize(80, 120), 
    height: responsiveSize(80, 120), 
    borderRadius: responsiveSize(40, 60), 
    marginBottom: responsiveSize(10, 15), 
    backgroundColor: "transparent" 
  },
  serviceImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover", 
    borderRadius: responsiveSize(40, 60) 
  },
  serviceTitle: { 
    color: "#fff", 
    fontSize: responsiveSize(16, 20), 
    fontFamily: "intern", 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  menuButton: { 
    backgroundColor: "#D5F0C1", 
    paddingVertical: responsiveSize(6, 10), 
    paddingHorizontal: responsiveSize(16, 25), 
    borderRadius: 15 
  },
  menuButtonText: { 
    color: "#1B3C1D", 
    fontWeight: "bold", 
    fontSize: responsiveSize(12, 16), 
    fontFamily: "intern" 
  },
  viewMoreToggle: { 
    alignSelf: "center", // Centered for better visual balance on tablets
    marginTop: responsiveSize(15, 25), 
    marginBottom: 0, 
    paddingVertical: responsiveSize(8, 12), 
    paddingHorizontal: responsiveSize(20, 30), 
    backgroundColor: "#173b01", 
    borderRadius: 20 
  },
  viewMoreText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: responsiveSize(14, 18), 
    fontFamily: "intern" 
  },
});