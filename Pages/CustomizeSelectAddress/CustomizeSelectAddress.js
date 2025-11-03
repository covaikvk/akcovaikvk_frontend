// CustomizeSelectAddress.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (width / guidelineBaseWidth) * size;

export default function CustomizeSelectAddress({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const menuPayload = route?.params?.menuPayload || {};

  useFocusEffect(
    useCallback(() => {
      const loadAddresses = async () => {
        try {
          setLoadingAddresses(true);
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            setAddresses([]);
            setLoadingAddresses(false);
            return;
          }

          const response = await fetch("https://kvk-backend.onrender.com/api/address", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await response.json();
          if (response.ok) setAddresses(data);
          else {
            console.error("Failed to fetch addresses:", data);
            setAddresses([]);
          }
        } catch (error) {
          console.error("Failed to load addresses:", error);
          setAddresses([]);
        } finally {
          setLoadingAddresses(false);
        }
      };

      loadAddresses();
    }, [])
  );

  const getIconName = (type) => {
    switch (type?.toLowerCase()) {
      case "home":
        return "home-outline";
      case "work":
      case "office":
        return "briefcase-outline";
      case "hostel":
        return "location-outline";
      default:
        return "location-outline";
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[styles.addressCard, { borderColor: isSelected ? "#2d5e2f" : "#ccc" }]}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={styles.addressHeader}>
          <View style={styles.iconAndLabel}>
            <Ionicons
              name={getIconName(item.type_of_address)}
              size={scale(20)}
              color="#2d5e2f"
              style={{ marginRight: scale(6) }}
            />
            <Text style={styles.addressType}>{item.type_of_address}</Text>
          </View>
        </View>

        <Text style={styles.addressText}>{item.name}</Text>
        <Text style={styles.addressText}>{item.address_1}</Text>
        {item.address_2 && <Text style={styles.addressText}>{item.address_2}</Text>}
        <Text style={styles.addressText}>
          {item.city}, {item.state} - {item.pincode}
        </Text>
        {item.landmark && <Text style={styles.addressText}>Landmark: {item.landmark}</Text>}
        <Text style={styles.addressText}>Phone: {item.phone_number}</Text>
        {item.alternate_phone_number && (
          <Text style={styles.addressText}>Alt Phone: {item.alternate_phone_number}</Text>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditAddress", { address: item })}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem("token");
                if (!token) return;

                const response = await fetch(
                  `https://kvk-backend.onrender.com/api/address/${item.id}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (response.ok) {
                  setAddresses((prev) => prev.filter((addr) => addr.id !== item.id));
                  if (selectedId === item.id) setSelectedId(null);
                } else {
                  Alert.alert("Error", "Failed to delete address.");
                }
              } catch (err) {
                console.error("Delete error:", err);
              }
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleProceed = () => {
    if (!selectedId) return Alert.alert("Please select an address!");
    setShowPopup(true);
  };

  const handleSubmitOrder = async () => {
    const selectedAddress = addresses.find((addr) => addr.id === selectedId);
    if (!selectedAddress) return Alert.alert("Selected address not found.");

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");

      const total = Number(menuPayload?.total || 0);
      const gst = parseFloat((total * 0.1).toFixed(2));
      const grand_total = parseFloat((total + gst).toFixed(2));

      let user_id = 18;
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (storedUserId) user_id = Number(storedUserId);
        else if (selectedAddress.user_id) user_id = selectedAddress.user_id;
      } catch {}

      const flattenMeals = (dayData) => {
        if (!dayData || typeof dayData !== "object") return [];
        const meals = [];
        Object.entries(dayData).forEach(([mealType, mealArray]) => {
          if (Array.isArray(mealArray)) {
            const items = mealArray.map((item) =>
              typeof item === "string"
                ? item
                : item?.name
                ? item.name
                : JSON.stringify(item)
            );
            meals.push({ meal: mealType, items });
          }
        });
        return meals;
      };

      const safeArray = (data) => {
        try {
          if (!data) return [];
          if (Array.isArray(data)) {
            return data.map((item) =>
              typeof item === "string"
                ? item
                : item?.name
                ? item.name
                : JSON.stringify(item)
            );
          }
          if (typeof data === "object") return flattenMeals(data);
          return [];
        } catch {
          return [];
        }
      };

      const payload = {
        user_id,
        sunday: safeArray(menuPayload?.sunday),
        monday: safeArray(menuPayload?.monday),
        tuesday: safeArray(menuPayload?.tuesday),
        wednesday: safeArray(menuPayload?.wednesday),
        thursday: safeArray(menuPayload?.thursday),
        friday: safeArray(menuPayload?.friday),
        saturday: safeArray(menuPayload?.saturday),
        name: selectedAddress?.name || "",
        phone_number: selectedAddress?.phone_number || "",
        whatsapp_number:
          selectedAddress?.whatsapp_number || selectedAddress?.phone_number || "",
        address_1: selectedAddress?.address_1 || "",
        address_2: selectedAddress?.address_2 || "",
        pincode: selectedAddress?.pincode || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        landmark: selectedAddress?.landmark || "",
        number_of_persons: menuPayload?.persons || 1,
        number_of_weeks: menuPayload?.weeks || 1,
        total: Number(total).toFixed(2),
        gst: gst.toFixed(2),
        grand_total: grand_total.toFixed(2),
      };

      const response = await fetch("https://kvk-backend.onrender.com/api/customizemenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setShowPopup(false);
        setShowSuccessModal(true);
      } else {
        console.error("Customize API Error:", data);
        Alert.alert("Error", data.message || "Failed to submit menu.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.customizeaddressheader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.customizeaddressheaderTitle}>Select Address</Text>
        <View style={{ width: scale(24) }} />
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedId}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No addresses added yet.</Text>
        }
        contentContainerStyle={styles.contentWrapper}
        ListFooterComponent={
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("NewAddress")}
            >
              <Text style={styles.buttonText}>ADD NEW ADDRESS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
              <Text style={styles.buttonText}>PROCEED</Text>
            </TouchableOpacity>
          </>
        }
      />

      {/* Confirmation Modal */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Submission</Text>
            <Text style={styles.modalText}>
              Are you sure you want to submit this customized menu to your selected address?
            </Text>

            {submitting ? (
              <ActivityIndicator size="large" color="#2d5e2f" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                  onPress={() => setShowPopup(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#2d5e2f" }]}
                  onPress={handleSubmitOrder}
                >
                  <Text style={styles.modalBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ✅ Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor: "#fff",
                borderWidth: 1.5,
                borderColor: "#1b5e20",
                elevation: 5,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: "#1b5e20", fontSize: scale(20), marginBottom: 8 },
              ]}
            >
              Success
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: "#2d5e2f", fontSize: scale(15), marginBottom: 25 },
              ]}
            >
              Your customized menu has been submitted!
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#1b5e20",
                paddingVertical: 12,
                paddingHorizontal: 40,
                borderRadius: 8,
                alignSelf: "center",
                elevation: 4,
              }}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate("Home1"); // ✅ Go to Home
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: scale(16),
                  textAlign: "center",
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf7e9" },
  customizeaddressheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
  },
  customizeaddressheaderTitle: {
    fontSize: scale(26),
    fontWeight: "bold",
    color: "#2d5e2f",
  },
  contentWrapper: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: scale(16),
    paddingBottom: scale(40),
  },
  addressCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: scale(12),
    marginBottom: scale(12),
    backgroundColor: "#D6EFB7",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(4),
  },
  iconAndLabel: { flexDirection: "row", alignItems: "center" },
  addressType: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#2d5e2f",
    textTransform: "capitalize",
  },
  addressText: {
    fontSize: scale(14),
    color: "#2d5e2f",
    marginTop: scale(2),
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(10),
  },
  actionButton: {
    flex: 1,
    marginHorizontal: scale(4),
    paddingVertical: scale(6),
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  actionText: { color: "#2d5e2f", fontWeight: "bold", fontSize: scale(14) },
  addButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
    marginVertical: scale(12),
  },
  proceedButton: {
    backgroundColor: "#2d5e2f",
    padding: scale(14),
    borderRadius: 10,
    alignItems: "center",
    marginBottom: scale(16),
  },
  buttonText: { fontWeight: "bold", fontSize: scale(16), color: "#fff" },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: scale(16),
    marginTop: scale(30),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#2d5e2f",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: scale(14),
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "bold" },
});
