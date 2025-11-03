import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
// 🎯 CRITICAL IMPORTS FOR BASE64 CONVERSION
// FIX: Using the /legacy path to resolve the deprecation error
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

// 1. REQUIRE THE LOCAL IMAGE ASSET
// ⚠️ VERIFY THIS PATH: If your file is not at '../../assets/logo1.png', adjust it.
const logoAsset = require('../../assets/logo1.png');

export default function Quotations() {
  const navigation = useNavigation();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [gstPercent, setGstPercent] = useState(18);
  const [searchTerm, setSearchTerm] = useState("");
  
  // STATE TO HOLD THE DYNAMICALLY GENERATED BASE64 URI
  const [logoBase64, setLogoBase64] = useState(null); 

  // --- EFFECT 1: FETCH QUOTATIONS ---
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await axios.get(
          "https://kvk-backend.onrender.com/api/quotations"
        );
        const transformed = res.data.map((q) => ({
          ...q,
          list: Array.isArray(q.list)
            ? q.list.map((item, i) => ({
                ...item,
                item: item.dishName || item.item || `Dish ${i + 1}`,
                amount: item.amount || 0,
              }))
            : [],
        }));
        setQuotations(transformed);
      } catch (err) {
        console.log("Error:", err);
        Alert.alert("Error", "Failed to load quotations.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  // --- EFFECT 2: CONVERT LOGO TO BASE64 ---
  useEffect(() => {
    const loadLogoBase64 = async () => {
      try {
        const asset = Asset.fromModule(logoAsset);
        await asset.downloadAsync();
        
        // Use the string 'base64' directly for encoding
        const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
          encoding: 'base64', 
        });

        // Construct the full data URI
        setLogoBase64(`data:image/${asset.type};base64,${base64}`);

      } catch (e) {
        console.error("Failed to load and convert logo to Base64:", e);
        Alert.alert("PDF Error", "Could not load the logo for the quotation. Check asset path/file size.");
        setLogoBase64(null); 
      }
    };
    loadLogoBase64();
  }, []); 


  const filtered = quotations.filter(
    (q) =>
      q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.phone?.includes(searchTerm) ||
      q.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAmountChange = (index, value) => {
    const updated = [...selectedQuotation.list];
    updated[index].amount = Number(value) || 0;
    setSelectedQuotation({ ...selectedQuotation, list: updated });
  };

  const subtotal = selectedQuotation
    ? selectedQuotation.list.reduce((s, i) => s + (i.amount || 0), 0)
    : 0;
  const gstAmount = (subtotal * gstPercent) / 100;
  const total = subtotal + gstAmount;

  const generatePDF = async () => {
    if (!selectedQuotation) return;
    
    // CRITICAL CHECK: Ensure the logo data is ready before proceeding
    if (!logoBase64) {
      Alert.alert("Please Wait", "The logo data is still loading or failed to load. Try again in a moment.");
      return;
    }

    const quotationNo = `KVK/${new Date(selectedQuotation.created_at)
      .getFullYear()}/${(selectedQuotation.id || 1)
      .toString()
      .padStart(4, "0")}`;

    const validUntil = new Date(
      new Date(selectedQuotation.created_at).getTime() + 15 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-IN");

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin:0; padding:0; color:#000; }
          .header {
            background-color:#1a5d3a; color:#fff; text-align:center;
            padding:15px 10px 10px 10px;
          }
          .logo { width:60px; height:60px; object-fit:contain; }
          h1 { margin:5px 0; font-size:20px; letter-spacing:1px; }
          .subtext { font-size:10px; margin:0; line-height:14px; }
          .title { text-align:center; color:#1a5d3a; margin:20px 0 5px; font-size:20px; }
          .subhead { text-align:center; font-size:11px; color:#333; }
          table { width:100%; border-collapse:collapse; font-size:11px; }
          th,td { border:1px solid #ccc; padding:6px; text-align:left; }
          th { background:#1a5d3a; color:#fff; text-align:center; }
          .section { padding:0 20px; margin-top:10px; }
          .two-col { display:flex; justify-content:space-between; }
          .totals { margin:20px 20px 0; width:260px; float:right; background:#f5f5f5;
            border-radius:6px; padding:10px; }
          .totals table { width:100%; border:none; }
          .totals td { border:none; padding:3px 0; font-size:11px; }
          .grand { color:#1a5d3a; font-weight:bold; font-size:12px; }
          .terms { clear:both; padding:0 20px; margin-top:40px; font-size:10px; }
          .footer { text-align:center; color:#444; font-size:9px; margin-top:30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoBase64}" class="logo" />
          <h1>KANDHA VILAS KITCHEN</h1>
          <p class="subtext">Authentic Catering & Event Specialists</p>
          <p class="subtext">Phone: +91 98765 43210 | Email: kandhavilaskitchen@gmail.com</p>
          <p class="subtext">Website: www.kandhavilaskitchen.in</p>
          <p class="subtext">GSTIN: 29ABCDE1234F1Z5 | FSSAI: 11223344556677</p>
        </div>

        <div class="title">QUOTATION</div>
        <div class="subhead">Quotation No: ${quotationNo}</div>

        <div class="section two-col">
          <div>
            <b>Bill To:</b><br/>
            Name: ${selectedQuotation.name}<br/>
            Phone: ${selectedQuotation.phone}<br/>
            WhatsApp: ${selectedQuotation.whatsappNumber || "-"}<br/>
            Number of Persons: ${selectedQuotation.numberOfPerson || "-"}
          </div>
          <div>
            <b>Quotation Details:</b><br/>
            Date: ${new Date(selectedQuotation.created_at).toLocaleDateString("en-IN")}<br/>
            Valid Until: ${validUntil}<br/>
            Function Date: ${selectedQuotation.date_of_function || "-"}
          </div>
        </div>

        <div class="section" style="margin-top:20px;">
          <table>
            <tr><th>No.</th><th>Dish Name</th><th>Amount (Rs)</th></tr>
            ${selectedQuotation.list
              .map(
                (i, idx) => `
                <tr>
                  <td style="text-align:center;">${idx + 1}</td>
                  <td>${i.item}</td>
                  <td style="text-align:right;">${i.amount.toFixed(2)}</td>
                </tr>`
              )
              .join("")}
          </table>
        </div>

        <div class="totals">
          <table>
            <tr><td>Subtotal:</td><td style="text-align:right;">Rs ${subtotal.toFixed(2)}</td></tr>
            <tr><td>GST (${gstPercent}%):</td><td style="text-align:right;">Rs ${gstAmount.toFixed(2)}</td></tr>
            <tr><td colspan="2"><hr/></td></tr>
            <tr><td class="grand">Grand Total:</td><td class="grand" style="text-align:right;">Rs ${total.toFixed(2)}</td></tr>
            <tr><td colspan="2" style="font-size:9px;">(Inclusive of all taxes)</td></tr>
          </table>
        </div>

        <div class="terms">
          <b>Terms & Conditions:</b><br/>
          1. This quotation is valid for 15 days from the date of issue.<br/>
          2. Prices are inclusive of all applicable taxes.<br/>
          3. 50% advance payment required to confirm the booking.<br/>
          4. Balance payment to be made before delivery/completion of service.<br/>
          5. Any changes in menu or services may affect the final pricing.<br/>
          6. Cancellation policy: 7 days prior to event - full refund, 3–7 days - 50% refund.
        </div>

        <div class="footer">
          <hr/>
          Thank you for choosing Kandha Vilas Kitchen!<br/>
          We guarantee the highest quality and service standards<br/><br/>
          <b>Authorized Signatory</b>
        </div>
      </body>
    </html>`;

    await Print.printAsync({ html });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3FDF1" }}>
      {/* ✅ Custom Header */}
      <View style={styles.quotationheader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(24)} color="#2d5e2f" />
        </TouchableOpacity>
        <Text style={styles.quotationheaderTitle}>Quotation</Text>
        <View style={{ width: scale(24) }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#27ae60" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTopLine} />
              <View style={styles.cardHeader}>
                <View style={styles.nameRow}>
                  <Ionicons name="person" size={18} color="#27ae60" />
                  <Text style={styles.customerName}>{item.name}</Text>
                </View>
                <View style={styles.dateTag}>
                  <Ionicons name="calendar" size={12} color="#555" />
                  <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call" size={14} color="#555" />
                <Text style={styles.infoText}>{item.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="whatsapp" size={14} color="#25D366" />
                <Text style={styles.infoText}>{item.whatsappNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={14} color="#555" />
                <Text style={styles.infoText}>
                  {item.city}, {item.state}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="people" size={14} color="#555" />
                <Text style={styles.infoText}>{item.numberOfPerson} persons</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.footerRow}>
                <Text style={styles.dishCount}>{item.list.length} dishes</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => setSelectedQuotation(item)}
                >
                  <Text style={styles.viewText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* MODAL */}
      <Modal visible={!!selectedQuotation} animationType="slide" transparent>
        {selectedQuotation && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <FontAwesome name="edit" size={18} color="white" />
                  <Text style={styles.modalHeaderText}>
                    Quotation Details - {selectedQuotation.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedQuotation(null)}
                  style={styles.closeIcon}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.sectionTitle}>Customer Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoCol}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{selectedQuotation.name}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{selectedQuotation.phone}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.label}>WhatsApp:</Text>
                    <Text style={styles.value}>
                      {selectedQuotation.whatsappNumber}
                    </Text>
                  </View>
                  <View style={[styles.infoCol, { width: "100%" }]}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>
                      {selectedQuotation.address1}, {selectedQuotation.address2},{" "}
                      {selectedQuotation.city}, {selectedQuotation.state} -{" "}
                      {selectedQuotation.pincode}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.label}>Persons:</Text>
                    <Text style={styles.value}>
                      {selectedQuotation.numberOfPerson}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>
                      {new Date(selectedQuotation.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Menu Items & Pricing</Text>
                <View style={styles.itemsBox}>
                  {selectedQuotation.list.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <Text style={styles.itemName}>{item.item}</Text>
                      <View style={styles.amountContainer}>
                        <Text style={styles.rupeeSymbol}>₹</Text>
                        <TextInput
                          keyboardType="numeric"
                          value={item.amount.toString()}
                          onChangeText={(v) => handleAmountChange(i, v)}
                          style={styles.amountInput}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.gstSection}>
                  <Text style={styles.label}>GST Percentage:</Text>
                  <View style={styles.gstInputContainer}>
                    <TextInput
                      keyboardType="numeric"
                      value={gstPercent.toString()}
                      onChangeText={(v) => setGstPercent(Number(v))}
                      style={styles.gstInput}
                    />
                    <Text style={styles.percentSymbol}>%</Text>
                  </View>
                </View>

                <View style={styles.totalBox}>
                  <View style={styles.totalRow}>
                    <Text style={styles.label}>Subtotal:</Text>
                    <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.label}>GST ({gstPercent}%):</Text>
                    <Text style={styles.value}>₹{gstAmount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.line} />
                  <View style={styles.totalRow}>
                    <Text style={styles.grandLabel}>Grand Total:</Text>
                    <Text style={styles.grandValue}>₹{total.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedQuotation(null)}
                  >
                    <Ionicons name="close" size={18} color="white" />
                    <Text style={styles.btnText}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF}>
                    <Ionicons name="download" size={18} color="white" />
                    <Text style={styles.btnText}>Generate PDF</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 20 },
  quotationheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    backgroundColor: "#EAFCE6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDEFD8",
    marginBottom: 20,
  },
  quotationheaderTitle: {
    fontSize: scale(22),
    fontWeight: "700",
    color: "#007A33",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  cardTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#27ae60",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  customerName: { fontWeight: "bold", fontSize: 16, color: "#333" },
  dateTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: { fontSize: 12, color: "#555" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginVertical: 2 },
  infoText: { fontSize: 13, color: "#555" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dishCount: { fontSize: 13, color: "#888" },
  viewButton: { backgroundColor: "#27ae60", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  viewText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)",  justifyContent: "flex-end",  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    Height: "90%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: "#27ae60",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalHeaderText: { color: "white", fontSize: 15, fontWeight: "600" },
  closeIcon: { padding: 5 },
  modalBody: { padding: 16 ,paddingVertical: 8 },
  sectionTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 8, color: "#333" },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  infoCol: { width: "47%" },
  label: { fontSize: 12, color: "#888" },
  value: { fontSize: 13, fontWeight: "600", color: "#333" },
  itemsBox: { backgroundColor: "#f8f8f8", borderRadius: 8, padding: 10, marginVertical: 10 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 },
  itemName: { fontSize: 13, color: "#333", flex: 1 },
  amountContainer: { flexDirection: "row", alignItems: "center" },
  rupeeSymbol: { fontSize: 13, marginRight: 4, color: "#444" },
  amountInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 80,
    padding: 5,
    textAlign: "right",
  },
  gstSection: { marginTop: 10 },
  gstInputContainer: { flexDirection: "row", alignItems: "center" },
  gstInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 5,
    width: 60,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  percentSymbol: { fontSize: 13, color: "#444", marginLeft: 4 },
  totalBox: { backgroundColor: "#f9fff9", borderRadius: 8, padding: 10, marginVertical: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  line: { height: 1, backgroundColor: "#ddd", marginVertical: 6 },
  grandLabel: { fontWeight: "bold", color: "#2d5e2f" },
  grandValue: { fontWeight: "bold", color: "#2d5e2f" },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  closeBtn: {
    backgroundColor: "#888",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  pdfBtn: {
    backgroundColor: "#27ae60",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold" },
});