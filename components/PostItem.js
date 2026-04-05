import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

export default function PostItem({ post, navigation }) {
  const { toggleLike, addComment } = usePosts();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes && post.likes.includes(user?.uid);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <View style={styles.postContainer}>
      <TouchableOpacity 
        style={styles.userInfo} 
        onPress={() => navigation.navigate('OtherProfile', { userId: post.userId, userName: post.userName })}
      >
        <Image 
          source={{ uri: post.userProfilePic || 'https://via.placeholder.com/50' }} 
          style={styles.profilePic} 
        />
        <Text style={styles.userName}>{post.userName}</Text>
      </TouchableOpacity>

      <Text style={styles.postText}>{post.text}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={26} 
            color={isLiked ? "red" : "black"} 
          />
          <Text style={styles.count}>{post.likes ? post.likes.length : 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons name="chatbubble-outline" size={26} color="black" />
          <Text style={styles.count}>{post.comments ? post.comments.length : 0}</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <FlatList
            data={post.comments || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentUser}>{item.userName}:</Text>
                <Text>{item.text}</Text>
              </View>
            )}
            style={styles.commentsList}
          />

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Text style={styles.sendButton}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.timestamp}>{post.timestamp || 'just now'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: { 
    backgroundColor: '#fff', 
    margin: 10, 
    padding: 15, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  postText: { fontSize: 16, marginBottom: 10 },
  postImage: { width: '100%', height: 250, borderRadius: 10, marginVertical: 10 },
  actions: { flexDirection: 'row', marginVertical: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
  count: { marginLeft: 6, fontSize: 15 },
  commentsSection: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  commentsList: { maxHeight: 150 },
  comment: { marginBottom: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  commentUser: { fontWeight: 'bold' },
  commentInputContainer: { flexDirection: 'row', marginTop: 10 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 20 },
  sendButton: { color: '#007AFF', fontWeight: 'bold', padding: 10 },
  timestamp: { fontSize: 12, color: '#888', marginTop: 8 }
});