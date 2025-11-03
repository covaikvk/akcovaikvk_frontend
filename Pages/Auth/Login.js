import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, Alert, Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (width / guidelineBaseWidth) * size;
const isTablet = width >= 768;

export default function LoginScreen({ navigation }) {
  const [Phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ MAIN LOGIN HANDLER
  const handleLogin = async () => {
    if (!Phonenumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password");
      return;
    }

    // ✅ Always reset before new login
    await AsyncStorage.multiRemove(["isAdmin", "token", "userDetails"]);

    // ✅ ADMIN LOGIN
    if (Phonenumber === "9025161693" && password === "Kvk@2025") {
      const adminData = { name: "Admin", phonenumber: "9025161693" };

      await AsyncStorage.multiSet([
        ["isAdmin", "true"],
        ["token", "admin_dummy_token"],
        ["userDetails", JSON.stringify(adminData)],
      ]);

      console.log("✅ Admin login, isAdmin set to TRUE");
      Alert.alert("Admin Login Success", "Welcome Admin");
      navigation.replace("Home1");
      return;
    }

    // ✅ NORMAL USER LOGIN
    setLoading(true);
    try {
      const response = await fetch("https://kvk-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phonenumber: Phonenumber, password }),
      });

      const data = await response.json();
      console.log("📥 Raw Login Response:", data);

      if (response.ok && data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("isAdmin", "false");
        await loadProfile(data.token);

        console.log("✅ Normal login, isAdmin set to FALSE");
        Alert.alert("Login Successful", "Welcome back!");
        navigation.replace("Home1");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Network Error", "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (token) => {
    try {
      const response = await fetch("https://kvk-backend.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userDetails", JSON.stringify(data));
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  // ✅ Debug storage on mount
  useEffect(() => {
    const checkStorage = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("userDetails");
      const adminFlag = await AsyncStorage.getItem("isAdmin");
      console.log("🧩 Storage check → Token:", token, "isAdmin:", adminFlag, "User:", user);
    };
    checkStorage();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.topSection}>
        <Image source={require("../../assets/food_logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.strip} />

      <View style={styles.formSection}>
        <View style={styles.formContentWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={Phonenumber}
            onChangeText={setPhonenumber}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={scale(22)} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputUnderline} />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? "LOGGING IN..." : "LOGIN"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text style={styles.signUpLink} onPress={() => navigation.navigate("Signup")}>Sign up</Text>
          </Text>
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
  logo: { width: scale(200), height: scale(200), marginTop: scale(60) },
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
  signupText: {
    textAlign: "center",
    fontSize: scale(16),
    color: "#000",
  },
  signUpLink: { color: "#0d0e0dff", fontWeight: "bold" },
});
