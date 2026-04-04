import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.option}>
        <Text style={styles.optionText}>Account: {user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('Theme', 'Dark mode coming soon!')}>
        <Text style={styles.optionText}>Appearance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('Notifications', 'Push notifications enabled')}>
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('About', 'Social Connect v1.0')}>
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => {
          logout();
          Alert.alert('Logged out successfully');
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  option: { 
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  optionText: { fontSize: 17 },
  logoutButton: { 
    marginTop: 50, 
    backgroundColor: '#FF3B30', 
    padding: 15, 
    borderRadius: 10 
  },
  logoutText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 18 
  }
});