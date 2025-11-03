import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import { FoodTypeContext } from "../HomePage/FoodTypeContext"; // ✅ Import type context

const { width } = Dimensions.get("window");

// --- Responsive scaling setup ---
const guidelineBaseWidth = 375;
const scale = width / guidelineBaseWidth;
const normalize = (size) => Math.round(size * scale);

export default function Quotation1({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get selected food type (veg / non-veg)
  const { isVeg, setIsVeg } = useContext(FoodTypeContext);

  useEffect(() => {
    fetch("https://kvk-backend.onrender.com/api/menu/menus")
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  const initialServiceCount = 4;
  const visibleServices = services.slice(0, initialServiceCount);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header with Back Button and Title */}
          <View style={styles.quotation1headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={normalize(28)} color="#173b01" />
            </TouchableOpacity>

            <Text style={styles.servicesHeading}>Our Food Services</Text>

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
              {visibleServices.map((service, index) => (
                <View key={String(service.id || index)} style={styles.serviceCard}>
                  <Text style={styles.serviceTitle}>{String(service.name || "")}</Text>

                  <View style={styles.serviceImageContainer}>
                    <Image
                      source={{ uri: service.image_url || "" }}
                      style={styles.serviceImage}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() =>
                      navigation.navigate("Menu1", {
                        service,
                        type: isVeg ? "veg" : "non-veg", // ✅ Pass type dynamically
                      })
                    }
                  >
                    <Text style={styles.menuButtonText}>View Menu</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Fixed footer at bottom */}
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
  container: { padding: normalize(15), paddingBottom: normalize(30), marginTop: normalize(5) },
  quotation1headerRow: {
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
  },
  serviceImage: { width: "100%", height: "100%", resizeMode: "cover" },
  menuButton: {
    backgroundColor: "#D5F0C1",
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(15),
  },
  menuButtonText: { color: "#1B3C1D", fontWeight: "bold", fontSize: normalize(14) },
  footerContainer: { width: "100%" },
});
