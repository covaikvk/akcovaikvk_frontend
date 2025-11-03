import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (width / guidelineBaseWidth) * size;

export default function RegularOrder({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://kvk-backend.onrender.com/api/regularmenuorder",
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Corrected string interpolation
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error("❌ Failed to fetch orders:", data);
          Alert.alert("Error", "Unable to fetch orders.");
        }
      } catch (error) {
        console.error("⚠ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirm = (index) => {
    setOrders((prev) =>
      prev.map((o, i) =>
        i === index ? { ...o, order_status: "Confirmed" } : o
      )
    );
  };

  const handlePaid = (index) => {
    setOrders((prev) =>
      prev.map((o, i) =>
        i === index ? { ...o, payment_status: "Paid" } : o
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Regular Orders</Text>
        <View style={{ width: scale(24) }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d5e2f" />
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No regular orders found.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: scale(16),
              paddingBottom: scale(80),
            }}
            showsVerticalScrollIndicator={false}
          >
            {orders.map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <Text style={styles.orderTitle}>
                  {order.regularmenuname || "Regular Menu"}
                </Text>
                <Text style={styles.orderText}>Name: {order.name}</Text>
                <Text style={styles.orderText}>Phone: {order.phone_number}</Text>
                <Text style={styles.orderText}>Address: {order.address_1}</Text>
                {order.address_2 ? (
                  <Text style={styles.orderText}>{order.address_2}</Text>
                ) : null}
                <Text style={styles.orderText}>
                  {order.city}, {order.state} - {order.pincode}
                </Text>

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
                    {order.order_status || "Pending"}
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
                    {order.payment_status || "Unpaid"}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.confirmBtn,
                      order.order_status === "Confirmed" && {
                        backgroundColor: "#456B2D",
                      },
                    ]}
                    onPress={() => handleConfirm(index)}
                    disabled={order.order_status === "Confirmed"}
                  >
                    <Text style={styles.btnText}>
                      {order.order_status === "Confirmed"
                        ? "Confirmed"
                        : "Confirm"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paidBtn,
                      order.payment_status === "Paid" && {
                        backgroundColor: "#D6EEB9",
                      },
                    ]}
                    onPress={() => handlePaid(index)}
                    disabled={order.payment_status === "Paid"}
                  >
                    <Text style={styles.paidBtnText}>
                      {order.payment_status === "Paid" ? "Paid" : "Mark Paid"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Footer */}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3FDF1" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    backgroundColor: "#EAFCE6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDEFD8",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: scale(22),
    fontWeight: "700",
    color: "#007A33",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: scale(16),
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: scale(14),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: scale(20),
  },
  orderTitle: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#007A33",
    marginBottom: 4,
  },
  orderText: {
    fontSize: scale(14),
    color: "#333",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: scale(15),
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
    backgroundColor: "#C6EAAF",
    color: "#007A33",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(12),
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#173b01",
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  paidBtn: {
    flex: 1,
    backgroundColor: "#d6eeb9",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#d6eeb9",
    fontWeight: "600",
    fontSize: scale(15),
  },
  paidBtnText: {
    color: "#173b01",
    fontWeight: "600",
    fontSize: scale(15),
  },
});
