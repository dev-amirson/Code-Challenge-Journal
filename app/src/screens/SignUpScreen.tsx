import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';

import { Button } from '../components/Button';
import { CustomInput } from '../components/CustomInput';
import { renderBackgroundElements } from '../constants/backgroundElements';
import { authService } from '../services/auth';
import { useStore } from '../store/useStore';

export const SignUpScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setUser = useStore(state => state.setUser);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await authService.register({
        email,
        password: password,
        password_confirm: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      });

      if (result?.user) {
        setUser(result.user);
      } else {
        const errors = result?.errors;
        Alert.alert(
          'Registration Failed',
          errors
            ? errors.join(', ')
            : 'Failed to create account. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Registration Error',
        error.message || 'An unexpected error occurred. Please try again.',
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
          Create Account
        </Text>

        <CustomInput
          label='First Name'
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize='words'
          iconName='account-outline'
        />

        <CustomInput
          label='Last Name'
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize='words'
          iconName='account-outline'
        />

        <CustomInput
          label='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          iconName='email-outline'
        />

        <CustomInput
          label='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          iconName='lock-outline'
          showToggle={true}
        />

        <CustomInput
          label='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          iconName='shield-lock-outline'
          showToggle={true}
        />

        <Button onPress={handleSignUp} loading={loading}>
          Sign Up
        </Button>
        <Button
          mode='text'
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          Already have an account? Login
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
  loginButton: {
    marginTop: 16,
  },
});
