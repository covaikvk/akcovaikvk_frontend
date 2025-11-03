// RegularMenu.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const RegularMenu = () => {
  const navigation = useNavigation();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch menu data from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(
          "https://kvk-backend.onrender.com/api/regularmenu/menuwithlist"
        );
        if (!res.ok) throw new Error("Failed to fetch menus");
        const data = await res.json();

        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];

        const formattedMenus = data.map((menu) => {
          const menuData = days.map((day) => {
            const items = menu.tablelist?.[day]?.items || ["Closed"];
            return {
              day: day.charAt(0).toUpperCase() + day.slice(1),
              breakfast: items[0] || "-",
              lunch: items[1] || "-",
              dinner: items[2] || "-",
            };
          });

          const baseAmount = menu.tablelist?.days_and_price?.[0]?.price || 0;

          return {
            menu_id: menu.menu_id,
            title: menu.packagename || "Menu",
            price: `₹${baseAmount}`,
            amount: baseAmount,
            color: "#D5F0C1",
            data: menuData,
            payload: menu,
            persons: 1,
            weeks: 1,
          };
        });

        setMenus(formattedMenus);
      } catch (err) {
        console.error("Fetch error:", err);
        Alert.alert("Error", "Unable to fetch menu data");
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // ✅ Update number of persons or weeks
  const updateMenuField = (menuId, field, value) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.menu_id === menuId ? { ...menu, [field]: value } : menu
      )
    );
  };

// ✅ Proceed button handler
const handleProceed = (menu) => {
  const planPrice = Number(menu.amount); // base price of the selected plan
  const totalAmount = planPrice * menu.persons * menu.weeks;

  navigation.navigate("RegularMenuAddress", {
    menuDetails: {
      ...menu,
      numPersons: menu.persons,
      numWeeks: menu.weeks,
      plan_price: planPrice,
      total_amount: totalAmount,
    },
  });
};




  // ✅ Loading indicator
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#173b01" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.regularmenuContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={isTablet ? 28 : 22} color="#173b01" />
        </TouchableOpacity>
        <Text style={styles.regularmenuTitle}>Regular Menu</Text>
        <View style={{ width: isTablet ? 28 : 22 }} />
      </View>

      {/* Scrollable Menu List */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {menus.length > 0 ? (
          menus.map((menu, index) => {
            const totalAmount = menu.amount * menu.persons * menu.weeks;

            return (
              <View
                key={index}
                style={[styles.tableContainer, { backgroundColor: menu.color }]}
              >
                {/* Menu Header */}
                <View style={styles.menuregularmenu}>
                  <Text style={styles.title}>{menu.title}</Text>
                  <Text style={styles.priceTag}>Base: ₹{menu.amount}</Text>
                </View>

                {/* Table Header */}
                <View style={[styles.row, styles.regularmenuRow]}>
                  <Text style={[styles.cell, styles.dayregularmenu]}>Day</Text>
                  <Text style={[styles.cell, styles.mealregularmenu]}>Breakfast</Text>
                  <Text style={[styles.cell, styles.mealregularmenu]}>Lunch</Text>
                  <Text style={[styles.cell, styles.mealregularmenu]}>Dinner</Text>
                </View>

                {/* Table Data */}
                {menu.data.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.row,
                      idx % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    <Text style={[styles.cell, styles.dayCell]}>{item.day}</Text>
                    <Text style={[styles.cell, styles.mealCell]}>
                      {item.breakfast}
                    </Text>
                    <Text style={[styles.cell, styles.mealCell]}>
                      {item.lunch}
                    </Text>
                    <Text style={[styles.cell, styles.mealCell]}>
                      {item.dinner}
                    </Text>
                  </View>
                ))}

                {/* Counters */}
                <View style={styles.quantityContainer}>
                  {/* Persons Counter */}
                  <View style={styles.counterGroup}>
                    <Text style={styles.counterLabel}>No. of Persons</Text>
                    <View style={styles.counterButtons}>
                      <TouchableOpacity
                        onPress={() =>
                          updateMenuField(
                            menu.menu_id,
                            "persons",
                            Math.max(1, menu.persons - 1)
                          )
                        }
                        style={styles.counterBtn}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{menu.persons}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateMenuField(menu.menu_id, "persons", menu.persons + 1)
                        }
                        style={styles.counterBtn}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Weeks Counter */}
                  <View style={styles.counterGroup}>
                    <Text style={styles.counterLabel}>No. of Weeks</Text>
                    <View style={styles.counterButtons}>
                      <TouchableOpacity
                        onPress={() =>
                          updateMenuField(
                            menu.menu_id,
                            "weeks",
                            Math.max(1, menu.weeks - 1)
                          )
                        }
                        style={styles.counterBtn}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{menu.weeks}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateMenuField(menu.menu_id, "weeks", menu.weeks + 1)
                        }
                        style={styles.counterBtn}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Total + Proceed Button */}
                <View style={styles.footerRow}>
                  <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
                  <TouchableOpacity
                    style={styles.orderButton}
                    onPress={() => handleProceed(menu)}
                  >
                    <Text style={styles.orderButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No menus available
          </Text>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f7ffed" },
  regularmenuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  regularmenuTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    color: "#173b01",
  },
  scrollContainer: { marginTop: 5 },
  contentContainer: { padding: 12, paddingBottom: 80 },
  tableContainer: {
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
  },
  menuregularmenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontWeight: "bold", fontSize: isTablet ? 20 : 16, color: "#173b01" },
  priceTag: {
    backgroundColor: "#173b01",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 13,
  },
  row: { flexDirection: "row", borderWidth: 1, borderColor: "#c6e2b3" },
  regularmenuRow: { backgroundColor: "#173b01" },
  evenRow: { backgroundColor: "#fff" },
  oddRow: { backgroundColor: "#edf8e4" },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#c6e2b3",
    fontSize: isTablet ? 14 : 11,
  },
  dayregularmenu: { color: "#fff", fontWeight: "bold" },
  mealregularmenu: { color: "#fff", fontWeight: "bold" },
  dayCell: { fontWeight: "bold", color: "#173b01" },
  mealCell: { color: "#333" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Counter styles
  quantityContainer: {
    backgroundColor: "#e9f8d4",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  counterGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  counterLabel: {
    fontSize: isTablet ? 18 : 14,
    color: "#173b01",
    fontWeight: "600",
  },
  counterButtons: { flexDirection: "row", alignItems: "center" },
  counterBtn: {
    backgroundColor: "#173b01",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterBtnText: { color: "#fff", fontSize: isTablet ? 20 : 16 },
  counterValue: {
    marginHorizontal: 10,
    fontSize: isTablet ? 18 : 14,
    fontWeight: "bold",
  },

  // Footer (total + button)
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  totalText: {
    fontSize: isTablet ? 18 : 20,
    fontWeight: "bold",
    color: "#173b01",
  },
  orderButton: {
    backgroundColor: "#173b01",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  orderButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default RegularMenu;
