import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [location, setLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Token'ı al (login yapıldığını varsay)
    AsyncStorage.getItem('token').then(t => setToken(t));
    // WebSocket bağlantısı
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin gerekli');
      return;
    }
    // Konum takibi başlat
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 saniye
        distanceInterval: 10,
      },
      async (loc) => {
        const { latitude, longitude, speed, heading } = loc.coords;
        // API'ye gönder
        try {
          await fetch('http://localhost:5000/api/konum', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              enlem: latitude,
              boylam: longitude,
              hiz: speed ? speed * 3.6 : null,
              yon: heading,
            }),
          });
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Servigo - Şoför Konum Paylaşımı</Text>
      <Button title="Konum Paylaşımını Başlat" onPress={startTracking} />
    </View>
  );
}