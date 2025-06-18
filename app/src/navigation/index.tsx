import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import { View, StyleSheet, Dimensions } from 'react-native';

import { useStore } from '../store/useStore';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { JournalListScreen } from '../screens/JournalListScreen';
import { NewJournalScreen } from '../screens/NewJournalScreen';
import { JournalDetailScreen } from '../screens/JournalDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const { width } = Dimensions.get('window');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='SignUp' component={SignUpScreen} />
  </Stack.Navigator>
);

const JournalStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#0f0f23',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerBackground: () => (
        <View style={styles.headerBackground}>
          <View style={[styles.headerCircle, styles.headerCircle1]} />
          <View style={[styles.headerCircle, styles.headerCircle2]} />
          <View style={[styles.headerSquare, styles.headerSquare1]} />
          <View style={styles.headerOverlay} />
        </View>
      ),
    }}
  >
    <Stack.Screen
      name='JournalList'
      component={JournalListScreen}
      options={{ title: 'My Journal' }}
    />
    <Stack.Screen
      name='NewJournal'
      component={NewJournalScreen}
      options={{ title: 'New Entry' }}
    />
    <Stack.Screen
      name='JournalDetail'
      component={JournalDetailScreen}
      options={{ title: 'Journal Entry' }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'help-circle';

        if (route.name === 'Journal') {
          iconName = 'book';
        } else if (route.name === 'Profile') {
          iconName = 'account';
        }

        return <IconButton icon={iconName} size={size} iconColor={color} />;
      },
      tabBarStyle: {
        backgroundColor: '#0f0f23',
        borderTopWidth: 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
      },
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 5,
      },
      tabBarBackground: () => (
        <View style={styles.tabBarBackground}>
          <View style={[styles.tabCircle, styles.tabCircle1]} />
          <View style={[styles.tabCircle, styles.tabCircle2]} />
          <View style={[styles.tabSquare, styles.tabSquare1]} />
          <View style={[styles.tabLine, styles.tabLine1]} />
          <View style={styles.tabOverlay} />
        </View>
      ),
    })}
  >
    <Tab.Screen
      name='Journal'
      component={JournalStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name='Profile'
      component={ProfileScreen}
      options={{
        title: 'Profile',
        headerStyle: {
          backgroundColor: '#0f0f23',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackground: () => (
          <View style={styles.headerBackground}>
            <View style={[styles.headerCircle, styles.headerCircle1]} />
            <View style={[styles.headerCircle, styles.headerCircle2]} />
            <View style={[styles.headerSquare, styles.headerSquare1]} />
            <View style={styles.headerOverlay} />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export const Navigation = () => {
  const user = useStore(state => state.user);

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    backgroundColor: '#0f0f23',
    overflow: 'hidden',
    position: 'relative',
  },
  headerCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.15,
  },
  headerCircle1: {
    width: 120,
    height: 120,
    backgroundColor: '#667eea',
    top: -60,
    right: -30,
  },
  headerCircle2: {
    width: 80,
    height: 80,
    backgroundColor: '#f093fb',
    top: -40,
    left: -20,
  },
  headerSquare: {
    position: 'absolute',
    opacity: 0.1,
  },
  headerSquare1: {
    width: 30,
    height: 30,
    backgroundColor: '#764ba2',
    top: 20,
    right: width * 0.3,
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 20, 40, 0.6)',
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: '#0f0f23',
    overflow: 'hidden',
    position: 'relative',
  },
  tabCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.12,
  },
  tabCircle1: {
    width: 100,
    height: 100,
    backgroundColor: '#667eea',
    bottom: -50,
    left: -25,
  },
  tabCircle2: {
    width: 80,
    height: 80,
    backgroundColor: '#764ba2',
    bottom: -40,
    right: -20,
  },
  tabSquare: {
    position: 'absolute',
    opacity: 0.08,
  },
  tabSquare1: {
    width: 25,
    height: 25,
    backgroundColor: '#f093fb',
    top: 15,
    left: width * 0.5,
    transform: [{ rotate: '30deg' }],
    borderRadius: 3,
  },
  tabLine: {
    position: 'absolute',
    backgroundColor: '#667eea',
    opacity: 0.06,
  },
  tabLine1: {
    width: 1,
    height: 40,
    top: 10,
    right: width * 0.25,
    transform: [{ rotate: '15deg' }],
  },
  tabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 20, 40, 0.7)',
  },
});
