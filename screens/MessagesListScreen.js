import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function MessagesListScreen({ navigation }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    // We get chats where the current user is in the 'users' array
    const q = query(collection(db, 'chats'), where('users', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => {
        const data = doc.data();
        const otherUserId = data.users.find(id => id !== user.uid);
        if (!otherUserId) return null;
        return {
          id: doc.id,
          otherUserId,
          lastMessage: data.lastMessage,
          updatedAt: data.updatedAt
        };
      }).filter(Boolean);
      // Sort by updatedAt descending locally since combining array-contains and orderBy requires a composite index
      fetchedChats.sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <Text style={styles.emptyText}>No messages yet.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.chatItem} 
              onPress={() => navigation.navigate('Chat', { userId: item.otherUserId, userName: 'User' })} 
            >
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>User {item.otherUserId.substring(0,5)}...</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#666' }
});
