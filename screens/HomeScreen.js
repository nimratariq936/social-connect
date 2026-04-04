import { Ionicons } from '@expo/vector-icons';
import { FlatList, TouchableOpacity, View } from 'react-native';
import PostItem from '../components/PostItem';
import { usePosts } from '../context/PostContext';

export default function HomeScreen({ navigation }) {
  const { posts } = usePosts();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostItem post={item} navigation={navigation} />}
      />
      <TouchableOpacity 
        style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}