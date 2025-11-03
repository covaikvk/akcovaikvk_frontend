import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

const Profile = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(null);
  const [isManageVisible, setIsManageVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await AsyncStorage.getItem("userDetails");
        const adminFlag = await AsyncStorage.getItem("isAdmin");

        console.log("Admin flag from storage:", adminFlag); // 👀 Debug line

        if (data) setUserDetails(JSON.parse(data));
        setIsAdmin(adminFlag === "true"); // ✅ Type-safe check
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userDetails");
          await AsyncStorage.removeItem("isAdmin");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const handleManage = () => {
    setIsManageVisible(true);
  };

  const closeModal = () => {
    setIsManageVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.pageHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={r(24, 32)} color="black" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        <View style={styles.profileheader}>
          <Image
            source={require("../../assets/Profile.png")}
            style={styles.profileImg}
          />
          <Text style={styles.name}>{userDetails?.name || "User Name"}</Text>
          <Text style={styles.email}>
            {userDetails?.phonenumber || "user@example.com"}
          </Text>
        </View>

        <View style={styles.menuBox}>
          <MenuItem
            icon="assignment"
            text="My Orders"
            onPress={() => navigation.navigate("Reorder")}
          />

          {/* ✅ Show Manage Only If Admin */}
          {isAdmin && (
            <MenuItem
              icon="manage-accounts"
              text="Manage"
              onPress={handleManage}
            />
          )}

          <MenuItem icon="payment" text="Payment Method" />
          <MenuItem icon="logout" text="Logout" lastItem onPress={handleLogout} />
        </View>
      </View>

      <Footer />

      <Modal
        visible={isManageVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Orders</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={r(28, 34)} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                closeModal();
                navigation.navigate("Orders");
              }}
            >
              <Text style={styles.optionText}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                closeModal();
                navigation.navigate("RegularOrder");
              }}
            >
              <Text style={styles.optionText}>Regular Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                closeModal();
                navigation.navigate("Quotations");
              }}
            >
              <Text style={styles.optionText}>Quotations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                closeModal();
                navigation.navigate("CustomizeOrder");
              }}
            >
              <Text style={styles.optionText}>Customize Order</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, text, lastItem, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItem, lastItem && { borderBottomWidth: 0 }]}
    onPress={onPress}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Icon
        name={icon}
        size={r(30, 40)}
        color="black"
        style={{ marginRight: r(20, 30) }}
      />
      <Text style={styles.menuText}>{text}</Text>
    </View>
    <Icon name="chevron-right" size={r(30, 40)} color="black" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAFCE6" },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: r(20, 40),
    paddingHorizontal: r(10, 20),
    paddingVertical: r(10, 15),
    backgroundColor: "#EAFCE6",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: r(10, 20),
    top: r(10, 15),
  },
  pageTitle: {
    fontSize: r(32, 32),
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },

  profileheader: {
    alignItems: "center",
    marginBottom: r(20, 30),
  },
  profileImg: {
    width: r(200, 300),
    height: r(200, 300),
    borderRadius: r(150, 300),
  },
  name: {
    fontSize: r(22, 28),
    fontWeight: "600",
    color: "#000",
  },
  email: {
    fontSize: r(16, 20),
    color: "gray",
    paddingVertical: r(10, 15),
  },

  menuBox: {
    marginHorizontal: r(20, 40),
    backgroundColor: "#C6EAAF",
    borderRadius: r(15, 25),
    paddingVertical: r(20, 30),
    paddingHorizontal: r(15, 25),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: r(20, 30),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: r(18, 24),
    fontWeight: "400",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: r(20, 30),
    padding: r(20, 30),
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: r(10, 15),
  },
  modalTitle: {
    fontSize: r(22, 28),
    fontWeight: "700",
    color: "#000",
  },
  optionBtn: {
    backgroundColor: "#C6EAAF",
    borderRadius: r(12, 20),
    paddingVertical: r(12, 16),
    paddingHorizontal: r(10, 15),
    marginVertical: r(6, 8),
  },
  optionText: {
    fontSize: r(18, 24),
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});

export default Profile;
