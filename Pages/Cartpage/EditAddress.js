import React, { useState, useEffect } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isWeb = Platform.OS === "web";

// Fully responsive function
const responsive = (mobileSize, tabletSize = mobileSize, webSize = tabletSize) =>
  isWeb ? webSize : isTablet ? tabletSize : mobileSize;

export default function EditAddress({ navigation, route }) {
  const address = route.params?.address;

  const [form, setForm] = useState({
    id: null,
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

  useEffect(() => {
    if (address) setForm({ ...address });
  }, [address]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    const { name, phone_number, pincode, state, city, address_1, type_of_address } = form;

    if (!name || !phone_number || !pincode || !state || !city || !address_1 || !type_of_address) {
      Alert.alert("Error", "All required fields must be filled!");
      return;
    }

    if (!/^\d{10}$/.test(phone_number)) {
      Alert.alert("Error", "Phone number must be exactly 10 digits!");
      return;
    }

    if (form.alternate_phone_number && !/^\d{10}$/.test(form.alternate_phone_number)) {
      Alert.alert("Error", "Alternate phone number must be 10 digits!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please login first.");
        navigation.navigate("Login");
        return;
      }

      const payload = {
        name: form.name,
        phone_number: form.phone_number,
        alternate_phone_number: form.alternate_phone_number || null,
        pincode: form.pincode,
        state: form.state,
        city: form.city,
        address_1: form.address_1,
        address_2: form.address_2 || null,
        landmark: form.landmark || null,
        type_of_address: form.type_of_address,
      };

      const response = await fetch(`https://kvk-backend.onrender.com/api/address/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Address updated successfully!");
        navigation.goBack();
      } else {
        console.error("Failed to update address:", data);
        Alert.alert("Error", data.message || "Could not update address");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Unable to connect to server");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Address</Text>

        {[ 
          { placeholder: "Name", key: "name" },
          { placeholder: "Phone Number", key: "phone_number", keyboardType: "phone-pad" },
          { placeholder: "Alternate Phone Number (Optional)", key: "alternate_phone_number", keyboardType: "phone-pad" },
          { placeholder: "Pincode", key: "pincode", keyboardType: "number-pad" },
          { placeholder: "State", key: "state" },
          { placeholder: "City", key: "city" },
          { placeholder: "Address Line 1", key: "address_1" },
          { placeholder: "Address Line 2 (Optional)", key: "address_2" },
          { placeholder: "Landmark (Optional)", key: "landmark" },
        ].map((field) => (
          <TextInput
            key={field.key}
            placeholder={field.placeholder}
            keyboardType={field.keyboardType ?? "default"}
            style={styles.input}
            value={form[field.key]}
            onChangeText={(text) => handleChange(field.key, text)}
          />
        ))}

        {/* Dropdown for Type of Address */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Type of Address</Text>
          <Picker
            selectedValue={form.type_of_address}
            onValueChange={(value) => handleChange("type_of_address", value)}
          >
            <Picker.Item label="Select Address Type" value="" />
            <Picker.Item label="Home" value="Home" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf7e9" },
  scrollContainer: {
    padding: responsive(16, 24, 32),
    maxWidth: isWeb ? 600 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: responsive(20, 26, 32),
    fontWeight: "bold",
    marginBottom: responsive(16, 24, 32),
    color: "#2d5e2f",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: responsive(6, 10, 12),
    padding: responsive(10, 14, 18),
    marginBottom: responsive(12, 18, 24),
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: responsive(14, 16, 18),
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: responsive(6, 10, 12),
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: responsive(16, 20, 24),
    paddingHorizontal: responsive(8, 12, 14),
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
  },
  saveButtonText: {
    color: "#fff",
    fontSize: responsive(16, 18, 20),
    fontWeight: "bold",
  },
});
