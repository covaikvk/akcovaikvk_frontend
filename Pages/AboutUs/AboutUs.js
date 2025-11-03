import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Footer from '../../Components/Footer/Footer';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Helper function for responsive sizing
const responsiveSize = (mobileSize, tabletSize) => (isTablet ? tabletSize : mobileSize);

const Aboutus = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.aboutusheader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={responsiveSize(24, 32)} color="#173b01" />
          </TouchableOpacity>
          <Text style={styles.aboutusheaderTitle}>About Us</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Content Wrapper to constrain width on large screens and center content */}
          <View style={styles.contentWrapper}> 
            <Image 
                source={require('../../assets/food_logo.png')} 
                style={styles.logo}
            /> 

            <Text style={styles.tagline}>Taste Towards Tradition.</Text>
            <Text style={styles.description}>
              We bring fresh, Hygienic and tasty catering for parties, function and daily needs
            </Text>

            <View style={styles.contactCard}>
              <ContactRow
                iconName="call"
                label="Call Us"
                info="+91 95765 43210"
              />
              <View style={styles.separator} />

              <ContactRow
                iconName="email"
                label="Email"
                info="support@cateringapp.com"
              />
              <View style={styles.separator} />

              <ContactRow
                iconName="location-on"
                label="Address"
                info="123 Food Street, Chennai"
              />
              <View style={styles.separator} />

              <ContactRow
                iconName="access-time"
                label="Support Hours"
                info="Mon - sat, 9 AM- 9 PM"
              />
            </View>
          </View>
        </ScrollView>
        <Footer/>
      </View>
    </SafeAreaView>
  );
};

// Extracted Contact Row Component for cleaner JSX
const ContactRow = ({ iconName, label, info }) => (
    <View style={styles.contactRow}>
        <MaterialIcons name={iconName} size={responsiveSize(24, 32)} color="#5a8d5a" />
        <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>{label}</Text>
            <Text style={styles.contactInfo}>{info}</Text>
        </View>
    </View>
);


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7ffed',
  },
  container: {
    flex: 1,
  },
  
  // --- Header ---
  aboutusheader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveSize(15, 30),
    paddingVertical: responsiveSize(15, 20),
    backgroundColor: '#f7ffed',
  },
  backButton: {
    marginRight: responsiveSize(20, 30),
  },
  aboutusheaderTitle: {
    fontSize: responsiveSize(22, 32),
    fontWeight: 'bold',
    color: '#173b01',
    fontFamily:"intern",
  },
  
  // --- Scroll Content & Layout ---
  scrollContent: {
    alignItems: 'center',
    // Reduced horizontal padding slightly on mobile for edge cases
    paddingHorizontal: responsiveSize(15, 40),
    paddingBottom: responsiveSize(30, 60),
  },
  contentWrapper: {
    // Limits content width on tablets for better reading experience
    maxWidth: isTablet ? 700 : '100%',
    width: '100%',
    alignItems: 'center',
  },
  
  // --- Logo and Text (FIXED FOR MOBILE OVERLAP) ---
  logo: {
    // FIX: Adjusted size for mobile and removed aggressive negative margins.
    width: responsiveSize(250, 350), 
    height: responsiveSize(250, 350),
    resizeMode: 'contain',
    
    // Key Fixes: Use standard positive margins to ensure the logo takes up its required space
    marginBottom: responsiveSize(-70, -100), // Keep some negative margin only for tablet to align tagline
    marginTop: responsiveSize(10, -40), 
  },
  tagline: {
    fontSize: responsiveSize(25, 38),
    fontWeight: 'bold',
    fontFamily:"intern",
    color: '#173b01',
    textAlign: 'center',
    // FIX: Added margin to push the description down and align below the logo's bottom edge
    marginTop: responsiveSize(10, 0), 
  },
  description: {
    fontSize: responsiveSize(16, 22),
    fontFamily:"intern",
    color: '#173b01',
    textAlign: 'center',
    marginTop: responsiveSize(10, 15),
    marginBottom: responsiveSize(30, 40),
    maxWidth: '90%',
  },
  
  // --- Contact Card ---
  contactCard: {
    backgroundColor: '#c8e6c9',
    borderRadius: 15,
    width: '100%',
    padding: responsiveSize(20, 30),
    // Shadow scaling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveSize(2, 4) },
    shadowOpacity: responsiveSize(0.23, 0.3),
    shadowRadius: responsiveSize(2.62, 4),
    elevation: responsiveSize(4, 8),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveSize(15, 20),
  },
  contactTextContainer: {
    marginLeft: responsiveSize(20, 30),
  },
  contactLabel: {
    fontSize: responsiveSize(16, 22),
    fontWeight: 'bold',
    color: '#173b01',
  },
  contactInfo: {
    fontSize: responsiveSize(14, 18),
    color: '#173b01',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#a5d6a7',
    width: '100%',
  },
});

export default Aboutus;