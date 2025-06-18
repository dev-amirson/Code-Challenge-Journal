import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';

import { Button } from '../components/Button';
import { CustomInput } from '../components/CustomInput';
import { renderBackgroundElements } from '../constants/backgroundElements';
import { authService } from '../services/auth';
import { useStore } from '../store/useStore';

const validateEmail = (email: string): string => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useStore(state => state.setUser);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleEmailBlur = () => {
    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError);
  };

  const handlePasswordBlur = () => {
    const passwordValidationError = validatePassword(password);
    setPasswordError(passwordValidationError);
  };

  const handleLogin = async () => {
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      setError('Please fix the errors above');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await authService.login({ email, password });

      if (result?.user) {
        setUser(result.user);
      }
    } catch (error: any) {
      Alert.alert(
        'Login Error',
        'An unexpected error occurred. Please check your credentials and try again..',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {renderBackgroundElements()}

      <View style={styles.contentContainer}>
        <Text variant='headlineMedium' style={styles.title}>
          Welcome Back
        </Text>

        <CustomInput
          label='Email'
          value={email}
          onChangeText={handleEmailChange}
          onBlur={handleEmailBlur}
          keyboardType='email-address'
          autoCapitalize='none'
          iconName='email-outline'
          error={emailError}
        />

        <CustomInput
          label='Password'
          value={password}
          onChangeText={handlePasswordChange}
          onBlur={handlePasswordBlur}
          secureTextEntry={true}
          iconName='lock-outline'
          showToggle={true}
          error={passwordError}
        />

        <Button onPress={handleLogin} loading={loading}>
          Login
        </Button>
        <Button
          mode='text'
          onPress={() => navigation.navigate('SignUp')}
          style={styles.signUpButton}
        >
          Don't have an account? Sign up
        </Button>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
        >
          {error}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#ffffff',
    fontWeight: '700',
    zIndex: 11,
  },
  signUpButton: {
    marginTop: 16,
  },
});
