import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const pickAndUploadProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile({ profilePic: downloadURL });
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error) {
        Alert.alert('Upload Error', error.message);
      }
    }
  };

  const saveProfile = async () => {
    try {
      await updateProfile({ name, bio });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickAndUploadProfilePic}>
        <Image 
          source={{ uri: user?.profilePic || 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
      </TouchableOpacity>

      {editing ? (
        <>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Name" 
          />
          <TextInput 
            style={[styles.input, { height: 80 }]} 
            value={bio} 
            onChangeText={setBio} 
            placeholder="Bio" 
            multiline 
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.bio}>{user?.bio || 'No bio yet'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => {
          logout();
          Alert.alert('Logged out');
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  profileImage: { width: 140, height: 140, borderRadius: 70, marginBottom: 20, borderWidth: 3, borderColor: '#007AFF' },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  bio: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 30 },
  input: { 
    width: '90%', 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 15,
    fontSize: 16 
  },
  editButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, marginTop: 10 },
  editText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#34C759', padding: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { marginTop: 80, padding: 12 },
  logoutText: { color: 'red', fontSize: 18, fontWeight: 'bold' }
});