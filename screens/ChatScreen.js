import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function ChatScreen({ route }) {
  const { userId, userName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const chatId = [user.uid, userId].sort().join('_');

  useEffect(() => {
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Make sure chat document exists so it shows up in lists
    setDoc(doc(db, 'chats', chatId), {
      users: [user.uid, userId],
      lastMessage: '',
      updatedAt: Date.now()
    }, { merge: true });

    return () => unsubscribe();
  }, [userId, user.uid, chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text,
      senderId: user.uid,
      createdAt: Date.now()
    });

    await setDoc(doc(db, 'chats', chatId), {
      users: [user.uid, userId],
      lastMessage: text,
      updatedAt: Date.now()
    }, { merge: true });

    setText('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.senderId === user.uid ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, item.senderId === user.uid ? styles.myMessageText : styles.theirMessageText]}>
              {item.text}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          value={text} 
          onChangeText={setText} 
          placeholder="Type a message..." 
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  messageBubble: { padding: 12, borderRadius: 20, marginVertical: 4, marginHorizontal: 12, maxWidth: '80%' },
  myMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirMessage: { backgroundColor: '#e5e5ea', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16 },
  myMessageText: { color: '#fff' },
  theirMessageText: { color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16 },
  sendButton: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 },
  sendButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 }
});
