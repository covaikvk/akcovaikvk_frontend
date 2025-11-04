import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFavourites } from "../../Pages/Favourites/FavouritesContext";

const Header = () => {
  const navigation = useNavigation();
  const { favourites } = useFavourites();
  const { width } = useWindowDimensions();

  // ✅ Compact but responsive scaling logic
  const scale = width / 375;
  const clamp = (value) => Math.round(Math.max(value * scale, value * 0.85));

  const topPadding =
    Platform.OS === "android"
      ? (StatusBar.currentHeight || 24) * 0.8 // ✅ ensures enough space for all Androids
      : 40; // ✅ safe top padding for iOS notch devices

  const sizes = {
    logoSize: clamp(70),
    logoRadius: clamp(22),
    titleFontSize: clamp(20),
    subtitleFontSize: clamp(12),
    iconSize: clamp(24),
    paddingHorizontal: clamp(12),
    paddingTop: topPadding,
    paddingBottom: clamp(10),
    marginHorizontal: clamp(10),
    iconGap: clamp(12),
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: sizes.paddingHorizontal,
          paddingTop: sizes.paddingTop,
          paddingBottom: sizes.paddingBottom,
        },
      ]}
    >
      {/* Left: Logo */}
      <Image
        source={require("../../assets/food_logo.png")}
        style={{
          width: sizes.logoSize,
          height: sizes.logoSize,
          borderRadius: sizes.logoRadius,
        }}
        resizeMode="cover"
      />

      {/* Center: Title */}
      <View
        style={[styles.centerTextContainer, { marginHorizontal: sizes.marginHorizontal }]}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: sizes.titleFontSize,
              color: "#ffffff",
              letterSpacing: 0.5,
              lineHeight: sizes.titleFontSize + 4,
            },
          ]}
        >
          KANDHA VILAS KITCHEN
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: sizes.subtitleFontSize,
              color: "#f2f2f2",
              marginTop: 2,
            },
          ]}
        >
          (Veg / Non-Veg)
        </Text>
      </View>

      {/* Right: Icons */}
      <View style={[styles.iconContainer, { gap: sizes.iconGap }]}>
        {/* ❤️ Favourites */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Favouritespage")}
          style={styles.iconButton}
        >
          {favourites.length > 0 && (
            <View
              style={[
                styles.badge,
                {
                  top: -6,
                  right: -6,
                  width: clamp(16),
                  height: clamp(16),
                },
              ]}
            >
              <Text style={[styles.badgeText, { fontSize: clamp(9) }]}>
                {favourites.length}
              </Text>
            </View>
          )}
          <Ionicons name="heart-outline" size={sizes.iconSize} color="#ffffff" />
        </TouchableOpacity>

        {/* 🛒 Cart */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CartScreen")}
          style={styles.iconButton}
        >
          <Ionicons name="cart-outline" size={sizes.iconSize} color="#a99856" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#165016",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  centerTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontStyle: "italic",
    textAlign: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconButton: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    backgroundColor: "#ff4d4d",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
