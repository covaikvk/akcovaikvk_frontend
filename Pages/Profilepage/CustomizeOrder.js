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
import { scale } from "react-native-size-matters"; // ✅ only scale needed

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
      {/* ✅ Same Header as Orders Component */}
      <View style={styles.topcustomizeorder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={r(24, 30)} color="#007A33" />
        </TouchableOpacity>
        <Text style={styles.topcustomizeorderTitle}>Customize Order</Text>
        <View style={{ width: r(24, 30) }} /> {/* Spacer */}
      </View>

      {/* 🔹 Main Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagecustomizeorder}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Ionicons name="calendar-outline" size={24} color="#007A33" />
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
              <View
                key={order.id}
                style={[styles.card, { width: getCardWidth() }]}
              >
                {/* Card Header */}
                <View style={styles.cardcustomizeorderHeader}>
                  <View style={styles.customerInfo}>
                    <Ionicons
                      name="person-circle-outline"
                      size={18}
                      color="#007A33"
                    />
                    <Text style={styles.customerName}>{order.name}</Text>
                  </View>
                  <View style={styles.dateTag}>
                    <Ionicons name="calendar" size={14} color="#007A33" />
                    <Text style={styles.dateText}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Card Body */}
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

                {/* Card Footer */}
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

      {/* 🔹 Fixed Footer */}
      <Footer />
    </View>
  );
};

export default CustomizeOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FDF1",
    padding: r(16, 24),
  },
  topcustomizeorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    backgroundColor: "#EAFCE6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDEFD8",
    marginBottom: 20,
  },
  topcustomizeorderTitle: {
    fontSize: scale(22),
    fontWeight: "700",
    color: "#007A33",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3FDF1",
  },
  loaderText: {
    color: "#007A33",
    marginTop: 8,
    fontSize: r(14, 18),
  },
  pagecustomizeorder: { padding: 20, paddingTop: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007A33",
    marginLeft: 8,
  },
  subtitle: { fontSize: 14, color: "#666" },
  ordersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderColor: "rgba(0,122,51,0.1)",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardcustomizeorderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  customerInfo: { flexDirection: "row", alignItems: "center" },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 5,
  },
  dateTag: {
    backgroundColor: "#EAFCE6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: { color: "#007A33", fontSize: 12, marginLeft: 5 },
  cardBody: { marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoText: { fontSize: 13, color: "#555", marginLeft: 6 },
  addressText: { fontSize: 13, color: "#444", marginBottom: 8 },
  daysSection: { marginTop: 10 },
  sectionTitle: { fontWeight: "600", color: "#007A33", marginBottom: 6 },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCard: {
    backgroundColor: "#f0f9f0",
    borderColor: "#c6eac6",
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    width: "48%",
    marginBottom: 8,
  },
  dayName: {
    color: "#007A33",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 3,
  },
  menuItem: {
    backgroundColor: "#e6f7e6",
    borderRadius: 6,
    paddingHorizontal: 4,
    marginBottom: 2,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  menuKey: { fontWeight: "600", color: "#007A33", fontSize: 11 },
  menuValue: { fontSize: 11, color: "#555", flexShrink: 1 },
  emptyDay: { color: "#aaa", textAlign: "center", fontStyle: "italic" },
  footer: {
    borderTopWidth: 1,
    borderColor: "#ecf0f1",
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  totalValue: { color: "#444" },
  grandTotal: {
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 5,
    paddingTop: 6,
  },
  grandTotalValue: { color: "#007A33", fontWeight: "700" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
  emptyContainer: { alignItems: "center", padding: 40 },
  emptyText: { color: "#888", fontSize: 16 },
});
