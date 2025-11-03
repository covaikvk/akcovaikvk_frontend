// Home1.js
import React, { useState, useContext, useEffect, createContext, useRef } from "react";
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
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";
import YoutubePlayer from "react-native-youtube-iframe";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Addeditem from "../../Components/Addeditem/Addeditem";
import { CartContext } from "../Cartpage/CartContext";
import { useFavourites } from "../Favourites/FavouritesContext";

export const FoodTypeContext = createContext();
const { width } = Dimensions.get("window");
const scale = width / 375;
const responsiveSize = (size) => Math.round(size * scale);

const CATEGORIES = [
  { name: "Breakfast", icon: <Feather name="coffee" size={responsiveSize(24)} color="black" /> },
  { name: "Lunch", icon: <MaterialCommunityIcons name="rice" size={responsiveSize(24)} color="black" /> },
  { name: "Snacks", icon: <Ionicons name="pizza-outline" size={responsiveSize(24)} color="black" /> },
  { name: "Dinner", icon: <Ionicons name="moon-outline" size={responsiveSize(24)} color="black" /> },
];

const SERVICE_CARDS = [
  { name: "Regular Menu", image: require("../../assets/biriyani.png"), route: "RegularMenu" },
  { name: "Customize Menu", image: require("../../assets/biriyani.png"), route: "CustomizeMenuScreen" },
  { name: "Party Orders", image: require("../../assets/biriyani.png"), route: "PartyOrders" },
];

export default function Home1({ navigation }) {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { toggleFavourite, isFavourite } = useFavourites();
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isVeg, setIsVeg] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});
  const videoRefs = useRef([]);

  const fetchMenuData = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`https://kvk-backend.onrender.com/api/todayspecial?type=${type}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching today's specials:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    setVideoLoading(true);
    try {
      const response = await fetch("https://kvk-backend.onrender.com/api/videos");
      const data = await response.json();
      setVideos(data);
      videoRefs.current = data.map(() => React.createRef());
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setVideoLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData("veg");
    fetchVideos();
  }, []);

  const handleToggle = () => {
    const newType = isVeg ? "non-veg" : "veg";
    setIsVeg(!isVeg);
    fetchMenuData(newType);
  };

  const handleIncrement = (item) => {
    const updatedQty = (itemQuantities[item.id] || 0) + 1;
    setItemQuantities({ ...itemQuantities, [item.id]: updatedQty });
    addToCart({
      name: item.title,
      price: item.price,
      desc: item.description,
      image: { uri: item.image_url },
    });
  };

  const handleDecrement = (item) => {
    const currentQty = itemQuantities[item.id] || 0;
    if (currentQty > 0) {
      const updatedQty = currentQty - 1;
      setItemQuantities({ ...itemQuantities, [item.id]: updatedQty });
      removeFromCart(item.id);
    }
  };

  const renderVideoItem = ({ item, index }) => {
    const videoRef = videoRefs.current[index];
    const handlePlay = async () => {
      videoRefs.current.forEach((ref, i) => {
        if (ref.current && i !== index) ref.current.pauseAsync?.();
      });
      if (videoRef.current && videoRef.current.playAsync) {
        await videoRef.current.playAsync();
        setPlayingVideo(item.id);
      }
    };

    const isYouTube = item.video_url.includes("youtube.com") || item.video_url.includes("youtu.be");
    const getYouTubeId = (url) => {
      let match = url.match(/v=([a-zA-Z0-9_-]{11})/);
      if (!match) match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    };

    return (
      <View style={styles.videoContainer}>
        {isYouTube ? (
          Platform.OS === "web" ? (
            <WebView
              style={styles.video}
              javaScriptEnabled
              domStorageEnabled
              source={{ uri: `https://www.youtube.com/embed/${getYouTubeId(item.video_url)}` }}
            />
          ) : (
            <YoutubePlayer
              height={150}
              width={width * 0.9}
              videoId={getYouTubeId(item.video_url)}
              play={playingVideo === item.id}
              onChangeState={(state) => {
                if (state === "playing") setPlayingVideo(item.id);
                if (state === "paused" || state === "ended") setPlayingVideo(null);
              }}
            />
          )
        ) : (
          <>
            <Video
              ref={videoRef}
              source={{ uri: item.video_url }}
              style={styles.video}
              resizeMode="cover"
              isLooping
            />
            {playingVideo !== item.id && (
              <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                <Ionicons name="play-circle" size={responsiveSize(60)} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const ServiceCard = ({ name, image, route }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const onPressIn = () => {
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <AnimatedTouchable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => navigation.navigate(route)}
        style={[styles.serviceCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <Image source={image} style={styles.serviceImage} />
        <Text style={styles.serviceName}>{name}</Text>
      </AnimatedTouchable>
    );
  };

  return (
    <FoodTypeContext.Provider value={{ isVeg, setIsVeg }}>
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingBottom: cartItems.length > 0 ? responsiveSize(200) : responsiveSize(100),
          }}
        >
          {/* ✅ Today's Specials */}
          <View style={styles.homeheaderRow}>
            <Text style={styles.heading}>
              {isVeg ? "Today's Veg Specials" : "Today's Non-Veg Specials"}
            </Text>
            <TouchableOpacity
              style={[styles.toggleButton, isVeg ? styles.vegButton : styles.nonVegButton]}
              onPress={handleToggle}
            >
              <Text style={[styles.toggleText, isVeg ? styles.vegText : styles.nonVegText]}>
                {isVeg ? "Non-Veg" : "Veg"}
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#173b01" style={{ marginVertical: responsiveSize(20) }} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContainer}
            >
              {menuItems.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                    <TouchableOpacity
                      style={styles.favButton}
                      onPress={() =>
                        toggleFavourite({
                          id: item.id,
                          title: item.title,
                          image_url: item.image_url,
                          price: item.price,
                          description: item.description,
                        })
                      }
                    >
                      <Ionicons
                        name={isFavourite(item.id) ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavourite(item.id) ? "red" : "white"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemName}>{item.title}</Text>
                  <View style={styles.cardBottomRow}>
                    <Text style={styles.itemPrice}>₹ {item.price}</Text>
                    <View style={styles.quantityRow}>
                      <TouchableOpacity
                        style={styles.smallBtn}
                        onPress={() => handleDecrement(item)}
                      >
                        <Text style={styles.smallBtnText}>–</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{itemQuantities[item.id] || 0}</Text>
                      <TouchableOpacity
                        style={styles.smallBtn}
                        onPress={() => handleIncrement(item)}
                      >
                        <Text style={styles.smallBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* ✅ Categories */}
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

          {/* ✅ Videos */}
          {videoLoading ? (
            <ActivityIndicator size="large" color="#173b01" style={{ marginVertical: responsiveSize(20) }} />
          ) : (
            <FlatList
              data={videos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.videoListContainer}
            />
          )}

          {/* ✅ Service Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
            {SERVICE_CARDS.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </ScrollView>
        </ScrollView>
        <Footer />
        {cartItems.length > 0 && <Addeditem />}
      </SafeAreaView>
    </FoodTypeContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7ffed" },
  container: { flex: 1 },
  homeheaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 15,
  },
  heading: { fontSize: 25, fontWeight: "bold", color: "#173b01" },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  vegButton: { backgroundColor: "#cdeecf", borderWidth: 1, borderColor: "#9fd6a3" },
  nonVegButton: { backgroundColor: "#173b01" },
  toggleText: { fontWeight: "bold", fontSize: 16 },
  vegText: { color: "#165016" },
  nonVegText: { color: "#fff" },
  horizontalScrollContainer: { paddingLeft: 15, paddingVertical: 10 },
  card: {
    width: width * 0.38,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    padding: 10,
  },
  imageContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    height: width * 0.25,
    marginBottom: 10,
    position: "relative",
  },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  favButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemName: { fontSize: 14, fontWeight: "bold", color: "#173b01", marginBottom: 5 },
  cardBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemPrice: { fontSize: 14, color: "#173b01" },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  smallBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#173b01",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  smallBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityText: { fontSize: 14, color: "#173b01", fontWeight: "bold" },
  categoryRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  categoryContainer: { alignItems: "center", flex: 1 },
  categoryText: { fontSize: 14, color: "#888", marginTop: 5 },
  selectedCategoryText: { color: "#165016", fontWeight: "bold" },
  underline: { marginTop: 6, height: 3, width: "40%", backgroundColor: "#165016", borderRadius: 2 },
  videoListContainer: { paddingLeft: 15, marginBottom: 20 },
  videoContainer: {
    width: width * 0.9,
    height: 200,
    alignSelf: "center",
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: { width: "100%", height: "100%" },
  playButton: { position: "absolute" },
  serviceCard: {
    width: width * 0.38,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: "#2d5e2f",
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  serviceImage: {
    width: "100%",
    height: width * 0.25,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10,
  },
  serviceName: { fontSize: 14, fontWeight: "bold", color: "#fff", textAlign: "center" },
});
