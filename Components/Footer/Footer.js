import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState("Home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Home */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setActive("Home");
            navigation.navigate("Home1");
          }}
        >
          <Ionicons
            name="home"
            size={26}
            color={active === "Home" ? "#165016" : "#8e8e8e"}
          />
          <Text style={[styles.label, active === "Home" && styles.activeLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Reorder */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setActive("Reorder");
            navigation.navigate("Reorder");
          }}
        >
          <MaterialIcons
            name="list-alt"
            size={26}
            color={active === "Reorder" ? "#165016" : "#8e8e8e"}
          />
          <Text
            style={[styles.label, active === "Reorder" && styles.activeLabel]}
          >
            Reorder
          </Text>
        </TouchableOpacity>

        {/* About Us */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setActive("AboutUs");
            navigation.navigate("AboutUs");
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={26}
            color={active === "AboutUs" ? "#165016" : "#8e8e8e"}
          />
          <Text
            style={[styles.label, active === "AboutUs" && styles.activeLabel]}
          >
            About Us
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setActive("Profile");
            navigation.navigate("Profile");
          }}
        >
          <Ionicons
            name="person-circle-outline"
            size={26}
            color={active === "Profile" ? "#165016" : "#8e8e8e"}
          />
          <Text
            style={[styles.label, active === "Profile" && styles.activeLabel]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: height * 0.015, // responsive height
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#165016",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 7,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontSize: width * 0.035, // responsive font
    color: "#8e8e8e",
    marginTop: 3,
  },
  activeLabel: {
    color: "#165016",
    fontWeight: "600",
  },
});

export default Footer;