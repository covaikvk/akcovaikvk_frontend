import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../Components/Footer/Footer";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobile, tablet) => (isTablet ? tablet : mobile);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://kvk-backend.onrender.com/api/orders");
        setOrders(res.data || []);
      } catch (error) {
        console.log("Error fetching orders:", error);
        Alert.alert("Error", "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Corrected — added backticks for string interpolation
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`https://kvk-backend.onrender.com/api/orders/${orderId}`, {
        order_status: status,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: status } : o
        )
      );
    } catch (err) {
      console.log("Error updating order:", err);
      Alert.alert("Failed", "Could not update order status.");
    }
  };

  // ✅ Corrected — added backticks for string interpolation
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await axios.put(`https://kvk-backend.onrender.com/api/orders/${orderId}`, {
        payment_status: paymentStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, payment_status: paymentStatus } : o
        )
      );
    } catch (err) {
      console.log("Error updating payment:", err);
      Alert.alert("Failed", "Could not update payment status.");
    }
  };

  const handleConfirmOrder = (orderId) => {
    updateOrderStatus(orderId, "Confirmed");
  };

  const handleMarkPaid = (orderId) => {
    updatePaymentStatus(orderId, "Paid");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007A33" />
        <Text style={{ color: "#007A33", marginTop: 8 }}>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F3FDF1" }}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={r(24, 30)} color="#007A33" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Orders</Text>
        <View style={{ width: r(24, 30) }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
            No orders found.
          </Text>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <Ionicons name="person" size={r(22, 28)} color="#007A33" />
                  <Text style={styles.userName}>{order.name || "Unknown"}</Text>
                </View>
                <View style={styles.orderId}>
                  <Text style={styles.orderIdText}>#{order.id}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call" size={r(18, 22)} color="#444" />
                <Text style={styles.infoText}>{order.phone_number}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location" size={r(18, 22)} color="#444" />
                <Text style={styles.infoText}>
                  {order.address_1}, {order.address_2}, {order.city}, {order.state}{" "}
                  {order.pincode}
                </Text>
              </View>

              <Text style={styles.itemsTitle}>Items</Text>
              <View style={styles.itemBox}>
                {order.items?.map((item, i) => (
                  <Text key={i} style={styles.itemText}>
                    {item.name} × {item.quantity} — ₹{item.price}
                  </Text>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Order:</Text>
                <Text
                  style={
                    order.order_status === "Confirmed"
                      ? styles.statusConfirmed
                      : styles.statusPending
                  }
                >
                  {order.order_status}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Payment:</Text>
                <Text
                  style={
                    order.payment_status === "Paid"
                      ? styles.statusPaid
                      : styles.statusPending
                  }
                >
                  {order.payment_status}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.total}>₹{order.total_amount}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    order.order_status === "Confirmed" && {
                      backgroundColor: "#A3E49A",
                    },
                  ]}
                  onPress={() => handleConfirmOrder(order.id)}
                  disabled={order.order_status === "Confirmed"}
                >
                  <Text style={styles.btnText}>
                    {order.order_status === "Confirmed"
                      ? "Confirmed ✅"
                      : "Confirm Order"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paidBtn,
                    order.payment_status === "Paid" && {
                      backgroundColor: "#BFA8F5",
                    },
                  ]}
                  onPress={() => handleMarkPaid(order.id)}
                  disabled={order.payment_status === "Paid"}
                >
                  <Text style={styles.btnText}>
                    {order.payment_status === "Paid" ? "Paid 💰" : "Mark Paid"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FDF1",
    padding: r(16, 24),
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: r(16, 24),
    paddingVertical: 12,
    backgroundColor: "#EAFCE6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDEFD8",
  },
  topHeaderTitle: {
    fontSize: r(20, 26),
    fontWeight: "700",
    color: "#007A33",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3FDF1",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: r(16, 24),
    padding: r(16, 24),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: r(20, 30),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: r(8, 12),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: r(18, 22),
    fontWeight: "600",
    color: "#000",
  },
  orderId: {
    backgroundColor: "#EAFCE6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  orderIdText: {
    color: "#007A33",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  infoText: {
    fontSize: r(14, 18),
    color: "#444",
    flexShrink: 1,
  },
  itemsTitle: {
    marginTop: 14,
    fontWeight: "700",
    color: "#005A1C",
    fontSize: r(16, 20),
  },
  itemBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  itemText: {
    color: "#000",
    fontSize: r(14, 18),
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: r(15, 19),
    fontWeight: "500",
    color: "#000",
  },
  statusConfirmed: {
    backgroundColor: "#C6EAAF",
    color: "#007A33",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
  statusPending: {
    backgroundColor: "#FFD7B5",
    color: "#A85A00",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
  statusPaid: {
    backgroundColor: "#D3F5E1",
    color: "#007A33",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
  total: {
    fontSize: r(16, 20),
    fontWeight: "700",
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#52C46B",
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  paidBtn: {
    flex: 1,
    backgroundColor: "#C8A5FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: r(15, 19),
  },
});

export default Orders;
