import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

export default function CustomizeAdd1({ day, meal, addItemsToMenu, items, onPress }) {
  if (!items || items.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: responsiveSize(10, 95),
          left: responsiveSize(16, 30),
          right: responsiveSize(16, 30),
        },
      ]}
    >
      <View style={[styles.offerBanner, { paddingVertical: responsiveSize(8, 12) }]}>
        <Text style={[styles.offerText, { fontSize: responsiveSize(13, 16) }]}>
          Where taste meets tradition. <Text style={{ fontWeight: "bold" }}></Text>
        </Text>
      </View>

      <View style={[styles.cartBar, { paddingVertical: responsiveSize(12, 16) }]}>
        <View style={styles.itemRow}>
          <Text style={[styles.itemText, { fontSize: responsiveSize(16, 20) }]}>
            {items.length} item{items.length > 1 ? "s" : ""} Added
          </Text>
        </View>

        <TouchableOpacity
          style={styles.okBtn}
          onPress={() => {
            addItemsToMenu?.(day, meal, items);
            onPress?.();
          }}
        >
          <Text style={[styles.okText, { fontSize: responsiveSize(16, 20) }]}>OK</Text>
          <Ionicons name="chevron-forward" size={responsiveSize(18, 22)} color="#173b01" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", borderRadius: 12, overflow: "hidden", backgroundColor: "transparent" },
  offerBanner: { backgroundColor: "#173b01" },
  offerText: { color: "#fff", textAlign: "center" },
  cartBar: { backgroundColor: "#d6eeb9", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 },
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemText: { fontWeight: "bold", color: "#173b01" },
  okBtn: { flexDirection: "row", alignItems: "center" },
  okText: { fontWeight: "bold", color: "#173b01", marginRight: 5 },
});
