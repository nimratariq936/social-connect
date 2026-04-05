import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Component mounted, setting up onAuthStateChanged...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AuthContext: onAuthStateChanged fired! User is:", firebaseUser ? firebaseUser.uid : null);
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ ...firebaseUser, ...userDoc.data() });
          } else {
            setUser(firebaseUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth process error:", error);
        setUser(null);
      } finally {
        console.log("AuthContext: Setting loading to false");
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      name,
      bio: '',
      profilePic: null,
      email,
    });
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateProfile = async (newData) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), newData);
    setUser(prev => ({ ...prev, ...newData }));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, resetPassword, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);