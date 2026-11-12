import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OrderProvider } from './context/OrderContext';
import MenuScreen from './screens/MenuScreen';
import DetailScreen from './screens/DetailScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <OrderProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Menu"
            screenOptions={{
              headerStyle: { backgroundColor: '#E05A47' },
              headerTintColor: '#FAFAFA',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'BentoX Amirul' }} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Maklumat Pesanan' }} />
            <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Ringkasan Pesanan' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </OrderProvider>
    </SafeAreaProvider>
  );
}