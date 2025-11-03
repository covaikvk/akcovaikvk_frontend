import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function Myorder() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [regularOrders, setRegularOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [reordering, setReordering] = useState(null);

  // ✅ Fetch normal product orders
  const fetchOrders = async (token) => {
    try {
      const response = await fetch(
        "https://kvk-backend.onrender.com/api/orders/myorders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Failed (${response.status})`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders");
    }
  };

  // ✅ Fetch regular menu orders
  const fetchRegularMenuOrders = async (userId) => {
    try {
      const response = await fetch(
        `https://kvk-backend.onrender.com/api/regularmenuorder/user/${userId}`
      );
      if (!response.ok) return;
      const data = await response.json();
      setRegularOrders(data);
    } catch (error) {
      console.error("❌ Error fetching regular menu orders:", error);
    }
  };

  // ✅ Fetch custom menu orders - WITH AUTHENTICATION
  const fetchCustomMenuOrders = async (userId, token) => {
    try {
      const response = await fetch(
        `https://kvk-backend.onrender.com/api/customizemenu/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        console.log(`❌ Custom menu API response not OK: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      console.log("✅ Custom Menu Orders:", data);
      setCustomOrders(data);
    } catch (error) {
      console.error("❌ Error fetching custom menu orders:", error);
    }
  };

  // ✅ Fetch all user-related data
  const fetchUserDetails = async () => {
    try {
      const user = await AsyncStorage.getItem("userDetails");
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        navigation.navigate("Login");
        return;
      }

      if (user) {
        const parsedUser = JSON.parse(user);
        setUserDetails(parsedUser);
        await Promise.all([
          fetchOrders(token),
          fetchRegularMenuOrders(parsedUser.id),
          fetchCustomMenuOrders(parsedUser.id, token), // Pass token here
        ]);
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const fullDate = `${day} ${month} ${year}`;
    return { day, month, year, fullDate };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return '#4CAF50'; // Green
      case 'pending':
        return '#FF9800'; // Orange
      case 'cancelled':
      case 'failed':
        return '#F44336'; // Red
      case 'processing':
        return '#2196F3'; // Blue
      default:
        return '#757575'; // Gray
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return '#4CAF50'; // Green
      case 'pending':
        return '#FF9800'; // Orange
      case 'failed':
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  };

 const handleReorderNormal = async (order) => {
  try {
    setReordering(order.id);

    const user = await AsyncStorage.getItem("userDetails");
    const parsedUser = JSON.parse(user);

    if (!parsedUser) {
      Alert.alert("Error", "Session expired. Please log in again.");
      navigation.navigate("Login");
      return;
    }

    // ✅ Safely extract items array
    const safeItems = Array.isArray(order.items) ? order.items : [];

    const reorderPayload = {
      user_id: parsedUser.id,
      address_id: order.address_id,
      name: order.name,
      phone_number: order.phone_number,
      payment_method: order.payment_method || "Cash On Delivery",
      payment_status: "Pending",
      instructions: order.instructions || "",
      items: safeItems.map((item) => ({
        product_id: item.product_id || null,
        name: item.name || "Unknown Product",
        price: parseFloat(item.price || 0),
        quantity: item.quantity || 1,
      })),
      total_amount: order.total_amount || 0,
      isReorder: true,
    };

    console.log("🛒 Safe reorder payload:", reorderPayload);

    navigation.navigate("SelectAddress", {
      reorder: true,
      orderData: reorderPayload,
    });
  } catch (error) {
    console.error("❌ Reorder error:", error);
    Alert.alert("Error", "Failed to reorder this product. Please try again.");
  } finally {
    setReordering(null);
  }
};

const handleReorderRegularMenu = async (order) => {
  try {
    setReordering(order.id);

    const user = await AsyncStorage.getItem("userDetails");
    const parsedUser = JSON.parse(user);

    if (!parsedUser) {
      Alert.alert("Error", "Session expired. Please log in again.");
      navigation.navigate("Login");
      return;
    }

    const reorderPayload = {
      user_id: parsedUser.id,
      name: order.name,
      phone_number: order.phone_number,
      address_1: order.address_1,
      address_2: order.address_2,
      landmark: order.landmark,
      pincode: order.pincode,
      city: order.city,
      state: order.state,

      numberOfPerson: order.numberOfPerson,
      numberOfWeeks: order.numberOfWeeks,
      regularmenuname: order.regularmenuname,
      plan_price: order.plan_price,
      total_amount: order.total_amount,

      payment_status: "pending",
      order_status: "pending",
      isReorder: true
    };

    console.log("🔥 Regular Reorder Payload:", reorderPayload);

    // ✅ Navigate to actual Regular Menu screen
    navigation.navigate("RegularMenu", {
      reorder: true,
      orderData: reorderPayload,
    });

  } catch (error) {
    console.error("❌ Regular Menu Reorder Error:", error);
    Alert.alert("Error", "Failed to reorder regular plan. Try again.");
  } finally {
    setReordering(null);
  }
};




  // ✅ Handle Reorder for Custom Menu Orders
  const handleReorderCustomMenu = async (order) => {
    setReordering(order.id);
    try {
      // Navigate to custom menu page with order details
      navigation.navigate("CustomizeMenu", { 
        reorderData: {
          persons: order.number_of_persons,
          weeks: order.number_of_weeks,
          address1: order.address_1,
          address2: order.address_2,
          foodType: order.foodType // if available in your API
        }
      });
      Alert.alert("Reorder", "Redirecting to custom menu");
    } catch (error) {
      console.error("Reorder error:", error);
      Alert.alert("Error", "Failed to reorder");
    } finally {
      setReordering(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1E3A08" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={r(32, 48)} color="#1E3A08" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: r(100, 150) }}>
        {/* ================= NORMAL ORDERS ================= */}
        <Text style={styles.sectionTitle}>Regular Product Orders</Text>
        {orders.length > 0 ? (
          orders.map((order) => {
            const { day, month } = formatDate(order.created_at);
            const itemsText = order.items
              .map((item) =>
                item.name
                  ? `${item.name} x${item.quantity}`
                  : `ProductID:${item.product_id} x${item.quantity}`
              )
              .join(", ");
            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.row}>
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>{day}</Text>
                      <Text style={styles.yearText}>{month}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{order.name}</Text>
                      <Text style={styles.items}>{itemsText}</Text>
                    </View>
                  </View>
                  {/* Small Reorder Button - Top Right */}
                 <TouchableOpacity
  style={styles.smallReorderButton}
  onPress={() => handleReorderNormal(order)}
  disabled={reordering === order.id}
>
  {reordering === order.id ? (
    <ActivityIndicator size="small" color="#1E3A08" />
  ) : (
    <Text style={styles.reorderButtonText}>Reorder</Text>
  )}
</TouchableOpacity>

                </View>
                <View style={styles.divider} />
                <View style={styles.footerRow}>
                  <Text style={styles.total}>Total: ₹{order.total_amount}</Text>
                  <Text
                    style={[
                      styles.status,
                      { color: getStatusColor(order.order_status) }
                    ]}
                  >
                    {order.order_status}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No normal orders found</Text>
        )}

      {/* ================= REGULAR MENU ORDERS ================= */}
<Text style={[styles.sectionTitle, { marginTop: 25 }]}>Regular Menu Orders</Text>
{regularOrders.length > 0 ? (
  regularOrders.map((order) => {
    const { day, month, year, fullDate } = formatDate(order.created_at);
    return (
      <View key={order.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{day}</Text>
              <Text style={styles.yearText}>{month}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.regularTitle}>{order.name}</Text>
              <Text style={styles.regularSubTitle}>{order.regularmenuname}</Text>
              <Text style={styles.items}>
                👥 {order.numberOfPerson} Person(s) × 🗓 {order.numberOfWeeks} Week(s)
              </Text>
              <Text style={styles.items}>🏠 {order.address_1}</Text>
            </View>
          </View>

          {/* Reorder Button */}
          <TouchableOpacity 
            style={styles.smallReorderButton}
            onPress={() => handleReorderRegularMenu(order)}
            disabled={reordering === order.id}
          >
            {reordering === order.id ? (
              <ActivityIndicator size="small" color="#1E3A08" />
            ) : (
              <Text style={styles.reorderButtonText}>Reorder</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.total}>
            Plan ₹{order.plan_price} | Total ₹{order.total_amount}
          </Text>
          <Text
            style={[
              styles.status,
              { color: getStatusColor(order.order_status) }
            ]}
          >
            {order.order_status}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.paymentText, { color: getPaymentStatusColor(order.payment_status) }]}>
            💳 Payment: {order.payment_status}
          </Text>
        </View>

        <Text style={styles.dateFooter}>📅 Ordered on: {fullDate}</Text>
      </View>
    );
  })
) : (
  <Text style={styles.noDataText}>No regular menu orders found</Text>
)}

       {/* ================= CUSTOM MENU ORDERS ================= */}
<Text style={[styles.sectionTitle, { marginTop: 25 }]}>
  Customized Menu Orders
</Text>

{customOrders.length > 0 ? (
  customOrders.map((order) => {
    const { day, month, year, fullDate } = formatDate(order.created_at);

    const handleReorderCustomMenu = (order) => {
      try {
        const menuPayload = {
          ...order,
          numPersons: order.number_of_persons,
          numWeeks: order.number_of_weeks,
          totalAmount: parseFloat(order.total),
          gst: parseFloat(order.gst),
          grandTotal: parseFloat(order.grand_total),
          isReorder: true, // Flag to identify reorder
        };

        console.log("🔁 Reordering custom menu:", menuPayload);

        navigation.navigate("CustomizeMenuScreen", {
          menuDetails: menuPayload,
        });
      } catch (error) {
        console.error("❌ Error while reordering:", error);
        Alert.alert("Error", "Unable to process reorder. Please try again.");
      }
    };

    return (
      <View key={order.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{day}</Text>
              <Text style={styles.yearText}>{month}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.regularTitle}>{order.name}</Text>

              {/* Order Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.detailItem}>
                  👥 <Text style={styles.detailLabel}>Persons:</Text>{" "}
                  {order.number_of_persons}
                </Text>
                <Text style={styles.detailItem}>
                  🗓 <Text style={styles.detailLabel}>Weeks:</Text>{" "}
                  {order.number_of_weeks}
                </Text>
              </View>

              {/* Address */}
              <View style={styles.addressContainer}>
                <Text style={styles.detailItem}>
                  🏠 <Text style={styles.detailLabel}>Address:</Text>{" "}
                  {order.address_1}
                  {order.address_2 ? `, ${order.address_2}` : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* Small Reorder Button - Top Right */}
          <TouchableOpacity
            style={styles.smallReorderButton}
            onPress={() => handleReorderCustomMenu(order)}
            disabled={reordering === order.id}
          >
            {reordering === order.id ? (
              <ActivityIndicator size="small" color="#1E3A08" />
            ) : (
              <Text style={styles.reorderButtonText}>Reorder</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Total Amount */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>Total: ₹{order.total}</Text>
        </View>

        <View style={styles.divider} />

        {/* Status and Date */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Order Status:</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: getStatusColor(order.order_status) },
                ]}
              >
                {order.order_status}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Payment:</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: getPaymentStatusColor(order.payment_status) },
                ]}
              >
                {order.payment_status}
              </Text>
            </View>
          </View>

          <Text style={styles.orderDate}>📅 Order placed on: {fullDate}</Text>
        </View>
      </View>
    );
  })
) : (
  <Text style={styles.noDataText}>No customized menu orders found</Text>
)}

      </ScrollView>

      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FFE9",
    paddingTop: r(40, 60),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: r(16, 30),
    marginBottom: r(25, 40),
  },
  backBtn: { 
    marginRight: r(10, 20) 
  },
  headerText: {
    fontSize: r(32, 48),
    fontWeight: "bold",
    color: "#1E3A08",
    flex: 1,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#E2F5D3",
    borderRadius: r(16, 24),
    padding: r(20, 30),
    marginHorizontal: r(18, 36),
    marginBottom: r(18, 28),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: r(6, 8),
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  row: { 
    flexDirection: "row", 
    alignItems: "flex-start",
    flex: 1,
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: r(14, 22),
    backgroundColor: "#1E3A08",
    borderRadius: r(10, 16),
    paddingVertical: r(10, 14),
    paddingHorizontal: r(8, 12),
    width: r(70, 100),
  },
  dateText: { 
    fontSize: r(20, 28), 
    fontWeight: "bold", 
    color: "white" 
  },
  yearText: { 
    fontSize: r(14, 18), 
    color: "white", 
    opacity: 0.9 
  },
  title: { 
    fontSize: r(20, 28), 
    fontWeight: "bold", 
    color: "#1E3A08" 
  },
  items: { 
    fontSize: r(15, 20), 
    color: "#2F4F1F", 
    marginVertical: r(6, 10) 
  },
  divider: { 
    borderBottomWidth: 1.5, 
    borderBottomColor: "#A5C98A", 
    marginVertical: r(10, 14) 
  },
  footerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  total: { 
    fontSize: r(16, 20), 
    fontWeight: "bold", 
    color: "#1E3A08" 
  },
  status: { 
    fontSize: r(16, 20), 
    fontWeight: "600", 
    textTransform: "capitalize" 
  },
  sectionTitle: {
    fontSize: r(22, 30),
    fontWeight: "bold",
    color: "#1E3A08",
    marginHorizontal: r(22, 36),
    marginBottom: r(10, 16),
    textDecorationLine: "underline",
    textDecorationColor: "#A5C98A",
  },
  regularTitle: { 
    fontSize: r(20, 28), 
    fontWeight: "bold", 
    color: "#1E3A08" 
  },
  regularSubTitle: {
    fontSize: r(17, 22),
    fontWeight: "600",
    color: "#2E5D10",
    backgroundColor: "#C4E6A1",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  paymentText: { 
    fontSize: r(14, 18), 
    color: "#555", 
    marginTop: 6, 
    fontStyle: "italic" 
  },
  dateFooter: { 
    fontSize: r(13, 17), 
    color: "#444", 
    marginTop: 4, 
    opacity: 0.8 
  },
  noDataText: { 
    textAlign: "center", 
    color: "#666", 
    fontSize: r(16, 22), 
    marginTop: 10 
  },
  
  // Custom Menu Order Styles
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: r(8, 12),
  },
  detailItem: {
    fontSize: r(14, 18),
    color: "#2F4F1F",
    marginRight: r(16, 24),
    marginBottom: r(4, 6),
  },
  detailLabel: {
    fontWeight: '600',
    color: "#1E3A08",
  },
  addressContainer: {
    marginBottom: r(8, 12),
  },
  totalContainer: {
    alignItems: 'center',
    marginVertical: r(8, 12),
  },
  totalAmount: {
    fontSize: r(18, 24),
    fontWeight: 'bold',
    color: "#1E3A08",
  },
  statusContainer: {
    marginTop: r(8, 12),
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: r(8, 12),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: r(14, 18),
    color: "#2F4F1F",
    marginRight: 4,
  },
  statusValue: {
    fontSize: r(14, 18),
    fontWeight: '600',
  },
  orderDate: {
    fontSize: r(13, 17),
    color: "#444",
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },

  // Small Reorder Button Styles with Text
  smallReorderButton: {
    backgroundColor: "#C4E6A1",
    paddingVertical: r(6, 8),
    paddingHorizontal: r(10, 14),
    borderRadius: r(8, 12),
    borderWidth: 1.5,
    borderColor: "#1E3A08",
    marginLeft: r(8, 12),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: r(3, 4),
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderButtonText: {
    fontSize: r(12, 14),
    fontWeight: "600",
    color: "#1E3A08",
  },

  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});