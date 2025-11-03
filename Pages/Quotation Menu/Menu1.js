import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuotation } from "../Quotation Services/QuotationContext";
import Menuheader from "../../Components/Header/Menuheader";
import QuotationMenu from "../../Components/Quotation Menu/QuotationMenu";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobile, tablet) => (isTablet ? tablet : mobile);

export default function Menu1() {
  const route = useRoute();
  const navigation = useNavigation();

  const { quotationItems = [], addToQuotation, removeFromQuotation } = useQuotation();
  const { service, type } = route.params || {};
  const serviceId = service?.id;
  const serviceName = service?.name || "Menu";
  const serviceImageUrl = service?.image_url;

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const API_URL = serviceId
      ? `https://kvk-backend.onrender.com/api/menu/menulist_by_menuid/${serviceId}`
      : `https://kvk-backend.onrender.com/api/menu/allmenus`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        let items = Array.isArray(data) ? data : [];
        if (type === "veg") items = items.filter((i) => i.type?.toLowerCase() === "veg");
        else if (type === "non-veg") items = items.filter((i) => i.type?.toLowerCase() === "non-veg");
        setMenuItems(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load menu: ${err.message}`);
        setLoading(false);
      });
  }, [serviceId, type]);

  // ✅ Add only once with quantity = 1
  const safeAdd = (item) => {
    const alreadyAdded = quotationItems.some((it) => it.id === item.id);
    if (!alreadyAdded && typeof addToQuotation === "function") {
      addToQuotation({ ...item, quantity: 1 }); // only one quantity
      setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    }
  };

  // ✅ Remove item and re-enable "Add"
  const safeRemove = (id) => {
    if (typeof removeFromQuotation === "function") removeFromQuotation(id);
    setAddedItems((prev) => ({ ...prev, [id]: false }));
  };

  // ✅ Sync Add buttons with cart changes
  useEffect(() => {
    const updatedAddedItems = {};
    quotationItems.forEach((item) => {
      updatedAddedItems[item.id] = true;
    });
    setAddedItems(updatedAddedItems);
  }, [quotationItems]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Menuheader />

      <View style={styles.Menu1headerCard}>
        <Image
          source={
            serviceImageUrl
              ? { uri: serviceImageUrl }
              : require("../../assets/biriyanibanner.jpg")
          }
          style={styles.Menu1headerImage}
        />
        <View style={styles.Menu1headerOverlay}>
          <Text style={styles.Menu1headerTitle}>{serviceName}</Text>
          <Text style={styles.Menu1headerSubtitle}>
            Explore Our Delicious {type ? type.toUpperCase() : ""} Menu
          </Text>
        </View>
      </View>

      {/* ✅ Scrollable Menu Grid */}
      <View style={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#173b01" style={{ marginTop: r(50, 80) }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : menuItems.length === 0 ? (
          <Text style={styles.errorText}>No items found.</Text>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {menuItems.map((item) => {
                const isAdded = addedItems[item.id] === true;

                return (
                  <View key={item.id} style={styles.card}>
                    <Text style={styles.foodName}>{item.title}</Text>
                    <Image source={{ uri: item.image_url }} style={styles.foodImage} />

                    <View style={styles.actionContainer}>
                      {/* Add Button */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: isAdded ? "#173b0180" : "#173b01" },
                        ]}
                        onPress={() => safeAdd(item)}
                        disabled={isAdded}
                        activeOpacity={isAdded ? 1 : 0.8}
                      >
                        <Text style={styles.actionText}>
                          {isAdded ? "Added" : "Add"}
                        </Text>
                      </TouchableOpacity>

                      {/* Remove Button */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: isAdded ? "#a92a2a" : "#a92a2a80" },
                        ]}
                        disabled={!isAdded}
                        onPress={() => safeRemove(item.id)}
                        activeOpacity={isAdded ? 0.8 : 1}
                      >
                        <Text style={styles.actionText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Quotation Menu */}
      <QuotationMenu />

      {/* ✅ Fixed Footer */}
      <View style={styles.footerFixed}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf7e9",
  },
  Menu1headerCard: {
    position: "relative",
    height: r(200, 300),
    marginBottom: 20,
  },
  Menu1headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  Menu1headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  Menu1headerTitle: {
    fontSize: r(24, 36),
    fontWeight: "bold",
    color: "#fff",
  },
  Menu1headerSubtitle: {
    fontSize: r(14, 20),
    color: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: r(10, 20),
    paddingBottom: r(120, 180),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#D5F0C1",
    borderRadius: r(10, 15),
    padding: r(10, 15),
    marginBottom: r(15, 25),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  foodName: {
    color: "#173b01",
    fontSize: r(15, 20),
    fontWeight: "bold",
    marginBottom: r(8, 10),
    textAlign: "center",
  },
  foodImage: {
    width: r(90, 140),
    height: r(90, 140),
    borderRadius: r(10, 15),
    marginBottom: r(8, 12),
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: r(5, 10),
  },
  actionButton: {
    flex: 1,
    paddingVertical: r(6, 10),
    borderRadius: r(8, 12),
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: r(12, 14),
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: r(20, 30),
    fontSize: r(16, 20),
  },
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
