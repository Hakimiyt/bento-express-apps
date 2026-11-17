import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OrderProvider } from './context/OrderContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import MenuScreen from './screens/MenuScreen';
import DetailScreen from './screens/DetailScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#E05A47' },
          headerTintColor: '#FAFAFA',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'BentoX Amirul' }} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Maklumat Pesanan' }} />
            <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Ringkasan Pesanan' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil Saya' }} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Log masuk', headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OrderProvider>
          <AppNavigator />
        </OrderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}