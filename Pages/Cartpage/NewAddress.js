import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isWeb = Platform.OS === "web";

const responsive = (mobile, tablet = mobile, web = tablet) =>
  isWeb ? web : isTablet ? tablet : mobile;

export default function NewAddress({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    alternate_phone_number: "",
    pincode: "",
    state: "",
    city: "",
    address_1: "",
    address_2: "",
    landmark: "",
    type_of_address: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    const { name, phone_number, pincode, state, city, address_1, type_of_address } = form;

    if (!name || !phone_number || !pincode || !state || !city || !address_1 || !type_of_address) {
      Alert.alert("Error", "All required fields must be filled!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please login first.");
        navigation.navigate("Login");
        return;
      }

      const bodyData = {
        ...form,
        alternate_phone_number: form.alternate_phone_number || null,
        address_2: form.address_2 || null,
        landmark: form.landmark || null,
      };

      const response = await fetch("https://kvk-backend.onrender.com/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Address saved successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "Could not save address");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Unable to connect to server");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✅ Header with Back Arrow + Title */}
      <View style={styles.editaddressheader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={responsive(24, 28, 30)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.editaddressheaderTitle}>Add New Address</Text>
      </View>

      {/* ✅ Keyboard Avoid + Scroll */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {[
            { placeholder: "Name", key: "name" },
            { placeholder: "Phone Number", key: "phone_number", keyboardType: "phone-pad" },
            {
              placeholder: "Alternate Phone Number (Optional)",
              key: "alternate_phone_number",
              keyboardType: "phone-pad",
            },
            { placeholder: "Pincode", key: "pincode", keyboardType: "number-pad" },
            { placeholder: "State", key: "state" },
            { placeholder: "City", key: "city" },
            { placeholder: "Address Line 1", key: "address_1" },
            { placeholder: "Address Line 2 (Optional)", key: "address_2" },
            { placeholder: "Landmark", key: "landmark" },
          ].map((field) => (
            <TextInput
              key={field.key}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType ?? "default"}
              style={styles.input}
              value={form[field.key]}
              onChangeText={(text) => handleChange(field.key, text)}
              multiline={field.key.includes("address")}
              numberOfLines={field.key.includes("address") ? 3 : 1}
            />
          ))}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Type of Address</Text>
            <Picker
              selectedValue={form.type_of_address}
              onValueChange={(value) => handleChange("type_of_address", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Address Type" value="" />
              <Picker.Item label="Home" value="Home" />
              <Picker.Item label="Office" value="Office" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE ADDRESS</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eaf7e9",
  },
  editaddressheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsive(12, 16, 20),
    backgroundColor: "#eaf7e9",
    borderBottomColor: "#d6e6d4",
  },
  backButton: {
    position: "absolute",
    left: responsive(16, 20, 24),
    zIndex: 10,
  },
  editaddressheaderTitle: {
    fontSize: responsive(22, 26, 30),
    fontWeight: "bold",
    color: "#2d5e2f",
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: responsive(16, 24, 32),
    width: "100%",
    maxWidth: isWeb ? 600 : "100%",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: responsive(6, 10, 12),
    padding: responsive(10, 14, 18),
    marginBottom: responsive(12, 18, 24),
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: responsive(14, 16, 18),
    width: "100%",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: responsive(6, 10, 12),
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: responsive(16, 20, 24),
    paddingHorizontal: responsive(8, 12, 14),
  },
  picker: {
    width: "100%",
  },
  label: {
    fontSize: responsive(14, 16, 18),
    fontWeight: "500",
    marginBottom: responsive(4, 6, 8),
    color: "#2d5e2f",
  },
  saveButton: {
    backgroundColor: "#2d5e2f",
    paddingVertical: responsive(12, 16, 20),
    borderRadius: responsive(8, 12, 14),
    alignItems: "center",
    marginTop: responsive(10, 14, 18),
    marginBottom: responsive(30, 40, 50),
  },
  saveButtonText: {
    color: "#fff",
    fontSize: responsive(16, 18, 20),
    fontWeight: "bold",
  },
});
