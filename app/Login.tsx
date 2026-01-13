import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from "axios";
import { saveToken } from '../utils/tokenStorage';
import Toast from 'react-native-toast-message';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both username and password'
      });
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.27:5000/api/login', {
        username,
        password,
      });

      const data = response.data;

      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });

        if (data.token) {
          await saveToken(data.token);
        }

        router.push({
          pathname: './Authentication',
          params: {
            user_id: data.user_id,
          },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: data.message || 'Invalid credentials'
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Failed to connect to the server'
      });
    }
  };


  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/zb/zenbank-logo.png')} style={styles.logo} />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => alert('Forgot username pressed')}>
          <Text style={styles.link}>Forgot username</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Forgot password pressed')}>
          <Text style={styles.link}>Forgot password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('../signup/EnterAccountDetails')}>
        <Text style={styles.signupText}>Don't have Online Banking yet? Sign up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#9993CC',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  link: {
    color: '#9993CC',
    fontSize: 14,
  },
  signupText: {
    marginTop: 20,
    color: '#9993CC',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Login;
