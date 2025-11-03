import React from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // <-- import hook

export default function Menuheader() {
  const navigation = useNavigation(); // <-- useNavigation hook

  return (
    <View style={styles.menuheader}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // ✅ Fixed: goBack instead of navigate
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder="Search...."
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
      </View>

      {/* Cart Icon */}
      <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
        <Ionicons name="cart" size={28} color="darkgreen" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eaf7e9", // corrected double ##
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "darkgreen",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
});
