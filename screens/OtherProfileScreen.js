import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function OtherProfileScreen({ route, navigation }) {
  const { userName, userId } = route.params || {};
  const { user, toggleFollow } = useAuth();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (docSnap) => {
      if (docSnap.exists()) {
        setTargetUser(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const isFollowing = user?.following?.includes(userId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: targetUser?.profilePic || 'https://via.placeholder.com/150' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.name}>{targetUser?.name || userName}</Text>
      <Text style={styles.bio}>{targetUser?.bio || `This is ${targetUser?.name || userName}'s profile.`}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{targetUser?.followers?.length || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{targetUser?.following?.length || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {user?.uid !== userId && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, isFollowing ? styles.unfollowButton : styles.followButton]} 
            onPress={() => toggleFollow(userId)}
          >
            <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.messageButton]} 
            onPress={() => navigation.navigate('Chat', { userId, userName: targetUser?.name || userName })}
          >
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20 },
  profileImage: { width: 140, height: 140, borderRadius: 70, marginBottom: 20 },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  bio: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 },
  stat: { alignItems: 'center', marginHorizontal: 20 },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: '#666' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  followButton: { backgroundColor: '#007AFF' },
  unfollowButton: { backgroundColor: '#888' },
  messageButton: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
