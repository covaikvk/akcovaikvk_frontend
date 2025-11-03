import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuotation } from "../Quotation Services/QuotationContext";
import Footer from "../../Components/Footer/Footer";
import Details from "../../Components/Details/Details"; // Address form

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const r = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function MenuScreen() {
  const navigation = useNavigation();
  const { quotationItems, removeFromQuotation } = useQuotation();
  const [showForm, setShowForm] = useState(false);

  const totalItems = quotationItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.quotationmenuheader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={r(24, 32)} color="#173b01" />
        </TouchableOpacity>
        <Text style={styles.quotationmenuheaderTitle}>View Quotation</Text>
        <View style={{ width: r(24, 32) }} />
      </View>

      {/* ✅ Main Layout (content + footer) */}
      <View style={styles.mainContainer}>
        <View style={styles.content}>
          {/* If No Items */}
          {quotationItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items added yet.</Text>
            </View>
          ) : (
            <FlatList
              data={quotationItems}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.title}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  <TouchableOpacity onPress={() => removeFromQuotation(item.id)}>
                    <Ionicons name="trash" size={r(20, 24)} color="#173b01" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {/* Total Items Section */}
          {quotationItems.length > 0 && (
            <View style={styles.footerRow}>
              <Text style={styles.totalText}>Total Items: {totalItems}</Text>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ✅ Footer - always visible */}
        <Footer />
      </View>

      {/* Modal for Address Form */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Details onClose={() => setShowForm(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7ffed",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between", // Keeps footer at bottom
  },
  quotationmenuheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: r(16, 32),
    marginBottom: r(10, 15),
    marginTop: r(20, 25),
  },
  backBtn: {
    padding: r(4, 6),
  },
  quotationmenuheaderTitle: {
    fontSize: r(24, 32),
    fontWeight: "bold",
    color: "#173b01",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: r(16, 20),
    color: "#555",
  },
  listContainer: {
    paddingHorizontal: r(16, 32),
    paddingBottom: r(20, 30),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#d6eeb9",
    marginVertical: r(6, 10),
    padding: r(12, 18),
    borderRadius: r(10, 15),
  },
  itemName: {
    fontSize: r(16, 20),
    fontWeight: "bold",
    color: "#173b01",
    flex: 1,
  },
  itemQuantity: {
    fontSize: r(14, 18),
    color: "#173b01",
    marginHorizontal: r(10, 15),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: r(12, 18),
    paddingHorizontal: r(16, 32),
    backgroundColor: "#d6eeb9",
    borderRadius: r(10, 15),
    marginHorizontal: r(16, 32),
    marginBottom: r(20, 30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  totalText: {
    fontSize: r(16, 20),
    fontWeight: "bold",
    color: "#173b01",
  },
  submitBtn: {
    backgroundColor: "#173b01",
    paddingHorizontal: r(16, 24),
    paddingVertical: r(6, 10),
    borderRadius: r(8, 12),
    marginBottom:50,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: r(14, 18),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
