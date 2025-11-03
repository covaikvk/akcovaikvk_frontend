// // ✅ CustomizeMenuScreen.js
// import React, { useContext, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Modal,
//   Dimensions,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useFocusEffect } from "@react-navigation/native";
// import { MenuContext } from "../../Pages/CustomizeMenu/MenuContext";
// import Footer from "../../Components/Footer/Footer";

// const { width, height } = Dimensions.get("window");
// const isTablet = width >= 768;

// const days = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const meals = ["Breakfast", "Lunch", "Dinner"];

// export default function CustomizeMenuScreen({ navigation }) {
//   const { getItemNames, removeItemsForDayMeal, calculateTotalPrice } =
//     useContext(MenuContext);

//   const [refreshKey, setRefreshKey] = useState(0);
//   const [menuData, setMenuData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [persons, setPersons] = useState(0);
//   const [weeks, setWeeks] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedMeal, setSelectedMeal] = useState("");

//   useFocusEffect(
//     useCallback(() => {
//       setRefreshKey((prev) => prev + 1);
//       fetchMenuData();
//     }, [])
//   );

//   const fetchMenuData = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         Alert.alert("Login Required", "Please log in again to continue.");
//         navigation.replace("Login");
//         return;
//       }

//       const response = await fetch(
//         "https://kvk-backend.onrender.com/api/customizemenu",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (response.ok && Array.isArray(data) && data.length > 0) {
//         setMenuData(data[0]);
//       } else {
//         setMenuData(null);
//       }
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//       setMenuData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPrice = calculateTotalPrice() || 0;
//   const finalAmount = (
//     totalPrice * (persons > 0 ? persons : 1) * (weeks > 0 ? weeks : 1)
//   ).toFixed(2);

//   const handleMealPress = (day, meal) => {
//     const itemNames = getItemNames(day, meal);
//     if (itemNames.length > 0) {
//       setSelectedDay(day);
//       setSelectedMeal(meal);
//       setModalVisible(true);
//     } else {
//       navigateToCustomize(day, meal);
//     }
//   };

//   const handleReplace = () => {
//     removeItemsForDayMeal(selectedDay, selectedMeal);
//     setModalVisible(false);
//     navigateToCustomize(selectedDay, selectedMeal);
//   };

//   const navigateToCustomize = (day, meal) => {
//     if (meal === "Breakfast")
//       navigation.navigate("CustomizeBreakfast", { day, meal });
//     if (meal === "Lunch")
//       navigation.navigate("CustomizeLunch", { day, meal });
//     if (meal === "Dinner")
//       navigation.navigate("CustomizeDinner", { day, meal });
//   };

//   const handleProceedToAddress = () => {
//     if (persons <= 0 || weeks <= 0) {
//       Alert.alert(
//         "Missing Details",
//         "Please select the number of persons and weeks before proceeding."
//       );
//       return;
//     }

//     const buildMealData = (day) => ({
//       breakfast: getItemNames(day, "Breakfast"),
//       lunch: getItemNames(day, "Lunch"),
//       dinner: getItemNames(day, "Dinner"),
//     });

//     const payload = {
//       sunday: buildMealData("Sunday"),
//       monday: buildMealData("Monday"),
//       tuesday: buildMealData("Tuesday"),
//       wednesday: buildMealData("Wednesday"),
//       thursday: buildMealData("Thursday"),
//       friday: buildMealData("Friday"),
//       saturday: buildMealData("Saturday"),
//       total: finalAmount,
//       number_of_persons: persons,
//       number_of_weeks: weeks,
//     };

//     navigation.navigate("CustomizeSelectAddress", { menuPayload: payload });
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#165016" />
//         <Text style={{ color: "#165016", marginTop: 10, fontWeight: "600" }}>
//           Loading menu...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeContainer}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.customizemenuheaderContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color="#173b01" />
//           </TouchableOpacity>
//           <Text style={styles.customizemenuheaderTitle}>
//             Customize Weekly Menu
//           </Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Table */}
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.12 }}
//           showsVerticalScrollIndicator={false}
//         >
//           <View key={refreshKey} style={styles.table}>
//             <View style={[styles.row, styles.tableHeader]}>
//               <View style={[styles.cell, styles.dayHeader]}>
//                 <Text style={styles.customizemenuheaderText}>Days</Text>
//               </View>
//               {meals.map((meal) => (
//                 <View key={meal} style={styles.cell}>
//                   <Text style={styles.customizemenuheaderText}>{meal}</Text>
//                 </View>
//               ))}
//             </View>

//             {days.map((day, rowIndex) => {
//               const isGreenRow = rowIndex % 2 !== 0;
//               const dayKey = day.toLowerCase();
//               const fetchedDayData =
//                 menuData && menuData[dayKey] ? menuData[dayKey] : {};

//               return (
//                 <View
//                   key={day}
//                   style={[
//                     styles.row,
//                     { backgroundColor: isGreenRow ? "#e8f5e9" : "#fff" },
//                   ]}
//                 >
//                   <View style={styles.cell}>
//                     <Text style={styles.dayText}>{day}</Text>
//                   </View>

//                   {meals.map((meal) => {
//                     const itemNames = getItemNames(day, meal);
//                     const fetchedItem =
//                       fetchedDayData && fetchedDayData[meal.toLowerCase()]
//                         ? fetchedDayData[meal.toLowerCase()]
//                         : null;

//                     const displayText =
//                       itemNames.length > 0
//                         ? itemNames.join(", ")
//                         : fetchedItem
//                         ? fetchedItem
//                         : "Add";

//                     return (
//                       <View key={meal} style={styles.cell}>
//                         <TouchableOpacity
//                           onPress={() => handleMealPress(day, meal)}
//                           style={styles.addButton}
//                         >
//                           <Text
//                             style={[
//                               styles.addText,
//                               {
//                                 color:
//                                   displayText === "Add" ? "#006400" : "#173b01",
//                                 fontWeight:
//                                   displayText === "Add" ? "700" : "500",
//                               },
//                             ]}
//                           >
//                             {displayText}
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                     );
//                   })}
//                 </View>
//               );
//             })}
//           </View>

//           {/* Persons, Weeks, Total, Proceed Button */}
//           <View style={styles.counterContainer}>
//             <Counter
//               label="Persons"
//               value={persons}
//               setValue={setPersons}
//             />
//             <Counter label="Weeks" value={weeks} setValue={setWeeks} />
//           </View>

//           <View style={styles.priceContainer}>
//             <Text style={styles.priceLabel}>Total Price:</Text>
//             <Text style={styles.priceValue}>₹{finalAmount}</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.submitButton}
//             onPress={handleProceedToAddress}
//           >
//             <Text style={styles.submitText}>Proceed</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>

//       {/* Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>Menu Already Exists</Text>
//             <Text style={styles.modalMsg}>
//               Do you want to replace the menu for {selectedDay} - {selectedMeal}?
//             </Text>

//             <View style={styles.modalBtns}>
//               <TouchableOpacity onPress={handleReplace} style={styles.replaceBtn}>
//                 <Text style={styles.replaceText}>Replace</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setModalVisible(false)}
//                 style={styles.cancelBtn}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Footer />
//     </SafeAreaView>
//   );
// }

// /* =================== SUB COMPONENT =================== */
// const Counter = ({ label, value, setValue }) => (
//   <View style={styles.counterBox}>
//     <Text style={styles.counterLabel}>{label}</Text>
//     <View style={styles.counterRow}>
//       <TouchableOpacity
//         style={styles.counterBtn}
//         onPress={() => setValue((v) => (v > 0 ? v - 1 : 0))}
//       >
//         <Text style={styles.counterBtnText}>-</Text>
//       </TouchableOpacity>
//       <Text style={styles.counterValue}>{value}</Text>
//       <TouchableOpacity
//         style={styles.counterBtn}
//         onPress={() => setValue((v) => v + 1)}
//       >
//         <Text style={styles.counterBtnText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// /* =================== STYLES =================== */
// const styles = StyleSheet.create({
//   safeContainer: { flex: 1, backgroundColor: "#eaf7e9" },
//   container: { flex: 1, padding: width * 0.03 },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#eaf7e9",
//   },
//   customizemenuheaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: height * 0.015,
//     marginTop: height * 0.01,
//     justifyContent: "space-between",
//   },
//   customizemenuheaderTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: isTablet ? 24 : 18,
//     fontWeight: "700",
//     color: "#173b01",
//   },
//   table: {
//     width: "100%",
//     borderRadius: 10,
//     alignSelf: "center",
//     marginTop: 5,
//     backgroundColor: "#fff",
//     borderWidth: 2,
//     borderColor: "#ccc",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 6,
//   },
//   row: { flexDirection: "row", alignItems: "center" },
//   tableHeader: { backgroundColor: "#173b01" },
//   cell: {
//     flex: 1,
//     paddingVertical: height * 0.012,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRightWidth: 1,
//     borderColor: "#ccc",
//   },
//   customizemenuheaderText: {
//     fontSize: isTablet ? 16 : 12,
//     fontWeight: "700",
//     color: "#fff",
//   },
//   dayText: {
//     fontSize: isTablet ? 14 : 12,
//     fontWeight: "700",
//     color: "#333",
//   },
//   addText: { fontSize: isTablet ? 14 : 12, textAlign: "center" },
//   addButton: { paddingVertical: height * 0.005, paddingHorizontal: width * 0.02 },
//   counterContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: height * 0.02,
//     marginHorizontal: width * 0.02,
//   },
//   counterBox: {
//     backgroundColor: "#fff",
//     padding: width * 0.04,
//     borderRadius: 10,
//     elevation: 3,
//     flex: 1,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   counterLabel: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#173b01",
//     marginBottom: 5,
//   },
//   counterRow: { flexDirection: "row", alignItems: "center" },
//   counterBtn: {
//     backgroundColor: "#173b01",
//     borderRadius: 8,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   counterBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   counterValue: {
//     marginHorizontal: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#173b01",
//   },
//   priceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: height * 0.02,
//     marginHorizontal: width * 0.02,
//     backgroundColor: "#173b01",
//     padding: width * 0.04,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   priceLabel: { color: "#fff", fontSize: isTablet ? 18 : 15, fontWeight: "700" },
//   priceValue: { color: "#fff", fontSize: isTablet ? 18 : 15, fontWeight: "700" },
//   submitButton: {
//     backgroundColor: "#173b01",
//     borderRadius: 15,
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.08,
//     alignSelf: "flex-end",
//     marginTop: height * 0.02,
//     marginRight: width * 0.03,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 6,
//   },
//   submitText: { color: "#fff", fontSize: isTablet ? 18 : 15, fontWeight: "bold" },

//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   modalTitle: { fontSize: 18, fontWeight: "700", color: "#173b01" },
//   modalMsg: {
//     textAlign: "center",
//     marginTop: 10,
//     fontSize: 14,
//     color: "#333",
//   },
//   modalBtns: {
//     flexDirection: "row",
//     marginTop: 20,
//     width: "100%",
//     justifyContent: "space-around",
//   },
//   replaceBtn: {
//     backgroundColor: "#173b01",
//     paddingVertical: 10,
//     borderRadius: 8,
//     flex: 1,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   replaceText: { color: "#fff", fontWeight: "600" },
//   cancelBtn: {
//     backgroundColor: "#ccc",
//     paddingVertical: 10,
//     borderRadius: 8,
//     flex: 1,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   cancelText: { color: "#333", fontWeight: "600" },
// });







import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { MenuContext } from "../../Pages/CustomizeMenu/MenuContext";
import Footer from "../../Components/Footer/Footer";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const meals = ["Breakfast", "Lunch", "Dinner"];

export default function CustomizeMenuScreen({ navigation }) {
  const route = useRoute();
  const { menuDetails } = route.params || {}; // from reorder if any

  const {
    getItemNames,
    removeItemsForDayMeal,
    calculateTotalPrice,
    setMenuDataFromReorder,
  } = useContext(MenuContext);

  const [refreshKey, setRefreshKey] = useState(0);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");

  /** 🔁 If Reorder Detected */
  useEffect(() => {
    if (menuDetails?.isReorder) {
      console.log("🌀 Reorder Detected:", menuDetails);
      setPersons(menuDetails.number_of_persons || 1);
      setWeeks(menuDetails.number_of_weeks || 1);
      setMenuDataFromReorder(menuDetails);
      setLoading(false);
    }
  }, [menuDetails]);

  /** 🔁 Regular Load */
  useFocusEffect(
    useCallback(() => {
      if (!menuDetails?.isReorder) {
        setRefreshKey((prev) => prev + 1);
        fetchMenuData();
      }
    }, [])
  );

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please log in again.");
        navigation.replace("Login");
        return;
      }

      const response = await fetch(
        "https://kvk-backend.onrender.com/api/customizemenu",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && Array.isArray(data) && data.length > 0) {
        setMenuData(data[0]);
      } else {
        setMenuData(null);
      }
    } catch (error) {
      console.error("❌ Error fetching menu data:", error);
      setMenuData(null);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotalPrice() || 0;
  const finalAmount = (
    totalPrice * (persons > 0 ? persons : 1) * (weeks > 0 ? weeks : 1)
  ).toFixed(2);

  const handleMealPress = (day, meal) => {
    const itemNames = getItemNames(day, meal);
    if (itemNames.length > 0) {
      setSelectedDay(day);
      setSelectedMeal(meal);
      setModalVisible(true);
    } else {
      navigateToCustomize(day, meal);
    }
  };

  const handleReplace = () => {
    removeItemsForDayMeal(selectedDay, selectedMeal);
    setModalVisible(false);
    navigateToCustomize(selectedDay, selectedMeal);
  };

  const navigateToCustomize = (day, meal) => {
    if (meal === "Breakfast")
      navigation.navigate("CustomizeBreakfast", { day, meal });
    if (meal === "Lunch")
      navigation.navigate("CustomizeLunch", { day, meal });
    if (meal === "Dinner")
      navigation.navigate("CustomizeDinner", { day, meal });
  };

  /** ✅ Proceed to Select Address */
  const handleProceedToAddress = () => {
    if (persons <= 0 || weeks <= 0) {
      Alert.alert("Missing Details", "Please select persons and weeks first.");
      return;
    }

    const buildMealData = (day) => ({
      breakfast: getItemNames(day, "Breakfast"),
      lunch: getItemNames(day, "Lunch"),
      dinner: getItemNames(day, "Dinner"),
    });

    const payload = {
      sunday: buildMealData("Sunday"),
      monday: buildMealData("Monday"),
      tuesday: buildMealData("Tuesday"),
      wednesday: buildMealData("Wednesday"),
      thursday: buildMealData("Thursday"),
      friday: buildMealData("Friday"),
      saturday: buildMealData("Saturday"),
      total: finalAmount,
      number_of_persons: persons,
      number_of_weeks: weeks,
      isReorder: menuDetails?.isReorder || false,
    };

    console.log("➡️ Proceeding to address with payload:", payload);

    navigation.navigate("CustomizeSelectAddress", { menuPayload: payload });
  };

  /** Loading */
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#165016" />
        <Text style={{ color: "#165016", marginTop: 10, fontWeight: "600" }}>
          Loading menu...
        </Text>
      </SafeAreaView>
    );
  }

  /** UI */
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.customizemenuheaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#173b01" />
          </TouchableOpacity>
          <Text style={styles.customizemenuheaderTitle}>
            Customize Weekly Menu
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Table */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.12 }}
          showsVerticalScrollIndicator={false}
        >
          <View key={refreshKey} style={styles.table}>
            <View style={[styles.row, styles.tableHeader]}>
              <View style={[styles.cell, styles.dayHeader]}>
                <Text style={styles.customizemenuheaderText}>Days</Text>
              </View>
              {meals.map((meal) => (
                <View key={meal} style={styles.cell}>
                  <Text style={styles.customizemenuheaderText}>{meal}</Text>
                </View>
              ))}
            </View>

            {days.map((day, rowIndex) => {
              const isGreenRow = rowIndex % 2 !== 0;
              const dayKey = day.toLowerCase();
              const fetchedDayData =
                menuData && menuData[dayKey] ? menuData[dayKey] : {};

              return (
                <View
                  key={day}
                  style={[
                    styles.row,
                    { backgroundColor: isGreenRow ? "#e8f5e9" : "#fff" },
                  ]}
                >
                  <View style={styles.cell}>
                    <Text style={styles.dayText}>{day}</Text>
                  </View>

                  {meals.map((meal) => {
                    const itemNames = getItemNames(day, meal);
                    const fetchedItem =
                      fetchedDayData && fetchedDayData[meal.toLowerCase()]
                        ? fetchedDayData[meal.toLowerCase()]
                        : null;

                    const displayText =
                      itemNames.length > 0
                        ? itemNames.join(", ")
                        : fetchedItem
                        ? fetchedItem
                        : "Add";

                    return (
                      <View key={meal} style={styles.cell}>
                        <TouchableOpacity
                          onPress={() => handleMealPress(day, meal)}
                          style={styles.addButton}
                        >
                          <Text
                            style={[
                              styles.addText,
                              {
                                color:
                                  displayText === "Add" ? "#006400" : "#173b01",
                                fontWeight:
                                  displayText === "Add" ? "700" : "500",
                              },
                            ]}
                          >
                            {displayText}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* Persons, Weeks, Total, Proceed */}
          <View style={styles.counterContainer}>
            <Counter label="Persons" value={persons} setValue={setPersons} />
            <Counter label="Weeks" value={weeks} setValue={setWeeks} />
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Price:</Text>
            <Text style={styles.priceValue}>₹{finalAmount}</Text>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleProceedToAddress}
          >
            <Text style={styles.submitText}>Proceed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Replace Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Menu Already Exists</Text>
            <Text style={styles.modalMsg}>
              Replace menu for {selectedDay} - {selectedMeal}?
            </Text>

            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={handleReplace} style={styles.replaceBtn}>
                <Text style={styles.replaceText}>Replace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

/** ---------- COUNTER COMPONENT ---------- */
const Counter = ({ label, value, setValue }) => (
  <View style={styles.counterBox}>
    <Text style={styles.counterLabel}>{label}</Text>
    <View style={styles.counterRow}>
      <TouchableOpacity
        style={styles.counterBtn}
        onPress={() => setValue((v) => (v > 0 ? v - 1 : 0))}
      >
        <Text style={styles.counterBtnText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity
        style={styles.counterBtn}
        onPress={() => setValue((v) => v + 1)}
      >
        <Text style={styles.counterBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

/** ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#eaf7e9" },
  container: { flex: 1, padding: width * 0.03 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf7e9",
  },
  customizemenuheaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
    marginTop: height * 0.01,
    justifyContent: "space-between",
  },
  customizemenuheaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: isTablet ? 24 : 18,
    fontWeight: "700",
    color: "#173b01",
  },
  table: {
    width: "100%",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ccc",
    elevation: 6,
  },
  row: { flexDirection: "row", alignItems: "center" },
  tableHeader: { backgroundColor: "#173b01" },
  cell: {
    flex: 1,
    paddingVertical: height * 0.012,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  customizemenuheaderText: {
    fontSize: isTablet ? 16 : 12,
    fontWeight: "700",
    color: "#fff",
  },
  dayText: { fontSize: isTablet ? 14 : 12, fontWeight: "700", color: "#333" },
  addText: { fontSize: isTablet ? 14 : 12, textAlign: "center" },
  addButton: { paddingVertical: height * 0.005, paddingHorizontal: width * 0.02 },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02,
    marginHorizontal: width * 0.02,
  },
  counterBox: {
    backgroundColor: "#fff",
    padding: width * 0.04,
    borderRadius: 10,
    elevation: 3,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  counterLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#173b01",
    marginBottom: 5,
  },
  counterRow: { flexDirection: "row", alignItems: "center" },
  counterBtn: {
    backgroundColor: "#173b01",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  counterBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  counterValue: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#173b01",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02,
    marginHorizontal: width * 0.02,
    backgroundColor: "#173b01",
    padding: width * 0.04,
    borderRadius: 10,
    elevation: 5,
  },
  priceLabel: { color: "#fff", fontSize: isTablet ? 18 : 15, fontWeight: "700" },
  priceValue: { color: "#fff", fontSize: isTablet ? 18 : 15, fontWeight: "700" },
  submitButton: {
    backgroundColor: "#173b01",
    borderRadius: 15,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    alignSelf: "flex-end",
    marginTop: height * 0.02,
    marginRight: width * 0.03,
    elevation: 6,
  },
  submitText: { color: "#fff", fontSize: isTablet ? 18 : 15, fontWeight: "bold" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#173b01" },
  modalMsg: { textAlign: "center", marginTop: 10, fontSize: 14, color: "#333" },
  modalBtns: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around",
  },
  replaceBtn: {
    backgroundColor: "#173b01",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  replaceText: { color: "#fff", fontWeight: "600" },
  cancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelText: { color: "#333", fontWeight: "600" },
});
