// CustomizeOrder.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../Components/Footer/Footer";
import { scale } from "react-native-size-matters";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobile, tablet) => (isTablet ? tablet : mobile);

const CustomizeOrder = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://kvk-backend.onrender.com/api/customizemenu"
        );
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load weekly orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getCardWidth = () => {
    if (width < 400) return "100%";
    if (width < 768) return "47%";
    return "31%";
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007A33" />
        <Text style={styles.loaderText}>Loading Weekly Orders...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#F3FDF1" }}>
      {/* Header */}
      <View style={styles.topcustomizeorder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={r(24, 30)} color="#007A33" />
        </TouchableOpacity>
        <Text style={styles.topcustomizeorderTitle}>Customize Order</Text>
        <View style={{ width: r(24, 30) }} />
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagecustomizeorder}>
          <View style={styles.titleRow}>
            <Ionicons name="calendar-outline" size={22} color="#007A33" />
            <Text style={styles.title}> Weekly Menu Orders</Text>
          </View>
          <Text style={styles.subtitle}>View all customer weekly meal plans</Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Weekly Orders Found</Text>
          </View>
        ) : (
          <View style={styles.ordersGrid}>
            {orders.map((order) => (
              <View key={order.id} style={[styles.card, { width: getCardWidth() }]}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.customerInfo}>
                    <Ionicons name="person-circle-outline" size={18} color="#007A33" />
                    <Text style={styles.customerName}>{order.name}</Text>
                  </View>
                  <View style={styles.dateTag}>
                    <Ionicons name="calendar" size={14} color="#007A33" />
                    <Text style={styles.dateText}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Body */}
                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={14} color="#7f8c8d" />
                    <Text style={styles.infoText}>{order.phone_number}</Text>
                  </View>
                  <Text style={styles.addressText}>
                    {order.address_1}, {order.address_2}, {order.landmark},{" "}
                    {order.city}, {order.state} - {order.pincode}
                  </Text>

                  <View style={styles.daysSection}>
                    <Text style={styles.sectionTitle}>Weekly Menu</Text>
                    <View style={styles.daysGrid}>
                      {[
                        "sunday",
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                      ].map((day) => (
                        <View key={day} style={styles.dayCard}>
                          <Text style={styles.dayName}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Text>
                          {Object.keys(order[day] || {}).length > 0 ? (
                            Object.entries(order[day]).map(([key, val]) => (
                              <View key={key} style={styles.menuItem}>
                                <Text style={styles.menuKey}>{key}:</Text>
                                <Text style={styles.menuValue}>
                                  {typeof val === "object"
                                    ? Object.entries(val)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(", ")
                                    : val}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <Text style={styles.emptyDay}>—</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.totalRow}>
                    <Text>Total:</Text>
                    <Text style={styles.totalValue}>₹{order.total}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text>GST:</Text>
                    <Text style={styles.totalValue}>₹{order.gst}</Text>
                  </View>
                  <View style={[styles.totalRow, styles.grandTotal]}>
                    <Text>Grand Total:</Text>
                    <Text style={styles.grandTotalValue}>
                      ₹{order.grand_total}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

export default CustomizeOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FDF1",
    padding: r(12, 18),
  },
  topcustomizeorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(12),
    backgroundColor: "#EAFCE6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDEFD8",
    marginBottom: 12,
  },
  topcustomizeorderTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#007A33",
  },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  pagecustomizeorder: { paddingHorizontal: 16, paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: "700", color: "#007A33", marginLeft: 8 },
  subtitle: { fontSize: 13, color: "#666" },
  ordersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderColor: "rgba(0,122,51,0.1)",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  customerInfo: { flexDirection: "row", alignItems: "center" },
  customerName: { fontSize: 14, fontWeight: "600", color: "#2c3e50", marginLeft: 5 },
  dateTag: {
    backgroundColor: "#EAFCE6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: { color: "#007A33", fontSize: 11, marginLeft: 4 },
  cardBody: { marginBottom: 6 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  infoText: { fontSize: 12, color: "#555", marginLeft: 6 },
  addressText: { fontSize: 12, color: "#444", marginBottom: 6 },
  daysSection: { marginTop: 6 },
  sectionTitle: { fontWeight: "600", color: "#007A33", marginBottom: 4, fontSize: 13 },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCard: {
    backgroundColor: "#f0f9f0",
    borderColor: "#c6eac6",
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    width: "48%",
    marginBottom: 6,
  },
  dayName: {
    color: "#007A33",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
  },
  menuItem: {
    backgroundColor: "#e6f7e6",
    borderRadius: 5,
    paddingHorizontal: 3,
    marginBottom: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  menuKey: { fontWeight: "600", color: "#007A33", fontSize: 11 },
  menuValue: { fontSize: 11, color: "#555", flexShrink: 1 },
  emptyDay: { color: "#aaa", textAlign: "center", fontStyle: "italic" },
  footer: { borderTopWidth: 1, borderColor: "#ecf0f1", paddingTop: 6 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1,
  },
  totalValue: { color: "#444" },
  grandTotal: { borderTopWidth: 1, borderColor: "#e0e0e0", marginTop: 4, paddingTop: 4 },
  grandTotalValue: { color: "#007A33", fontWeight: "700" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { color: "#007A33", marginTop: 8, fontSize: r(14, 16) },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 15 },
  emptyContainer: { alignItems: "center", padding: 30 },
  emptyText: { color: "#888", fontSize: 15 },
});
