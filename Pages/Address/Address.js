import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import Footer from "../../Components/Footer/Footer";

const Address = ({ navigation }) => {
    const addresses = [
        { id: '1', type: 'Home', address: '5,Gandhiji street , Coimbatore', icon: <Feather name="home" size={52} color="#173b01" /> },
        { id: '2', type: 'Office', address: '5,Gandhiji street , Coimbatore', icon: <FontAwesome5 name="building" size={52} color="#173b01" /> },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("Profile")}
                    >
                        <Ionicons name="arrow-back" size={52} color="#173b01" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Saved Address</Text>
                </View>

                {/* Scrollable content */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.addressListContainer}>
                        {addresses.map((item, index) => (
                            <View key={item.id}>
                                <TouchableOpacity style={styles.addressRow}>
                                    <View style={styles.iconContainer}>{item.icon}</View>
                                    <View style={styles.addressTextContainer}>
                                        <Text style={styles.addressType}>{item.type}</Text>
                                        <Text style={styles.addressText}>{item.address}</Text>
                                    </View>
                                </TouchableOpacity>
                                {index < addresses.length - 1 && <View style={styles.separator} />}
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.addButton}>
                        <View style={styles.addIconCircle}>
                            <Feather name="plus" size={32} color="#333" />
                        </View>
                        <Text style={styles.addButtonText}>Add New Address</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Footer fixed at bottom */}
                <View style={styles.footerContainer}>
                    <Footer />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f7ffed' },
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#f7ffed', position: 'relative', justifyContent: 'center',
        marginBottom: 40,
    },
    backButton: { position: 'absolute', left: 15 },
    headerTitle: { fontSize: 52, fontFamily: "intern", fontWeight: 'bold', color: '#173b01', textAlign: 'center', flex: 1 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },

    // Address list
    addressListContainer: { backgroundColor: '#C6EAAF', borderRadius: 15, width: '100%', overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
    addressRow: { flexDirection: 'row', alignItems: 'center', padding: 40 },
    iconContainer: { marginRight: 20 },
    addressTextContainer: { flex: 1 },
    addressType: { fontSize: 32, fontWeight: 'bold', color: '#173b01' },
    addressText: { fontSize: 28, color: '#173b01', marginTop: 4 },
    separator: { height: 2, backgroundColor: '#a5d6a7', width: '90%', alignSelf: 'center' },

    // Add new address button
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C6EAAF', borderRadius: 15, width: '100%', paddingVertical: 40, marginTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
    addIconCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#173b01', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    addButtonText: { fontSize: 32, fontWeight: 'bold', color: '#173b01' },

    // Footer
    footerContainer: { position: 'absolute', bottom: -30, left: 0, right: 0 },
});

export default Address;
