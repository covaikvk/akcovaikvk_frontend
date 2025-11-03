import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function Signup({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Password visibility toggle
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !phonenumber || !password) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://kvk-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phonenumber,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Signup Success:", data);
        setSuccessVisible(true);
        setFullName("");
        setPhonenumber("");
        setPassword("");
      } else {
        console.error("❌ Signup failed:", data);
        Alert.alert("Signup Failed", data.message || "Please try again later");
      }
    } catch (error) {
      console.error("🚨 Network error:", error);
      Alert.alert("Error", "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessVisible(false);
    navigation.navigate("Login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Top Green Section */}
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/food_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.strip} />

      {/* White Form Section */}
      <View style={styles.formSection}>
        <View style={styles.formContentWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={phonenumber}
            onChangeText={setPhonenumber}
          />

          {/* Password Field with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, borderBottomWidth: 0 }]}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIconContainer}
            >
              <Icon
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#837e7eff"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#333",
              marginBottom: responsiveSize(20, 30),
            }}
          />

          <TouchableOpacity
            style={[styles.signupButton, loading && { opacity: 0.6 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? "SIGNING UP..." : "SIGN UP"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>

      {/* Success Popup */}
      <Modal
        transparent={true}
        visible={successVisible}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Success 🎉</Text>
            <Text style={styles.modalMessage}>
              Signup successful! You can now log in.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.modalButtonText}>GO TO LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topSection: {
    backgroundColor: "#2e5d23",
    alignItems: "center",
    justifyContent: "center",
    height: responsiveSize("35%", "35%"),
  },
  logo: {
    width: responsiveSize(200, 500),
    height: responsiveSize(200, 500),
    marginTop: responsiveSize(60, 80),
  },
  strip: {
    height: responsiveSize(50, 70),
    backgroundColor: "#4d7c2f",
    borderTopLeftRadius: responsiveSize(25, 40),
    borderTopRightRadius: responsiveSize(25, 40),
    marginTop: responsiveSize(-20, -30),
  },
  formSection: {
    flex: 1,
    backgroundColor: "#F7FFED",
    marginTop: responsiveSize(-20, -30),
    borderTopLeftRadius: responsiveSize(20, 35),
    borderTopRightRadius: responsiveSize(20, 35),
    padding: responsiveSize(20, 30),
  },
  formContentWrapper: {
    maxWidth: isTablet ? 500 : "100%",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: isTablet ? 30 : 0,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: responsiveSize(20, 30),
    paddingVertical: responsiveSize(8, 12),
    fontSize: responsiveSize(16, 20),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIconContainer: {
    paddingHorizontal: 5,
  },
  signupButton: {
    backgroundColor: "#2e5d23",
    paddingVertical: responsiveSize(15, 20),
    width: responsiveSize(200, 250),
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    marginTop: responsiveSize(20, 30),
    marginBottom: responsiveSize(20, 30),
  },
  signupButtonText: {
    color: "#fff",
    fontSize: responsiveSize(16, 20),
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    fontSize: responsiveSize(16, 20),
    color: "#000000ff",
  },
  signUpLink: { color: "#0d0e0dff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: responsiveSize(280, 400),
    backgroundColor: "#F7FFED",
    borderRadius: 12,
    padding: responsiveSize(20, 30),
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: responsiveSize(20, 28),
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e5d23",
  },
  modalMessage: {
    fontSize: responsiveSize(16, 20),
    color: "#333",
    marginBottom: responsiveSize(20, 30),
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2e5d23",
    paddingVertical: responsiveSize(10, 15),
    paddingHorizontal: responsiveSize(30, 40),
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveSize(16, 20),
  },
});
