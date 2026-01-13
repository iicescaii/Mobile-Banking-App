import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, CheckCircle } from 'lucide-react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const { amount, from, to, note, created_at, reference } = useLocalSearchParams();

  const handleSaveImage = () => {
    console.log("Save image clicked");
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('../home')}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Sent Confirmation</Text>
      </View>

      <View style={styles.sentStatus}>
        <CheckCircle size={48} color="#7C65E6" />
        <Text style={styles.sentText}>Sent!</Text>
        <Text style={styles.amount}>PHP {amount}</Text>
      </View>

      <View style={styles.confirmationCard}>
        <Text style={styles.detailLabel}>To</Text>
        <Text style={styles.accountDetail}>{to}</Text>

        <Text style={styles.detailLabel}>From</Text>
        <Text style={styles.accountDetail}>{from}</Text>

        <View style={styles.divider} />

        <Text style={styles.detailLabel}>Created on</Text>
        <Text style={styles.date}>{created_at}</Text>

        <Text style={styles.detailLabel}>Reference no.</Text>
        <Text style={styles.reference}>{reference}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage}>
          <Text style={styles.buttonText}>Save image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#7C65E6',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: { padding: 10 },
  appBarTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  sentStatus: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  sentText: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#7C65E6',
    marginTop: 8,
  },
  amount: {
    fontSize: 32,
    fontFamily: 'Inter_600SemiBold',
    color: '#7C65E6',
    marginTop: 8,
  },
  confirmationCard: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  accountDetail: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 12,
  },
  reference: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 40,
  },
  saveButton: {
    backgroundColor: '#7C65E6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '48%',
  },
  shareButton: {
    backgroundColor: '#7C65E6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
});
