import { Formik } from 'formik';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6).required('Required'),
});

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Connect</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          login(values.email, values.password);
          navigation.replace('Main');
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <View>
            <TextInput style={styles.input} placeholder="Email" onChangeText={handleChange('email')} value={values.email} />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={handleChange('password')} value={values.password} />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 10, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 15 },
  error: { color: 'red', marginBottom: 10 }
});