// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Platform,
//   StatusBar,
//   useWindowDimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useFavourites } from "../../Pages/Favourites/FavouritesContext";

// const Header = () => {
//   const navigation = useNavigation();
//   const { favourites } = useFavourites();
//   const { width } = useWindowDimensions();

//   // ✅ Detect device type
//   const isTablet = width >= 768;
//   const isLargeTablet = width >= 1024;

//   // ✅ Responsive sizes
//   const getResponsiveSizes = () => {
//     if (isLargeTablet) {
//       return {
//         logoSize: 120,
//         logoRadius: 35,
//         titleFontSize: 28,
//         subtitleFontSize: 16,
//         iconSize: 32,
//         paddingHorizontal: 25,
//         paddingTop: 12,
//         paddingBottom: 15,
//         marginHorizontal: 20,
//         iconGap: 25,
//       };
//     } else if (isTablet) {
//       return {
//         logoSize: 100,
//         logoRadius: 30,
//         titleFontSize: 24,
//         subtitleFontSize: 14,
//         iconSize: 28,
//         paddingHorizontal: 18,
//         paddingTop: 10,
//         paddingBottom: 12,
//         marginHorizontal: 15,
//         iconGap: 18,
//       };
//     } else {
//       return {
//         logoSize: 70,
//         logoRadius: 22,
//         titleFontSize: width < 350 ? 14 : width < 400 ? 16 : 18,
//         subtitleFontSize: width < 350 ? 10 : 11,
//         iconSize: 24,
//         paddingHorizontal: 12,
//         paddingTop: 8,
//         paddingBottom: 10,
//         marginHorizontal: 10,
//         iconGap: 12,
//       };
//     }
//   };

//   const sizes = getResponsiveSizes();
//   const topPadding = Platform.OS === "android" ? StatusBar.currentHeight / 2 : 5;

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           paddingHorizontal: sizes.paddingHorizontal,
//           paddingTop: topPadding,
//           paddingBottom: sizes.paddingBottom,
//         },
//       ]}
//     >
//       {/* Left: Logo */}
//       <Image
//         source={require("../../assets/food_logo.png")}
//         style={[
//           styles.logo,
//           {
//             width: sizes.logoSize,
//             height: sizes.logoSize,
//             borderRadius: sizes.logoRadius,
//           },
//         ]}
//         resizeMode="cover"
//       />

//       {/* Center: Title */}
//       <View
//         style={[
//           styles.centerTextContainer,
//           { marginHorizontal: sizes.marginHorizontal },
//         ]}
//       >
//         <Text
//           numberOfLines={1}
//           adjustsFontSizeToFit
//           style={[
//             styles.title,
//             {
//               fontSize: sizes.titleFontSize,
//               letterSpacing: isLargeTablet ? 1.2 : isTablet ? 0.9 : 0.6,
//             },
//           ]}
//         >
//           KANDHA VILAS KITCHEN
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             { fontSize: sizes.subtitleFontSize, marginTop: isTablet ? 3 : 1 },
//           ]}
//         >
//           (Veg / Non-Veg)
//         </Text>
//       </View>

//       {/* Right: Icons */}
//       <View style={[styles.iconContainer, { gap: sizes.iconGap }]}>
//         {/* ❤️ Favourites */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate("Favouritespage")}
//           style={styles.iconButton}
//         >
//           {favourites.length > 0 && (
//             <View
//               style={[
//                 styles.badge,
//                 {
//                   top: -6, // ✅ Above the icon
//                   right: -6,
//                   width: isLargeTablet ? 24 : isTablet ? 20 : 16,
//                   height: isLargeTablet ? 24 : isTablet ? 20 : 16,
//                 },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.badgeText,
//                   { fontSize: isLargeTablet ? 12 : isTablet ? 10 : 9 },
//                 ]}
//               >
//                 {favourites.length}
//               </Text>
//             </View>
//           )}
//           <Ionicons name="heart-outline" size={sizes.iconSize} color="#ffffff" />
//         </TouchableOpacity>

//         {/* 🛒 Cart */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate("CartScreen")}
//           style={styles.iconButton}
//         >
//           <Ionicons name="cart-outline" size={sizes.iconSize} color="#a99856" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Header;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#165016",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     gap: 8,
//   },
//   logo: {
//     borderRadius: 22,
//     flexShrink: 0,
//   },
//   centerTextContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 70,
//   },
//   title: {
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     fontSize:60,
  
//   },
//   subtitle: {
//     color: "#dcdcdc",
//     fontStyle: "italic",
//     textAlign: "center",
//   },
//   iconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     flexShrink: 0,
//   },
//   iconButton: {
//     position: "relative",
//     padding: 4,
//   },
//   badge: {
//     position: "absolute",
//     backgroundColor: "#ff4d4d",
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 10,
//   },
//   badgeText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });


























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

  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;

  const getResponsiveSizes = () => {
    if (isLargeTablet) {
      return {
        logoSize: 120,
        logoRadius: 35,
        titleFontSize: 26,
        subtitleFontSize: 15,
        iconSize: 32,
        paddingHorizontal: 25,
        paddingTop: 12,
        paddingBottom: 15,
        marginHorizontal: 20,
        iconGap: 25,
      };
    } else if (isTablet) {
      return {
        logoSize: 100,
        logoRadius: 30,
        titleFontSize: 22,
        subtitleFontSize: 13,
        iconSize: 28,
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 12,
        marginHorizontal: 15,
        iconGap: 18,
      };
    } else {
      return {
        logoSize: 70,
        logoRadius: 22,
        titleFontSize: width < 350 ? 18 : 20, // ✅ slightly bigger
        subtitleFontSize: width < 350 ? 11 : 12,
        iconSize: 24,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 10,
        marginHorizontal: 10,
        iconGap: 12,
      };
    }
  };

  const sizes = getResponsiveSizes();
  const topPadding = Platform.OS === "android" ? StatusBar.currentHeight / 2 : 5;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: sizes.paddingHorizontal,
          paddingTop: topPadding,
          paddingBottom: sizes.paddingBottom,
        },
      ]}
    >
      {/* Left: Logo */}
      <Image
        source={require("../../assets/food_logo.png")}
        style={[
          styles.logo,
          {
            width: sizes.logoSize,
            height: sizes.logoSize,
            borderRadius: sizes.logoRadius,
          },
        ]}
        resizeMode="cover"
      />

      {/* Center: Title */}
<View
  style={[
    styles.centerTextContainer,
    { marginHorizontal: sizes.marginHorizontal },
  ]}
>
  <Text
    style={[
      styles.title,
      {
        fontSize: sizes.titleFontSize + 2, // ✅ slightly bigger for better visibility
        color: "#ffffff", // ✅ pure white
        textAlign: "center",
        letterSpacing: isLargeTablet ? 1.2 : isTablet ? 0.9 : 0.6,
        lineHeight: isTablet ? 28 : 24, // ✅ balanced spacing between possible lines
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
        marginTop: isTablet ? 3 : 1,
        color: "#f2f2f2", // ✅ softer white tone for contrast
        textAlign: "center",
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
                  width: isLargeTablet ? 24 : isTablet ? 20 : 16,
                  height: isLargeTablet ? 24 : isTablet ? 20 : 16,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { fontSize: isLargeTablet ? 12 : isTablet ? 10 : 9 },
                ]}
              >
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
    gap: 8,
  },
  logo: {
    borderRadius: 22,
    flexShrink: 0,
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
    flexShrink: 0,
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

