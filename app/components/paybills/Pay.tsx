import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Footer from '../homepage/Footer';
const PayScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pay</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('./SelectBillers')}>
          <MaterialCommunityIcons name="credit-card-outline" size={24} color="#9993CC" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Pay Bills</Text>
            <Text style={styles.cardSubtitle}>Make a payment to a biller</Text>
          </View>
        </TouchableOpacity>
      </View>

        {/* Footer Section */}
        <Footer /> {/* Adding Footer at the bottom */}
    </SafeAreaView>
  );
};

export default PayScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#9993CC', paddingVertical: 18, paddingHorizontal: 20 },
  headerText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  container: { flex: 1, padding: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Rounded corners for card
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, 
  },
  cardTextContainer: { marginLeft: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
});
