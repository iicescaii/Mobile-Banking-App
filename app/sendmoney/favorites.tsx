import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search } from 'lucide-react-native';

const FAVORITES = [
  { id: 1, name: 'MariaZenBank', amount: 1500 },
  { id: 2, name: 'PrinceZenBank', amount: 3000 },
  { id: 3, name: 'PrincessZenBank', amount: 2000 },
];

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1a1a1a" />
          <Text style={styles.headerTitle}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search favorites"
          placeholderTextColor="#999"
        />
      </View>

      {FAVORITES.map((favorite) => (
        <TouchableOpacity 
          key={favorite.id}
          style={styles.favoriteItem}
          onPress={() => {
            // Handle favorite selection
            router.back();
          }}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
          </View>
          <View style={styles.favoriteInfo}>
            <Text style={styles.favoriteName}>{favorite.name}</Text>
            <Text style={styles.favoriteType}>ZenBank</Text>
            <Text style={styles.favoriteAmount}>PHP {favorite.amount.toLocaleString()}.00</Text>
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#7C65E6', 
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  favoriteType: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 4,
  },
  favoriteAmount: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
});