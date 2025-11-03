import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuotation } from "../../Pages/Quotation Services/QuotationContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobileSize, tabletSize) =>
  isTablet ? tabletSize : mobileSize;

export default function Details({ onClose }) {
  const navigation = useNavigation();
  const { quotationItems, clearQuotation } = useQuotation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsappNumber: "",
    numberOfPerson: "",
    date_of_function: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      const formatted = selectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date_of_function: formatted }));
      console.log("📅 Function Date Stored:", formatted);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert("Error", "Please fill at least name and phone number.");
      return;
    }

    if (quotationItems.length === 0) {
      Alert.alert("Error", "No menu items added to quotation.");
      return;
    }

    if (!formData.date_of_function) {
      Alert.alert("Error", "Please select the Date of Function.");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      list: quotationItems.map((item) => ({
        item: item.title,
        quantity: item.quantity || 1,
      })),
    };

    console.log("📦 Payload sending:", payload);

    try {
      const response = await fetch(
        "https://kvk-backend.onrender.com/api/quotations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Server raw response:", text);
        data = { message: text };
      }

      if (response.ok) {
        setSuccessMessage("Quotation Submitted Successfully! 🎉");
        setShowPopup(true);
        clearQuotation();

        setFormData({
          name: "",
          phone: "",
          whatsappNumber: "",
          numberOfPerson: "",
          date_of_function: "",
        });

        setTimeout(() => {
          setShowPopup(false);
          navigation.navigate("Home1");
        }, 2000);
      } else {
        console.error("Submission failed:", data);
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSuccessMessage("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={responsiveSize(22, 28)} color="#0b2600" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.form}>
        {Object.keys(formData)
          .filter((key) => key !== "date_of_function")
          .map((key) => (
            <TextInput
              key={key}
              style={[
                styles.input,
                {
                  fontSize: responsiveSize(15, 18),
                  paddingVertical: responsiveSize(4, 6),
                },
              ]}
              placeholder={key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              placeholderTextColor="#0b2600"
              value={formData[key]}
              onChangeText={(t) => handleChange(key, t)}
            />
          ))}

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#0b2600" />
          <Text style={styles.dateText}>
            {formData.date_of_function
              ? `Date of Function: ${formData.date_of_function}`
              : "Select Date of Function"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          style={[
            styles.submitBtn,
            loading && { opacity: 0.6 },
            { paddingVertical: responsiveSize(10, 14) },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[
                styles.submitText,
                { fontSize: responsiveSize(16, 20) },
              ]}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePopup}
      >
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.popupContainer,
              {
                padding: responsiveSize(20, 28),
                width: isTablet ? "50%" : "80%",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.popupClose}
              onPress={handleClosePopup}
            >
              <Ionicons
                name="close"
                size={responsiveSize(22, 28)}
                color="#0b2600"
              />
            </TouchableOpacity>

            {successMessage ? (
              <Text
                style={[
                  styles.successMessage,
                  {
                    fontSize: responsiveSize(18, 22),
                    marginTop: responsiveSize(40, 60),
                    marginBottom: responsiveSize(30, 40),
                  },
                ]}
              >
                {successMessage}
              </Text>
            ) : (
              <>
                <Text
                  style={[
                    styles.popupTitle,
                    {
                      fontSize: responsiveSize(18, 22),
                      marginBottom: responsiveSize(12, 16),
                    },
                  ]}
                >
                  Submitted Details
                </Text>
                <ScrollView style={{ maxHeight: responsiveSize(300, 400) }}>
                  {Object.entries(formData).map(([key, value]) => (
                    <Text
                      key={key}
                      style={[
                        styles.popupText,
                        {
                          fontSize: responsiveSize(15, 18),
                          marginVertical: responsiveSize(4, 6),
                        },
                      ]}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :
                      </Text>{" "}
                      {value || "-"}
                    </Text>
                  ))}
                </ScrollView>
              </>
            )}

            <TouchableOpacity
              style={[
                styles.popupButton,
                {
                  paddingVertical: responsiveSize(8, 12),
                  marginTop: responsiveSize(16, 20),
                },
              ]}
              onPress={handleClosePopup}
            >
              <Text
                style={[
                  styles.popupButtonText,
                  { fontSize: responsiveSize(15, 18) },
                ]}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d6eeb9",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    position: "relative",
    elevation: 3,
    width: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  form: {
    paddingTop: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#0b2600",
    marginVertical: 8,
    color: "#0b2600",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#0b2600",
    marginTop: 10,
  },
  dateText: {
    color: "#0b2600",
    marginLeft: 8,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: "#0b2600",
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "#e8f8dc",
    borderRadius: 12,
    elevation: 5,
  },
  popupClose: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  popupTitle: {
    fontWeight: "bold",
    color: "#0b2600",
    textAlign: "center",
  },
  popupText: {
    color: "#0b2600",
  },
  successMessage: {
    fontWeight: "bold",
    color: "#0b2600",
    textAlign: "center",
  },
  popupButton: {
    backgroundColor: "#0b2600",
    borderRadius: 8,
    alignItems: "center",
  },
  popupButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
