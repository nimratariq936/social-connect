import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { storage } from '../firebase';

export default function CreatePostScreen({ navigation }) {
  const { addPost } = usePosts();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `posts/${user.uid}/${Date.now()}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const post = async () => {
    if (!text && !image) return Alert.alert('Write something or add a photo!');
    
    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageAsync(image);
      }

      await addPost({
        userId: user.uid,
        userName: user.name,
        userProfilePic: user.profilePic || null,
        text,
        image: imageUrl,
        likes: [],
        comments: []
      });
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        multiline 
        placeholder="What's on your mind?" 
        value={text} 
        onChangeText={setText} 
        style={styles.input} 
      />
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      
      <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
        <Text style={styles.photoText}>📸 Add Photo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={post} 
        style={[styles.postButton, loading && styles.disabledButton]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postButtonText}>Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { flex: 1, fontSize: 18, textAlignVertical: 'top' },
  previewImage: { height: 200, width: '100%', borderRadius: 10, marginVertical: 10 },
  photoButton: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, alignSelf: 'flex-start' },
  photoText: { fontSize: 16, fontWeight: '500' },
  postButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  disabledButton: { backgroundColor: '#a0c4ff' },
  postButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
