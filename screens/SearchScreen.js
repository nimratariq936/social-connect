import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      // Basic prefix search approach for names
      // Important: Firestore is case-sensitive, so this only matches exact capitalizations unless fully stored lowercase
      const q = query(
        collection(db, 'users'),
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(users);
    } catch (error) {
      console.error("Search error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by exact name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => navigation.navigate('OtherProfile', { userId: item.id, userName: item.name })}
          >
            <Image 
              source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }} 
              style={styles.profilePic} 
            />
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBarContainer: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10 },
  searchButton: { marginLeft: 10, justifyContent: 'center', backgroundColor: '#007AFF', paddingHorizontal: 15, borderRadius: 8 },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#f9f9f9' },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#888' }
});
