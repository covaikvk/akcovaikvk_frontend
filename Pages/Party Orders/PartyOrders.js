import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import { FoodTypeContext } from "../HomePage/FoodTypeContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = width / guidelineBaseWidth;
const normalize = (size) => Math.round(size * scale);

export default function Quotation1() {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isVeg } = useContext(FoodTypeContext);

  useEffect(() => {
    let mounted = true;
    fetch("https://kvk-backend.onrender.com/api/menu/menus")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching services:", err);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const initialServiceCount = 4;
  const visibleServices = services.slice(0, initialServiceCount);

  const handleCardPress = (service) => {
    console.log("Card pressed:", service?.id ?? service?.name);
    navigation.push("Menu1", {
      service,
      type: isVeg ? "veg" : "non-veg",
    });
  };

  const handleViewMenuPress = (service) => {
    console.log("View Menu button pressed:", service?.id ?? service?.name);
    navigation.navigate("Menu1", {
      service,
      type: isVeg ? "veg" : "non-veg",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={normalize(28)} color="#173b01" />
            </TouchableOpacity>

            <Text style={styles.servicesHeading}>Party Orders</Text>
            <View style={{ width: normalize(28) }} />
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#173b01"
              style={{ marginVertical: normalize(20) }}
            />
          ) : (
            <View style={styles.serviceGrid}>
              {visibleServices.map((service, index) => {
                const key = String(service.id ?? index);
                return (
                  <Pressable
                    key={key}
                    style={styles.serviceCard}
                    android_ripple={{ color: "#ffffff20" }}
                    onPress={() => handleCardPress(service)}
                  >
                    <Text style={styles.serviceTitle}>
                      {String(service.name || "")}
                    </Text>

                    <View style={styles.serviceImageContainer}>
                      <Image
                        source={{ uri: service.image_url || "" }}
                        style={styles.serviceImage}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.menuButton}
                      activeOpacity={0.85}
                      onPress={() => handleViewMenuPress(service)}
                    >
                      <Text style={styles.menuButtonText}>View Menu</Text>
                    </TouchableOpacity>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Footer />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7ffed" },
  contentWrapper: { flex: 1, justifyContent: "space-between" },
  container: {
    padding: normalize(15),
    paddingBottom: normalize(30),
    marginTop: normalize(5),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: normalize(25),
    position: "relative",
  },
  servicesHeading: {
    fontSize: normalize(28),
    fontWeight: "bold",
    color: "#173b01",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    zIndex: 1,
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: normalize(15),
    marginBottom: normalize(20),
  },
  serviceCard: {
    width: width >= 768 ? `${100 / 3 - 2}%` : "48%",
    backgroundColor: "#173b01",
    borderRadius: normalize(15),
    padding: normalize(20),
    alignItems: "center",
    marginBottom: normalize(15),
  },
  serviceTitle: {
    color: "#fff",
    fontSize: normalize(18),
    fontWeight: "bold",
    marginBottom: normalize(10),
    textAlign: "center",
  },
  serviceImageContainer: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    marginBottom: normalize(15),
    overflow: "hidden",
    backgroundColor: "#ffffff20",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  menuButton: {
    backgroundColor: "#D5F0C1",
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(15),
  },
  menuButtonText: {
    color: "#1B3C1D",
    fontWeight: "bold",
    fontSize: normalize(14),
  },
  footerContainer: { width: "100%" },
});
