import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuotation } from "../../Pages/Quotation Services/QuotationContext";

export default function QuotationMenu() {
  const { quotationItems, clearQuotation } = useQuotation();
  const navigation = useNavigation();

  if (!quotationItems.length) return null;

  // Calculate total items (sum of quantities)
  const totalItems = quotationItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <View style={styles.container}>
      <View style={styles.cartBar}>
        {/* Top row: added items + delete */}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>
            You have added {totalItems} item{totalItems > 1 ? "s" : ""}
          </Text>
          <TouchableOpacity onPress={clearQuotation} style={styles.deleteBtn}>
            <Ionicons name="trash" size={20} color="#173b01" />
          </TouchableOpacity>
        </View>

        {/* Horizontal line */}
        <View style={styles.separator} />

        {/* Bottom row: View Quotation button right-aligned */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.viewCartBtn}
            onPress={() => navigation.navigate("MenuScreen")}
          >
            <Text style={styles.viewCartText}>View Quotation</Text>
            <Ionicons name="chevron-forward" size={18} color="#173b01" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 75,
    left: 16,
    right: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cartBar: {
    backgroundColor: "#d6eeb9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 15,
    borderColor: "#173b01",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#173b01",
  },
  deleteBtn: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#173b01",
    marginVertical: 3,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end", // right align
  },
  viewCartBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewCartText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#173b01",
    marginRight: 5,
  },
});
