import { Image, ScrollView, StyleSheet, Text } from 'react-native';

export default function OtherProfileScreen({ route }) {
  const { userName, userId } = route.params || {}; // You can expand this later to fetch full user data from Firestore if needed

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.name}>{userName || 'User'}</Text>
      <Text style={styles.bio}>This is {userName || 'the user'}'s profile.</Text>
      <Text style={styles.info}>User ID: {userId}</Text>
      {/* You can add more details by fetching from Firestore later */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20 },
  profileImage: { width: 140, height: 140, borderRadius: 70, marginBottom: 20 },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  bio: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20 },
  info: { fontSize: 14, color: '#888' }
});