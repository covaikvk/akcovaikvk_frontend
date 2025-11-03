// Forgotpassword.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (width / guidelineBaseWidth) * size;
const isTablet = width >= 768;

export default function Forgotpassword({ navigation }) {
  const [phonenumber, setPhonenumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!phonenumber || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://kvk-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phonenumber: phonenumber.trim(),
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const text = await response.text();
      console.log("🔹 Raw server response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { msg: text };
      }

      const message = data.msg || data.message || "Unknown server response";

      if (response.ok) {
        Alert.alert("✅ Success", message);
        navigation.replace("Login");
      } else {
        Alert.alert("⚠ Failed", message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Network issue or invalid server response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* --- Top Logo Section --- */}
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/food_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* --- Green Strip --- */}
      <View style={styles.strip} />

      {/* --- Forgot Password Form --- */}
      <View style={styles.formSection}>
        <View style={styles.formContentWrapper}>
          <Text style={styles.heading}>Forgot Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phonenumber}
            onChangeText={setPhonenumber}
          />

          {/* --- New Password Field --- */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={scale(22)}
                color="#333"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputUnderline} />

          {/* --- Confirm Password Field --- */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={scale(22)}
                color="#333"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputUnderline} />

          {/* --- Reset Password Button --- */}
          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.6 }]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "UPDATING..." : "RESET PASSWORD"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topSection: {
    backgroundColor: "#2e5d23",
    alignItems: "center",
    justifyContent: "center",
    height: "35%",
  },
  logo: {
    width: scale(200),
    height: scale(200),
    marginTop: scale(60),
  },
  strip: {
    height: scale(50),
    backgroundColor: "#4d7c2f",
    borderTopLeftRadius: scale(25),
    borderTopRightRadius: scale(25),
    marginTop: scale(-20),
  },
  formSection: {
    flex: 1,
    backgroundColor: "#F7FFED",
    marginTop: scale(-20),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    padding: scale(20),
  },
  formContentWrapper: {
    maxWidth: isTablet ? 500 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  heading: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#2e5d23",
    textAlign: "center",
    marginBottom: scale(30),
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: scale(20),
    paddingVertical: scale(8),
    fontSize: scale(16),
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    padding: scale(5),
  },
  inputUnderline: {
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    marginBottom: scale(20),
  },
  loginButton: {
    backgroundColor: "#2e5d23",
    paddingVertical: scale(15),
    width: scale(200),
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    marginTop: scale(10),
    marginBottom: scale(20),
  },
  loginButtonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "bold",
  },
  backText: {
    textAlign: "center",
    fontSize: scale(16),
    color: "#000",
  },
});