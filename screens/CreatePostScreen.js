import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

export default function CreatePostScreen({ navigation }) {
  const { addPost } = usePosts();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const post = () => {
    if (!text) return Alert.alert('Write something!');
    addPost({
      id: Date.now().toString(),
      user: { name: user.name, profilePic: user.profilePic },
      text,
      image,
      likes: 0,
      likedByMe: false,
      timestamp: 'just now',
      comments: []
    });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput multiline placeholder="What's on your mind?" value={text} onChangeText={setText} style={{ flex: 1, fontSize: 18 }} />
      {image && <Image source={{ uri: image }} style={{ height: 200, marginVertical: 10 }} />}
      <TouchableOpacity onPress={pickImage}><Text>📸 Add Photo</Text></TouchableOpacity>
      <TouchableOpacity onPress={post} style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 20 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}