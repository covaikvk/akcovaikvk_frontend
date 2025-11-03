import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";

const { width, height: screenHeight } = Dimensions.get("window");
const isTablet = width >= 768;

// Responsive helper
const responsive = (mobile, tablet) => (isTablet ? tablet : mobile);

export default function Firstpage({ navigation }) {
  const slideUp = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [showSplash, setShowSplash] = useState(true);

  const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("logintoken:", token || "no token");
    if (token) {
          // ✅ Token exists → redirect to Home1
          navigation.replace("Home1");
        } else {
          // ❌ No token → redirect to Login
          navigation.replace("Login");
        }
  } catch (error) {
    console.log("Error getting token:", error);
  }
};
  useEffect(() => {

getToken();


    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideUp, {
          toValue: -screenHeight,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSplash(false);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d5e2f" />

      {/* Splash Screen */}
      {showSplash && (
        <Animated.View style={[styles.splash, { transform: [{ translateY: slideUp }] }]}>
          <Image
            source={require("../../assets/logo1.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.kandhaText}>KANDHA VILAS</Text>
          <View style={styles.separator} />
          <Text style={styles.kitchenText}>K I T C H E N</Text>
          <Text style={styles.tagline}>Taste Towards Tradition . . .</Text>
        </Animated.View>
      )}

      {/* Welcome Screen */}
      <Animated.View style={[styles.welcome, { opacity: fadeIn }]}>
        <Image
          source={require("../../assets/logo1.png")}
          style={styles.logoSmall}
          resizeMode="contain"
        />
        <Text style={styles.title}>கந்தவிலாஸ்</Text>
        <Text style={styles.title1}>கிட்சேன்</Text>
        <Text style={styles.subtitle}>பாரம்பரிய சுவையை நோங்கி</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.btnText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2d5e2f" },
  splash: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsive(10, 20),
    zIndex: 10,
  },
  logoImage: {
    width: responsive(300, 500),
    height: responsive(300, 500),
    marginBottom: responsive(-80, -120),
  },
  kandhaText: {
    fontSize: responsive(30, 44),
    color: "#fff",
    fontWeight: "600",
    fontFamily: "serif",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  separator: {
    width: "40%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: responsive(8, 14),
  },
  kitchenText: {
    fontSize: responsive(22, 30),
    color: "#fff",
    letterSpacing: responsive(8, 12),
    fontWeight: "bold",
  },
  tagline: {
    marginTop: responsive(60, 90),
    fontStyle: "italic",
    color: "#f9c440",
    fontSize: responsive(16, 22),
    marginLeft: responsive(100, 160),
  },
  welcome: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSmall: {
    width: responsive(300, 450),
    height: responsive(300, 450),
    marginBottom: responsive(-110, -150),
  },
  title: {
    color: "#fff",
    fontSize: responsive(30, 45),
    fontWeight: "bold",
  },
  title1: {
    color: "#fff",
    fontSize: responsive(25, 35),
    fontWeight: "bold",
    marginTop:5,
  },
  subtitle: {
    color: "#fff",
    fontSize: responsive(10, 18),
    marginTop: responsive(6, 10),
  },
  btnRow: {
    flexDirection: "row",
    marginTop: responsive(30, 50),
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: responsive(16, 24),
    paddingHorizontal: responsive(26, 40),
    borderRadius: responsive(12, 18),
    marginHorizontal: responsive(8, 14),
  },
  btnText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: responsive(24, 32),
  },
});